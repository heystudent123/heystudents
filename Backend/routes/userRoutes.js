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
  promoteToInstitute,
  createInstituteAccount,
  completeProfile,
  deleteUser,
  getRegisteredUsers
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

// Route for getting registered users (must be before /:id route to avoid conflict)
router.get('/registered', protect, authorize('admin'), getRegisteredUsers);

// Routes with ID parameter
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/promote', protect, authorize('admin'), promoteToAdmin);
router.put('/:id/promote-to-institute', protect, authorize('admin'), promoteToInstitute);

router
  .route('/institute')
  .post(protect, authorize('admin'), createInstituteAccount);

// Institute routes
router.get('/referrals', protect, authorize('institute', 'admin'), getUserReferrals);

module.exports = router; 