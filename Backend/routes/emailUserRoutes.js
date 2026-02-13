const express = require('express');
const {
  syncUser,
  getMe,
  updateProfile,
  completeProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/emailUserController');

const router = express.Router();

// Middleware to protect routes (will use the same auth middleware)
const { protect } = require('../middleware/auth');

// Sync user from Clerk (no auth required - uses Clerk token)
router.post('/sync', syncUser);

// Protected routes
router.use(protect);

// Get current user
router.get('/me', getMe);

// Profile routes
router.put('/profile', updateProfile);
router.post('/complete-profile', completeProfile);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:accommodationId', removeFromWishlist);

module.exports = router;
