const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    // ── Razorpay identifiers ─────────────────────────────────────────────────
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay order ID is required'],
      unique: true,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: null,
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Amount fields (all stored in smallest currency unit — paise for INR) ─
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [1, 'Amount must be at least 1 paise'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    // Convenience: amount in rupees (populated at creation)
    amountInRupees: {
      type: Number,
    },

    // ── Status lifecycle ─────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['created', 'attempted', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'created',
    },

    // ── Purpose — what this payment is for ───────────────────────────────────
    // e.g. 'course_enrollment', 'accommodation_booking', 'subscription', 'donation'
    purpose: {
      type: String,
      required: [true, 'Payment purpose is required'],
      trim: true,
    },
    // ID of the related resource (course _id, accommodation _id, etc.)
    purposeId: {
      type: mongoose.Schema.ObjectId,
      default: null,
    },
    // The model the purposeId belongs to — makes populate() easy later
    purposeModel: {
      type: String,
      trim: true,
      default: null,
    },

    // ── User ────────────────────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'EmailUser',
      required: [true, 'User is required'],
    },

    // ── Razorpay receipt (short label visible in Razorpay dashboard) ─────────
    receipt: {
      type: String,
      trim: true,
    },

    // ── Razorpay notes (key-value pairs forwarded to Razorpay) ───────────────
    notes: {
      type: Map,
      of: String,
      default: {},
    },

    // ── Webhook verification ─────────────────────────────────────────────────
    webhookVerified: {
      type: Boolean,
      default: false,
    },
    webhookEvent: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Refund fields ────────────────────────────────────────────────────────
    refundId: {
      type: String,
      trim: true,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'processed', 'failed'],
      default: 'none',
    },
    refundReason: {
      type: String,
      trim: true,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },

    // ── Extra metadata (free-form, useful for debugging) ─────────────────────
    metadata: {
      type: Object,
      default: {},
    },

    // ── Timestamps for key events ────────────────────────────────────────────
    paidAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ purpose: 1, purposeId: 1 });

// ── Virtual: formatted amount ─────────────────────────────────────────────────
PaymentSchema.virtual('formattedAmount').get(function () {
  return `${this.currency} ${(this.amount / 100).toFixed(2)}`;
});

module.exports = mongoose.model('Payment', PaymentSchema);
