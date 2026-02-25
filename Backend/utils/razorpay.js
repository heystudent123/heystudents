const Razorpay = require('razorpay');

let razorpayInstance = null;

/**
 * Returns a singleton Razorpay instance.
 * Throws clearly if credentials are missing so developers notice early.
 */
const getRazorpay = () => {
  if (razorpayInstance) return razorpayInstance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay credentials missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env'
    );
  }

  razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayInstance;
};

module.exports = getRazorpay;
