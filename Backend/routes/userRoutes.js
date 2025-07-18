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
  validateReferralCode,
  completeProfile,
  deleteUser,
  getRegisteredUsers,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login-phone', loginWithPhone);
router.post('/complete-profile', completeProfile);
router.post('/validate-referral-code', validateReferralCode);

// Protected routes (logged-in users)
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/referrals', protect, getUserReferrals);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:accommodationId', protect, removeFromWishlist);

// Admin routes - only basic authentication required
// Admin check is already done at the admin panel level
router.get('/', protect, getUsers);

// Route for getting registered users (must be before /:id route to avoid conflict)
router.get('/registered', protect, getRegisteredUsers);

// Routes with ID parameter
router.get('/:id', protect, getUserById);
router.delete('/:id', protect, deleteUser);
router.put('/:id/promote', protect, promoteToAdmin);


// User referrals route
router.get('/referrals', protect, getUserReferrals);

module.exports = router; 