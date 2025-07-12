const express = require('express');
const {
  registerUser,
  loginWithPhone,
  getMe,
  updateProfile,
  getUserReferrals,
  getUsers,
  getUserById,
  promoteToAdmin,
  createInstituteAccount,
  completeProfile
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login-phone', loginWithPhone);
router.post('/complete-profile', completeProfile);

// Protected routes (logged-in users)
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/referrals', protect, getUserReferrals);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id/promote', protect, authorize('admin'), promoteToAdmin);
router.post('/institute', protect, authorize('admin'), createInstituteAccount);

// Institute routes
router.get('/referrals', protect, authorize('institute', 'admin'), getUserReferrals);

module.exports = router; 