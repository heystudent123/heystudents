const express = require('express');
const {
  getPostsForCourse,
  getAdminPosts,
  createPost,
  updatePost,
  deletePost,
  uploadAttachment,
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAttachment: uploadMiddleware } = require('../utils/postUpload');

const router = express.Router();

// Admin routes (static — before :courseSlug)
router.get('/admin/all', protect, authorize('admin'), getAdminPosts);
router.post('/upload-attachment', protect, authorize('admin'), uploadMiddleware.single('file'), uploadAttachment);
router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

// Student route — enrolled users only
router.get('/:courseSlug', protect, getPostsForCourse);

module.exports = router;
