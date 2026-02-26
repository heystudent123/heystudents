const express = require('express');
const { validateReferralCode } = require('../controllers/validationController');
const { referralLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validate referral code
router.post('/validate-referral', referralLimiter, validateReferralCode);
router.get('/referral/:code', referralLimiter, validateReferralCode);

module.exports = router;
