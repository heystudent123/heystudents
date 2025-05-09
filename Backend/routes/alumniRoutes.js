const express = require('express');
const {
  getAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
} = require('../controllers/alumniController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAlumni);
router.get('/:id', getAlumniById);

// Admin only routes
router.post('/', protect, authorize('admin'), createAlumni);
router.put('/:id', protect, authorize('admin'), updateAlumni);
router.delete('/:id', protect, authorize('admin'), deleteAlumni);

module.exports = router; 