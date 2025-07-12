const express = require('express');
const { validateReferralCode } = require('../controllers/validationController');

const router = express.Router();

// Validate referral code
router.post('/validate-referral', validateReferralCode);

module.exports = router;
