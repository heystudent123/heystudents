const Post = require('../models/Post');
const Enrollment = require('../models/Enrollment');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Upload a single attachment file to Cloudinary
// @route   POST /api/posts/upload-attachment
// @access  Private/Admin
exports.uploadAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('No file uploaded', 400));
    }
    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        public_id: req.file.filename,
        originalName: req.file.originalname,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all published posts for a course (student — must be enrolled)
// @route   GET /api/posts/:courseSlug
// @access  Private
exports.getPostsForCourse = async (req, res, next) => {
  try {
    const { courseSlug } = req.params;

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseSlug,
      isActive: true,
    });

    if (!enrollment) {
      return next(
        new ErrorResponse('You are not enrolled in this course', 403)
      );
    }

    const posts = await Post.find({ courseSlug, isPublished: true })
      .sort({ isPinned: -1, createdAt: -1 })
      .populate('publishedBy', 'name')
      .lean();

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all posts for admin (all courses, any status)
// @route   GET /api/posts/admin/all
// @access  Private/Admin
exports.getAdminPosts = async (req, res, next) => {
  try {
    const { courseSlug } = req.query;
    const filter = courseSlug ? { courseSlug } : {};

    const posts = await Post.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .populate('publishedBy', 'name email')
      .lean();

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a post (admin)
// @route   POST /api/posts
// @access  Private/Admin
exports.createPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      courseSlug = 'du-campus-advantage',
      attachments,
      coverImage,
      tag,
      isPinned,
      isPublished,
    } = req.body;

    const post = await Post.create({
      title,
      content,
      courseSlug,
      attachments: attachments || [],
      coverImage: coverImage || '',
      tag: tag || 'general',
      isPinned: isPinned || false,
      isPublished: isPublished !== undefined ? isPublished : true,
      publishedBy: req.user._id,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a post (admin)
// @route   PUT /api/posts/:id
// @access  Private/Admin
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) return next(new ErrorResponse('Post not found', 404));

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a post (admin)
// @route   DELETE /api/posts/:id
// @access  Private/Admin
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorResponse('Post not found', 404));

    await post.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
