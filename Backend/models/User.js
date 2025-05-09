const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  mobile: {
    type: String,
    required: [true, 'Please provide a mobile number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number']
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
  role: {
    type: String,
    enum: ['user', 'admin', 'institute'],
    default: 'user'
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
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
    email: String,
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
  }
});

// Generate a referral code before saving (only for institute accounts)
UserSchema.pre('save', async function(next) {
  // Hash password before saving
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Only generate referral code for institute accounts if not already set
  // Regular users will not have referral codes
  if (this.role === 'institute' && !this.referralCode) {
    // Use first 4 characters of institute's name + random 4 characters
    const namePrefix = this.name.substring(0, 4).toUpperCase();
    const randomChars = crypto.randomBytes(2).toString('hex').toUpperCase();
    this.referralCode = `${namePrefix}${randomChars}`;
  }

  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add a user to referrals list with more details
UserSchema.methods.addReferral = async function(referredUser) {
  this.referrals.push({
    user: referredUser._id,
    name: referredUser.name,
    email: referredUser.email,
    mobile: referredUser.mobile,
    college: referredUser.college,
    course: referredUser.course,
    year: referredUser.year
  });
  
  await this.save();
};

module.exports = mongoose.model('User', UserSchema); 