const express = require('express');
const {
  getUploadUrl,
  createVideo,
  getAdminVideos,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  checkVideoStatus,
  checkVideoStatusByUid,
} = require('../controllers/videoController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ─── Static / collection routes (must come BEFORE :id dynamic routes) ────────
router.get('/admin/all', protect, authorize('admin'), getAdminVideos);
router.post('/upload-url', protect, authorize('admin'), getUploadUrl);
router.get('/status/:uid', protect, authorize('admin'), checkVideoStatusByUid);

// ─── Public collection ────────────────────────────────────────────────────────
router.get('/', getVideos);
router.post('/', protect, authorize('admin'), createVideo);

// ─── Dynamic :id routes ───────────────────────────────────────────────────────
router.get('/:id/status', protect, authorize('admin'), checkVideoStatus);
router.get('/:id', getVideo);
router.put('/:id', protect, authorize('admin'), updateVideo);
router.delete('/:id', protect, authorize('admin'), deleteVideo);

module.exports = router;
