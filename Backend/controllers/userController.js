const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Referral = require('../models/Referral');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    // Validate
    if (!name || !phone) {
      return next(new ErrorResponse('Please provide name and phone', 400));
    }

    // Create user
    const user = await User.create({
      name,
      phone
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(201).json({
      success: true,
      token,
      data: user
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
    const { name, mobile, email, password, address, customReferralCode } = req.body;

    // Validate required fields
    if (!name || !mobile) {
      return next(new ErrorResponse('Please provide name and mobile number', 400));
    }

    // Check if user already exists with this mobile number
    let existingUser = await User.findOne({ phone: mobile });
    if (existingUser) {
      return next(new ErrorResponse('User already exists with that mobile number', 400));
    }
    
    // Check if email exists and is unique if provided
    if (email) {
      existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new ErrorResponse('User already exists with that email', 400));
      }
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
      phone: mobile,  // Set phone as the primary identifier
      mobile,        // Keep mobile for backward compatibility
      role: 'institute',
      referralCode: customReferralCode // Will be auto-generated if not provided
    });
    
    // Add optional fields if provided
    if (email) institute.email = email;
    if (password) institute.password = password;
    if (address) institute.address = address;

    // Save institute account
    await institute.save();

    res.status(201).json({
      success: true,
      data: {
        _id: institute._id,
        name: institute.name,
        phone: institute.phone,
        email: institute.email,
        address: institute.address,
        role: institute.role,
        referralCode: institute.referralCode
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user with phone number (OTP verified by Firebase on frontend)
// @route   POST /api/users/login-phone
// @access  Public
exports.loginWithPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Validate
    if (!phone) {
      return next(new ErrorResponse('Please provide a phone number', 400));
    }

    // Find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // TODO: Check if user is verified

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(200).json({
      success: true,
      token,
      data: user
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
    const { referralCode, ...otherUpdates } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // If referral code is being added and user doesn't already have one
    if (referralCode && !user.referralCode) {
      // Check if referral code exists
      const referringUser = await User.findOne({ referralCode });
      
      if (!referringUser) {
        return next(new ErrorResponse('Invalid referral code', 400));
      }
      
      // Set referral code
      user.referralCode = referralCode;
      user.referredBy = referringUser._id;
    } else if (referralCode && user.referralCode) {
      // User already has a referral code
      return next(new ErrorResponse('Referral code can only be added once', 400));
    }

    // Update other fields
    Object.keys(otherUpdates).forEach(key => {
      if (otherUpdates[key] !== undefined) {
        user[key] = otherUpdates[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user by ID (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      college: req.body.college,
      course: req.body.course,
      year: req.body.year,
      email: req.body.email
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
    let query = {};
    
    // If role query param is provided, filter by that role
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    const users = await User.find(query);
    
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

// @desc    Promote user to institute
// @route   PUT /api/users/:id/promote-to-institute
// @access  Private/Admin
exports.promoteToInstitute = async (req, res, next) => {
  try {
    const { customReferralCode } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is already an institute
    if (user.role === 'institute') {
      return next(new ErrorResponse('User is already an institute', 400));
    }

    // If custom referral code is provided, check if it's already in use
    if (customReferralCode) {
      const existingCode = await User.findOne({ referralCode: customReferralCode });
      if (existingCode) {
        return next(new ErrorResponse('Referral code already in use', 400));
      }
      // Set custom referral code
      user.referralCode = customReferralCode;
    } else if (!user.referralCode) {
      // Generate a new referral code if one doesn't exist
      // This will use the generateReferralCode method from the User model
      user.referralCode = await user.constructor.generateReferralCode();
    }
    
    // Update user role to institute
    user.role = 'institute';
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete user profile after OTP verification
// @route   POST /api/users/complete-profile
// @access  Public
exports.completeProfile = async (req, res, next) => {
  try {
    const { uid, fullName, phone, email, referralCode, college, collegeYear } = req.body;

    // Validate required fields
    if (!fullName || !phone) {
      return next(new ErrorResponse('Please provide fullName and phone', 400));
    }

    let user = null;

    if (uid) {
      user = await User.findById(uid);
    }

    if (!user) {
      // Check if a user with this phone already exists to avoid duplicate key error
      user = await User.findOne({ phone });
    }

    if (!user) {
      // create new user if still not found
      user = new User({
        name: fullName,
        phone
      });
    }

    // Update user profile
    user.name = fullName;
    user.phone = phone;
    if (email) user.email = email;
    user.college = college || user.college;
    user.year = collegeYear || user.year;

    // Handle referral code if provided
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id;
        
        // Add this user to referrer's referrals array if not already there
        if (!referrer.referrals.includes(user._id)) {
          referrer.referrals.push(user._id);
          await referrer.save();
        }
      }
    }

    // Save user
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    // Delete the user
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get registered users (for mobile selection)
// @route   GET /api/users/registered
// @access  Private/Admin
exports.getRegisteredUsers = async (req, res, next) => {
  try {
    // Get all users with their phone numbers
    // Only return the id, name, and phone fields
    const users = await User.find().select('_id name phone');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};