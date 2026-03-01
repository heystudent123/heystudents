const mongoose = require('mongoose');

const PrePaymentLeadSchema = new mongoose.Schema(
  {
    // Basic student info (collected before payment)
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    college: {
      type: String,
      trim: true,
      default: null,
    },
    // Which course they were interested in
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      default: null,
    },
    courseTitle: {
      type: String,
      trim: true,
      default: null,
    },
    // Referral code if they entered one
    referralCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    // Linked to a user account if they were logged in
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'EmailUser',
      default: null,
    },
    // Whether they eventually paid (updated on payment success)
    converted: {
      type: Boolean,
      default: false,
    },
    // Razorpay order ID if payment was initiated
    razorpayOrderId: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

PrePaymentLeadSchema.index({ phone: 1 });
PrePaymentLeadSchema.index({ email: 1 });
PrePaymentLeadSchema.index({ createdAt: -1 });
PrePaymentLeadSchema.index({ converted: 1 });

module.exports = mongoose.model('PrePaymentLead', PrePaymentLeadSchema);
