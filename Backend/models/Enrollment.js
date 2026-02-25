const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'EmailUser',
      required: true,
    },
    // We store the course slug / identifier so it works even without a DB course record
    courseSlug: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional: reference to Course doc if one exists
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      default: null,
    },
    // The payment that unlocked this enrollment
    paymentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
      required: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    // Optional future expiry
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments for same user + course
EnrollmentSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });
EnrollmentSchema.index({ userId: 1 });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
