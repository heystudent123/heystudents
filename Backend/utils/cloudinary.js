const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure with ENV vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config – store inside a dedicated folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'heystudents/accommodations',
    format: async () => 'jpg', // keep original format or force jpeg
    public_id: (req, file) => `${Date.now()}-${file.originalname}`.replace(/\s+/g, '-')
  },
});

// Multer middleware ready to plug into routes
const upload = multer({ storage });

module.exports = { cloudinary, upload };
