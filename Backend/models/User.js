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
    // Allow more flexible phone number formats
    match: [/^[0-9]{8,15}$/, 'Please provide a valid phone number (8-15 digits)'],
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
  // Referral code for institutes
  referralCode: {
    type: String,
    // unique constraint removed to avoid duplicate key errors
    trim: true,
    default: undefined // Explicitly set default to undefined to avoid null values
  },
  // Referral code used by students during registration
  referrerCodeUsed: {
    type: String,
    trim: true
  },
  // User who referred this user
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Users referred by this user
  referrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  verificationExpire: Date,
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation'
  }]
});





// Add a pre-save hook to ensure referralCode is unique only when it's set
UserSchema.pre('save', async function(next) {
  // Only check uniqueness if referralCode is set and modified
  if (this.referralCode && this.isModified('referralCode')) {
    const existingUser = await this.constructor.findOne({ referralCode: this.referralCode });
    if (existingUser && existingUser._id.toString() !== this._id.toString()) {
      return next(new Error('Referral code already exists'));
    }
  }
  next();
});

// Create a custom index for non-null referralCodes
UserSchema.index({ referralCode: 1 }, { 
  unique: true, 
  sparse: true, 
  partialFilterExpression: { referralCode: { $type: 'string' } } 
});

module.exports = mongoose.model('User', UserSchema); 