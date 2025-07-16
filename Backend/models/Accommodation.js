const mongoose = require('mongoose');

const AccommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Please provide accommodation type'],
    enum: ['PG', 'Hostel', 'Flat', 'Other']
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please provide street address'],
      trim: true
    },
    area: {
      type: String,
      required: false,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      default: 'Delhi'
    },
    pincode: {
      type: String,
      required: false,
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
    }
  },
  nearestCollege: {
    type: [String],
    required: false
  },
  distanceFromCollege: {
    type: Number,
    required: false
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
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    availability: {
      type: Number,
      required: true
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
  contactDetails: {
    name: {
      type: String,
      required: false,
      trim: true
    },
    phone: {
      type: String,
      required: false,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    alternatePhone: {
      type: String,
      required: false,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    email: {
      type: String,
      required: false,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    }
  },
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
      required: true
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
    required: true
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