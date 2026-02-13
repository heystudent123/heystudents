const mongoose = require('mongoose');

const EmailUserSchema = new mongoose.Schema({
  // Clerk user ID for authentication (primary identifier)
  clerkId: {
    type: String,
    required: [true, 'Clerk ID is required'],
    unique: true,
    trim: true
  },
  
  // Email address (required for Clerk users)
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  
  // User's full name
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  
  // Optional phone number
  phone: {
    type: String,
    required: false,
    trim: true
  },
  
  // Academic information
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
  
  // Address information
  address: {
    type: String,
    required: false,
    trim: true
  },
  
  // User role
  role: {
    type: String,
    enum: ['student', 'admin', 'institute'],
    default: 'student'
  },
  
  // Referral system
  referralCode: {
    type: String,
    trim: true,
    default: undefined
  },
  referrerCodeUsed: {
    type: String,
    trim: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailUser'
  },
  referrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailUser'
  }],
  
  // Profile completion tracking
  profileCompleted: {
    type: Boolean,
    default: false
  },
  
  // Verification status (for institutes)
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpire: Date,
  
  // Wishlist functionality
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation'
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
EmailUserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure referralCode is unique when set
EmailUserSchema.pre('save', async function(next) {
  if (this.referralCode && this.isModified('referralCode')) {
    const existingUser = await this.constructor.findOne({ referralCode: this.referralCode });
    if (existingUser && existingUser._id.toString() !== this._id.toString()) {
      return next(new Error('Referral code already exists'));
    }
  }
  next();
});

// Create index for unique referral codes
EmailUserSchema.index({ referralCode: 1 }, { 
  unique: true, 
  sparse: true, 
  partialFilterExpression: { referralCode: { $type: 'string' } } 
});

// Index for email lookups
EmailUserSchema.index({ email: 1 });
// Index for clerkId lookups
EmailUserSchema.index({ clerkId: 1 });

module.exports = mongoose.model('EmailUser', EmailUserSchema);
