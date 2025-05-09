const Alumni = require('../models/Alumni');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all alumni
// @route   GET /api/alumni
// @access  Public
exports.getAlumni = async (req, res, next) => {
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
    query = Alumni.find(JSON.parse(queryStr));
    
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
    const total = await Alumni.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const alumni = await query;
    
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
      count: alumni.length,
      pagination,
      data: alumni
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single alumni
// @route   GET /api/alumni/:id
// @access  Public
exports.getAlumniById = async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    
    if (!alumni) {
      return next(new ErrorResponse(`Alumni not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: alumni
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new alumni
// @route   POST /api/alumni
// @access  Private/Admin
exports.createAlumni = async (req, res, next) => {
  try {
    // Add user id to req.body
    req.body.createdBy = req.user.id;
    
    const alumni = await Alumni.create(req.body);
    
    res.status(201).json({
      success: true,
      data: alumni
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update alumni
// @route   PUT /api/alumni/:id
// @access  Private/Admin
exports.updateAlumni = async (req, res, next) => {
  try {
    let alumni = await Alumni.findById(req.params.id);
    
    if (!alumni) {
      return next(new ErrorResponse(`Alumni not found with id of ${req.params.id}`, 404));
    }
    
    alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: alumni
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete alumni
// @route   DELETE /api/alumni/:id
// @access  Private/Admin
exports.deleteAlumni = async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    
    if (!alumni) {
      return next(new ErrorResponse(`Alumni not found with id of ${req.params.id}`, 404));
    }
    
    await alumni.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 