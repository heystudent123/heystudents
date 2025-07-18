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
  // Referral code for institutes
  referralCode: {
    type: String,
    unique: true,
    sparse: true, // This ensures the unique index only applies to documents that have the field
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





module.exports = mongoose.model('User', UserSchema); 