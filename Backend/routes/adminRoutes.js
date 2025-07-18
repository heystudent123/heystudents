const express = require('express');
const {
  adminLogin,
  getDashboardStats,
  getAllReferrals,
  createAdmin,
  verifyAccommodation,
  promoteToInstitute,
  getInstitutes
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

// Institute management routes
router.put('/users/:id/promote-to-institute', protect, authorize('admin'), promoteToInstitute);
router.get('/institutes', protect, authorize('admin'), getInstitutes);

module.exports = router; 