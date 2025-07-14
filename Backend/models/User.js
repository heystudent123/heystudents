const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  // Primary phone number (required)
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    unique: true
  },
  // Legacy mobile field kept for backward compatibility (will mirror `phone`)
  mobile: {
    type: String,
    required: false
  },
  // Optional email address
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  college: {
    type: String,
    required: false,
    trim: true
  },
  course: {
    type: String,
    required: false,
    trim: true
  },
  year: {
    type: String,
    required: false,
    enum: ['1', '2', '3', '4', 'alumni', '']
  },
  address: {
    type: String,
    required: false,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'institute'],
    default: 'student'
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  referrals: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    mobile: String,
    college: String,
    course: String,
    year: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpire: Date
});

// Generate and hash referral code
UserSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    // Ensure referral code is unique
    const existingUser = await this.constructor.findOne({ referralCode: this.referralCode });
    if (existingUser) {
      this.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
  }
  next();
});

// Add a user to referrals list with more details
UserSchema.methods.addReferral = async function(referredUser) {
  this.referrals.push({
    user: referredUser._id,
    name: referredUser.name,
    mobile: referredUser.mobile,
    college: referredUser.college,
    course: referredUser.course,
    year: referredUser.year
  });
  
  await this.save();
};

module.exports = mongoose.model('User', UserSchema); 