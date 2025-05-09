const User = require('../models/User');
const Referral = require('../models/Referral');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, mobile, college, course, year, referralCode } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorResponse('User already exists with that email', 400));
    }
    
    // If referral code is provided, verify it first
    let referrer = null;
    if (referralCode) {
      // Find the referring institute
      referrer = await User.findOne({ referralCode, role: 'institute' });
      
      if (!referrer) {
        return next(new ErrorResponse('Invalid referral code', 400));
      }
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password,
      mobile,
      college,
      course,
      year,
      role: 'user' // Ensure role is always 'user' for this endpoint
    });

    // Save user
    await user.save();

    // If valid referral code was provided, link the accounts
    if (referrer) {
      // Update the new user with referredBy
      user.referredBy = referrer._id;
      await user.save();
      
      // Create a referral record
      const referral = new Referral({
        referrer: referrer._id,
        referred: user._id,
        referralCode
      });
      await referral.save();
      
      // Add this user to the referrer's referrals list
      await referrer.addReferral(user);
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create institute account (admin only)
// @route   POST /api/users/institute
// @access  Private/Admin
exports.createInstituteAccount = async (req, res, next) => {
  try {
    const { name, email, password, mobile, customReferralCode } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists with that email', 400));
    }

    // If custom referral code is provided, check if it's already in use
    if (customReferralCode) {
      const existingCode = await User.findOne({ referralCode: customReferralCode });
      if (existingCode) {
        return next(new ErrorResponse('Referral code already in use', 400));
      }
    }
    
    // Create new institute account
    const institute = new User({
      name,
      email,
      password,
      mobile,
      role: 'institute',
      referralCode: customReferralCode // Will be auto-generated if not provided
    });

    // Save institute account
    await institute.save();

    res.status(201).json({
      success: true,
      data: {
        _id: institute._id,
        name: institute.name,
        email: institute.email,
        role: institute.role,
        referralCode: institute.referralCode
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate JWT Token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('referredBy', 'name email');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      mobile: req.body.mobile,
      college: req.body.college,
      course: req.body.course,
      year: req.body.year
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's referrals
// @route   GET /api/users/referrals
// @access  Private
exports.getUserReferrals = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      count: user.referrals.length,
      data: user.referrals
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const role = req.query.role || 'user';
    const users = await User.find({ role });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Promote user to admin
// @route   PUT /api/users/:id/promote
// @access  Private/Admin
exports.promoteToAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is already an admin
    if (user.role === 'admin') {
      return next(new ErrorResponse('User is already an admin', 400));
    }
    
    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
}; 