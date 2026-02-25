const express = require('express');
const {
  checkEnrollment,
  getMyEnrollments,
  getAllEnrollments,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseSlug', protect, checkEnrollment);
router.get('/admin/all', protect, authorize('admin'), getAllEnrollments);

module.exports = router;
