const express = require('express');
const {
  validateReferralCode,
  getMyReferralCode,
  getReferredUsers,
  getMyReferrer,
  generateNewReferralCode,
  verifyReferralCode,
  getReferrals
} = require('../controllers/referralController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/validate/:code', validateReferralCode);
router.get('/verify/:code', verifyReferralCode);

// Protected routes
router.get('/my-code', protect, getMyReferralCode);
router.get('/referred-users', protect, getReferredUsers);
router.get('/my-referrer', protect, getMyReferrer);
router.post('/generate-code', protect, generateNewReferralCode);

// Admin and institute routes
router.get('/', protect, authorize('admin', 'institute'), getReferrals);

module.exports = router; 