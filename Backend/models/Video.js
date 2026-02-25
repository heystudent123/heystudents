const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a video title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: [
        'General',
        'Tutorial',
        'Event',
        'News',
        'Campus Tour',
        'Accommodation',
        'Career',
        'Other',
      ],
      default: 'General',
    },
    // Cloudflare Stream video UID
    cloudflareVideoId: {
      type: String,
      required: [true, 'Cloudflare video ID is required'],
      unique: true,
    },
    // Thumbnail URL (Cloudflare auto-generates: https://videodelivery.net/{uid}/thumbnails/thumbnail.jpg)
    thumbnail: {
      type: String,
      default: '',
    },
    // Duration in seconds (populated after Cloudflare processes the video)
    duration: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    // Whether Cloudflare has finished processing the video
    isReady: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'EmailUser',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', VideoSchema);
