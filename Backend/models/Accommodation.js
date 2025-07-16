const mongoose = require('mongoose');

const AccommodationSchema = new mongoose.Schema({
  // name field removed as per requirements
  type: {
    type: String,
    required: false,
    enum: ['PG', 'Hostel', 'Flat', 'Other']
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  // address field removed as per requirements
  nearestCollege: {
    type: [String],
    required: false
  },
  distanceFromCollege: {
    type: Number,
    required: false
  },
  // Unique internal code/reference for accommodation
  uniqueCode: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  // Starting price for accommodation
  startingFrom: {
    type: String,
    required: false,
    trim: true
  },
  nearestMetro: {
    type: String,
    required: false,
    trim: true
  },
  distanceFromMetro: {
    type: Number,
    required: false
  },
  rent: {
    type: Number,
    required: false
  },
  securityDeposit: {
    type: Number,
    required: false
  },
  availableFor: {
    type: String,
    required: false,
    enum: ['Boys', 'Girls', 'Both']
  },
  roomTypes: [{
    type: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Other'],
      required: false
    },
    price: {
      type: Number,
      required: false
    },
    availability: {
      type: Number,
      required: false
    }
  }],
  amenities: {
    type: [String],
    required: false
  },
  food: {
    available: {
      type: Boolean,
      default: false
    },
    vegOnly: {
      type: Boolean,
      default: false
    },
    mealTypes: {
      type: [String],
      required: false
    }
  },
  rules: {
    type: [String],
    required: false
  },
  // contactDetails field removed as per requirements
  images: {
    type: [String],
    required: false,
    default: ['default-accommodation.jpg']
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: false
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating when reviews are modified
AccommodationSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  } else {
    this.averageRating = undefined;
  }
  next();
});

module.exports = mongoose.model('Accommodation', AccommodationSchema); 