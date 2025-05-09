const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'converted'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure that a referral between the same users is not created twice
ReferralSchema.index({ referrer: 1, referred: 1 }, { unique: true });

module.exports = mongoose.model('Referral', ReferralSchema); 