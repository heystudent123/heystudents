const express = require('express');
const {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  addAccommodationReview
} = require('../controllers/accommodationController');

const { protect, authorize } = require('../middleware/auth');

const multer = require('multer');
// store uploaded images to /uploads directory
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Public routes
router.get('/', getAccommodations);
router.get('/:id', getAccommodationById);

// Protected routes
router.post('/:id/reviews', protect, addAccommodationReview);

// Admin only routes
router.post('/', protect, authorize('admin'), createAccommodation);
router.put('/:id', protect, authorize('admin'), updateAccommodation);
router.delete('/:id', protect, authorize('admin'), deleteAccommodation);

module.exports = router; 