const express = require('express');
const {
  getServerHealth,
  getApiStats
} = require('../controllers/serverController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All server monitoring routes are protected and admin-only
router.get('/health', protect, authorize('admin'), getServerHealth);
router.get('/api-stats', protect, authorize('admin'), getApiStats);

module.exports = router;
