const Accommodation = require('../models/Accommodation');
const ErrorResponse = require('../utils/errorResponse');

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
    // Add user id to req.body
    req.body.createdBy = req.user.id;

    // Map incoming 'features' (from frontend) to 'amenities' field expected by schema
    if (req.body.features && !req.body.amenities) {
      req.body.amenities = Array.isArray(req.body.features)
        ? req.body.features
        : [req.body.features];
      delete req.body.features;
    }

    // Handle uploaded files – multer-storage-cloudinary puts the hosted URL in file.path
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((f) => f.path);
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
      req.body.amenities = Array.isArray(req.body.features)
        ? req.body.features
        : [req.body.features];
      delete req.body.features;
    }

    accommodation = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
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
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return next(new ErrorResponse(`Accommodation not found with id of ${req.params.id}`, 404));
    }
    
    await accommodation.remove();
    
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