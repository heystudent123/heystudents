const Accommodation = require('../models/Accommodation');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Check if uniqueCode already exists
// @route   GET /api/accommodations/check-unique-code/:code
// @access  Private/Admin
exports.checkUniqueCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    
    // Find accommodation with this uniqueCode
    const accommodation = await Accommodation.findOne({ uniqueCode: code });
    
    if (accommodation) {
      // Return exists=true and the id of the accommodation
      return res.status(200).json({
        success: true,
        exists: true,
        id: accommodation._id.toString()
      });
    }
    
    // No accommodation found with this uniqueCode
    return res.status(200).json({
      success: true,
      exists: false
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all accommodations
// @route   GET /api/accommodations
// @access  Public
exports.getAccommodations = async (req, res, next) => {
  try {
    // Build query
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Accommodation.find(JSON.parse(queryStr));
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Accommodation.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const accommodations = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: accommodations.length,
      pagination,
      data: accommodations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single accommodation
// @route   GET /api/accommodations/:id
// @access  Public
exports.getAccommodationById = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return next(new ErrorResponse(`Accommodation not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: accommodation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new accommodation
// @route   POST /api/accommodations
// @access  Private/Admin
exports.createAccommodation = async (req, res, next) => {
  try {
    // Add user id to req.body if user exists
    if (req.user && req.user.id) {
      req.body.createdBy = req.user.id;
    }

    // Remove empty _id coming from front-end in create mode
    if (req.body._id === '') {
      delete req.body._id;
    }
    // Map incoming 'features' (from frontend) to 'amenities' field expected by schema
    if (req.body.features && !req.body.amenities) {
      // Make sure features is an array
      const features = Array.isArray(req.body.features) ? req.body.features : [req.body.features];
      
      // Extract food preferences from features
      const vegOnly = features.includes('Veg') && !features.includes('Non-veg');
      const hasNonVeg = features.includes('Non-veg');
      
      // Set food object properties
      if (!req.body.food) {
        req.body.food = {};
      }
      
      // If we have food preferences, set the food properties
      if (features.includes('Veg') || features.includes('Non-veg')) {
        req.body.food.available = true;
        req.body.food.vegOnly = vegOnly;
      }
      
      // Set amenities from features (excluding food preferences)
      req.body.amenities = features;
      
      // Log what we're doing for debugging
      console.log('Food preferences detected:', { 
        vegOnly, 
        hasNonVeg, 
        features, 
        amenities: req.body.amenities,
        food: req.body.food
      });
      
      delete req.body.features;
    }
    
    // Convert priceRange to startingFrom if needed
    if (req.body.priceRange && !req.body.startingFrom) {
      req.body.startingFrom = req.body.priceRange;
      delete req.body.priceRange;
    }


    
    const accommodation = await Accommodation.create(req.body);
    
    res.status(201).json({
      success: true,
      data: accommodation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update accommodation
// @route   PUT /api/accommodations/:id
// @access  Private/Admin
exports.updateAccommodation = async (req, res, next) => {
  try {
    let accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return next(new ErrorResponse(`Accommodation not found with id of ${req.params.id}`, 404));
    }
    
    // Map 'features' to 'amenities' for updates as well
    if (req.body.features && !req.body.amenities) {
      // Make sure features is an array
      const features = Array.isArray(req.body.features) ? req.body.features : [req.body.features];
      
      // Extract food preferences from features
      const vegOnly = features.includes('Veg') && !features.includes('Non-veg');
      const hasNonVeg = features.includes('Non-veg');
      
      // Set food object properties
      if (!req.body.food) {
        req.body.food = {};
      }
      
      // If we have food preferences, set the food properties
      if (features.includes('Veg') || features.includes('Non-veg')) {
        req.body.food.available = true;
        req.body.food.vegOnly = vegOnly;
      }
      
      // Set amenities from features (excluding food preferences)
      req.body.amenities = features;
      
      // Log what we're doing for debugging
      console.log('Food preferences detected in update:', { 
        vegOnly, 
        hasNonVeg, 
        features, 
        amenities: req.body.amenities,
        food: req.body.food
      });
      
      delete req.body.features;
    }
    
    // Convert priceRange to startingFrom if needed
    if (req.body.priceRange && !req.body.startingFrom) {
      req.body.startingFrom = req.body.priceRange;
      delete req.body.priceRange;
    }

    accommodation = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: false
    });
    
    res.status(200).json({
      success: true,
      data: accommodation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete accommodation
// @route   DELETE /api/accommodations/:id
// @access  Private/Admin
exports.deleteAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!accommodation) {
      return next(new ErrorResponse(`Accommodation not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add review to accommodation
// @route   POST /api/accommodations/:id/reviews
// @access  Private
exports.addAccommodationReview = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.name = req.user.name;
    
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return next(new ErrorResponse(`Accommodation not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user already reviewed this accommodation
    const alreadyReviewed = accommodation.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );
    
    if (alreadyReviewed) {
      return next(new ErrorResponse('You have already reviewed this accommodation', 400));
    }
    
    accommodation.reviews.push(req.body);
    
    await accommodation.save();
    
    res.status(201).json({
      success: true,
      data: accommodation
    });
  } catch (err) {
    next(err);
  }
}; 