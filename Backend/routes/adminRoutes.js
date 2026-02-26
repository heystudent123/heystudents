const express = require('express');
const {
  adminLogin,
  getDashboardStats,
  getAllReferrals,
  createAdmin,
  verifyAccommodation,
  promoteToInstitute,
  getInstitutes,
  getUsersByReferralCode,
  getEmailUsers,
  promoteEmailUserToAdmin,
  deleteEmailUser,
  getPaidUsers
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.post('/login', authLimiter, adminLogin);

// Protected admin routes
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/referrals', protect, authorize('admin'), getAllReferrals);
router.post('/create', protect, authorize('admin'), createAdmin);
router.put('/accommodations/:id/verify', protect, authorize('admin'), verifyAccommodation);

// Institute management routes
router.put('/users/:id/promote-to-institute', protect, authorize('admin'), promoteToInstitute);
router.get('/institutes', protect, authorize('admin'), getInstitutes);
router.get('/users-by-referral/:referralCode', protect, authorize('admin'), getUsersByReferralCode);

// Email-user admin routes (new schema)
router.get('/email-users', protect, authorize('admin'), getEmailUsers);
router.put('/email-users/:id/promote-to-admin', protect, authorize('admin'), promoteEmailUserToAdmin);
router.delete('/email-users/:id', protect, authorize('admin'), deleteEmailUser);

// Paid users
router.get('/paid-users', protect, authorize('admin'), getPaidUsers);

module.exports = router; 