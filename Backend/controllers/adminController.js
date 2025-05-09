const User = require('../models/User');
const Alumni = require('../models/Alumni');
const Accommodation = require('../models/Accommodation');
const Referral = require('../models/Referral');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for admin user
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!admin) {
      return next(new ErrorResponse('Invalid admin credentials', 401));
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate JWT Token
    const token = admin.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });
    const alumniCount = await Alumni.countDocuments();
    const accommodationCount = await Accommodation.countDocuments();
    const referralCount = await Referral.countDocuments();
    
    // Get recent users (last 5)
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email mobile createdAt');
    
    // Get recent accommodations (last 5)
    const recentAccommodations = await Accommodation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type address.area rent createdAt');
    
    // Get referral statistics
    const topReferrers = await User.aggregate([
      { $match: { role: 'user' } },
      { $project: { name: 1, email: 1, referralCount: { $size: '$referrals' } } },
      { $sort: { referralCount: -1 } },
      { $limit: 5 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          alumni: alumniCount,
          accommodations: accommodationCount,
          referrals: referralCount
        },
        recentUsers,
        recentAccommodations,
        topReferrers
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all referrals
// @route   GET /api/admin/referrals
// @access  Private/Admin
exports.getAllReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find()
      .populate('referrer', 'name email')
      .populate('referred', 'name email createdAt');
    
    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new admin user
// @route   POST /api/admin/create
// @access  Private/Admin
exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check if user already exists
    let admin = await User.findOne({ email });
    if (admin) {
      return next(new ErrorResponse('User already exists with that email', 400));
    }
    
    // Create new admin user
    admin = await User.create({
      name,
      email,
      password,
      mobile,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update accommodation verification status
// @route   PUT /api/admin/accommodations/:id/verify
// @access  Private/Admin
exports.verifyAccommodation = async (req, res, next) => {
  try {
    const { verified } = req.body;
    
    if (verified === undefined) {
      return next(new ErrorResponse('Please provide verification status', 400));
    }
    
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      { verified },
      { new: true, runValidators: true }
    );
    
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