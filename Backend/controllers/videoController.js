const axios = require('axios');
const Video = require('../models/Video');
const ErrorResponse = require('../utils/errorResponse');

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_STREAM_API_TOKEN;
const CF_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream`;

const cfHeaders = () => ({
  Authorization: `Bearer ${CF_API_TOKEN}`,
  'Content-Type': 'application/json',
});

// @desc    Get a one-time direct upload URL from Cloudflare Stream (TUS)
// @route   POST /api/videos/upload-url
// @access  Private/Admin
exports.getUploadUrl = async (req, res, next) => {
  try {
    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      return next(new ErrorResponse('Cloudflare Stream credentials are not configured', 500));
    }

    const { maxDurationSeconds = 3600 } = req.body;

    const response = await axios.post(
      `${CF_BASE}/direct_upload`,
      {
        maxDurationSeconds: Number(maxDurationSeconds),
        requireSignedURLs: false,
      },
      { headers: cfHeaders() }
    );

    const { uploadURL, uid } = response.data.result;

    res.status(200).json({
      success: true,
      data: { uploadURL, uid },
    });
  } catch (err) {
    console.error('Cloudflare upload URL error:', err.response?.data || err.message);
    next(new ErrorResponse('Failed to get upload URL from Cloudflare Stream', 500));
  }
};

// @desc    Save video metadata after direct upload completes
// @route   POST /api/videos
// @access  Private/Admin
exports.createVideo = async (req, res, next) => {
  try {
    const { title, description, category, cloudflareVideoId, tags } = req.body;

    if (!cloudflareVideoId) {
      return next(new ErrorResponse('cloudflareVideoId is required', 400));
    }

    const video = await Video.create({
      title,
      description,
      category: category || 'General',
      cloudflareVideoId,
      tags: tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      uploadedBy: req.user._id,
      isPublished: false,
      isReady: false,
    });

    res.status(201).json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all videos (admin — all statuses, including unpublished)
// @route   GET /api/videos/admin
// @access  Private/Admin
exports.getAdminVideos = async (req, res, next) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');

    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all published & ready videos (public)
// @route   GET /api/videos
// @access  Public
exports.getVideos = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { isPublished: true, isReady: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .select('-uploadedBy');

    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single published video by ID (increments view count)
// @route   GET /api/videos/:id
// @access  Public
exports.getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).select('-uploadedBy');

    if (!video) {
      return next(new ErrorResponse('Video not found', 404));
    }

    if (!video.isPublished) {
      return next(new ErrorResponse('Video not found', 404));
    }

    // Increment view count
    video.viewCount = (video.viewCount || 0) + 1;
    await video.save();

    res.status(200).json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
};

// @desc    Update video details / publish status
// @route   PUT /api/videos/:id
// @access  Private/Admin
exports.updateVideo = async (req, res, next) => {
  try {
    // Prevent overwriting cloudflareVideoId via update
    delete req.body.cloudflareVideoId;

    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!video) {
      return next(new ErrorResponse('Video not found', 404));
    }

    res.status(200).json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete video (removes from Cloudflare + DB)
// @route   DELETE /api/videos/:id
// @access  Private/Admin
exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return next(new ErrorResponse('Video not found', 404));
    }

    // Delete from Cloudflare Stream
    try {
      await axios.delete(`${CF_BASE}/${video.cloudflareVideoId}`, {
        headers: cfHeaders(),
      });
    } catch (cfErr) {
      console.warn(
        'Could not delete from Cloudflare Stream (continuing with DB delete):',
        cfErr.response?.data || cfErr.message
      );
    }

    await video.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Poll Cloudflare Stream for video processing status
// @route   GET /api/videos/:id/status
// @access  Private/Admin
exports.checkVideoStatus = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return next(new ErrorResponse('Video not found', 404));
    }

    const cfRes = await axios.get(`${CF_BASE}/${video.cloudflareVideoId}`, {
      headers: cfHeaders(),
    });

    const cfVideo = cfRes.data.result;
    const state = cfVideo.status?.state;
    const isReady = state === 'ready';
    const duration = cfVideo.duration || 0;
    const thumbnail = cfVideo.thumbnail || `https://videodelivery.net/${video.cloudflareVideoId}/thumbnails/thumbnail.jpg`;

    // Sync status to DB
    if (video.isReady !== isReady || video.duration !== duration) {
      video.isReady = isReady;
      video.duration = duration;
      video.thumbnail = thumbnail;
      await video.save();
    }

    res.status(200).json({
      success: true,
      data: {
        state,
        isReady,
        duration,
        thumbnail,
        video,
      },
    });
  } catch (err) {
    console.error('Cloudflare status check error:', err.response?.data || err.message);
    next(new ErrorResponse('Failed to check video status from Cloudflare', 500));
  }
};
