const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getUserReferrals,
  getUsers,
  getUserById,
  promoteToAdmin,
  createInstituteAccount
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

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