const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  college: {
    type: String,
    required: [true, 'Please provide a college name'],
    trim: true
  },
  graduationYear: {
    type: Number,
    required: [true, 'Please provide graduation year']
  },
  course: {
    type: String,
    required: [true, 'Please provide a course'],
    trim: true
  },
  currentCompany: {
    type: String,
    required: false,
    trim: true
  },
  designation: {
    type: String,
    required: false,
    trim: true
  },
  linkedInProfile: {
    type: String,
    required: false,
    trim: true
  },
  bio: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  profileImage: {
    type: String,
    required: false,
    default: 'default.jpg'
  },
  isAvailableForMentoring: {
    type: Boolean,
    default: false
  },
  expertiseAreas: {
    type: [String],
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alumni', AlumniSchema); 