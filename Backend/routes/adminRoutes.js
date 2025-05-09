const express = require('express');
const {
  adminLogin,
  getDashboardStats,
  getAllReferrals,
  createAdmin,
  verifyAccommodation
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected admin routes
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/referrals', protect, authorize('admin'), getAllReferrals);
router.post('/create', protect, authorize('admin'), createAdmin);
router.put('/accommodations/:id/verify', protect, authorize('admin'), verifyAccommodation);

module.exports = router; 