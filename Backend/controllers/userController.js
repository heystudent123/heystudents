const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Referral = require('../models/Referral');
const Accommodation = require('../models/Accommodation');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return next(new ErrorResponse('Please provide name and phone', 400));
    }

    // Clean phone number (remove spaces and any non-digit characters)
    const cleanedPhone = phone.replace(/\D/g, '');
    // Get last 10 digits if longer
    const normalizedPhone = cleanedPhone.slice(-10);
    
    console.log(`Attempting to register user with phone: ${normalizedPhone}`);
    
    // Check if user already exists with this phone number
    const existingUser = await User.findOne({
      $or: [
        { phone: normalizedPhone },
        { phone: cleanedPhone }
      ]
    });

    if (existingUser) {
      return next(new ErrorResponse(`User already exists with phone ${normalizedPhone}`, 400));
    }

    // Create user with normalized phone number
    const user = await User.create({
      name,
      phone: normalizedPhone,
      email: email || ''
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
    console.error('Registration error:', err);
    next(err);
  }
};



// @desc    Login user with phone number (OTP verified by Firebase on frontend)
// @route   POST /api/users/login-phone
// @access  Public
exports.loginWithPhone = async (req, res, next) => {
  try {
    const { phone, name } = req.body;

    if (!phone) {
      return next(new ErrorResponse('Phone number is required', 400));
    }

    // Clean phone number (remove spaces and any non-digit characters)
    const cleanedPhone = phone.replace(/\D/g, '');
    // Get last 10 digits if longer
    const normalizedPhone = cleanedPhone.slice(-10);
    
    console.log(`Attempting to find user with phone: ${normalizedPhone}`);
    
    // Try to find user with exact phone or with last 10 digits
    let user = await User.findOne({
      $or: [
        { phone: normalizedPhone },
        { phone: cleanedPhone }
      ]
    });

    // If user doesn't exist, auto-register them
    if (!user) {
      console.log(`User not found with phone ${normalizedPhone}, auto-registering`);
      
      // Create a new user with the phone number
      // Explicitly omit referralCode to avoid MongoDB unique constraint errors
      const newUserData = {
        name: name || 'New User', // Use provided name or default
        phone: normalizedPhone,
        email: '',
        // Don't set referralCode at all for regular users
        // This avoids the unique constraint error with null values
      };
      
      user = await User.create(newUserData);
      
      console.log(`Auto-registered new user with ID: ${user._id}`);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(200).json({
      success: true,
      token,
      data: user,
      isNewUser: !name || name === 'New User' // Flag to indicate if this is a new user
    });
  } catch (err) {
    console.error('Login with phone error:', err);
    console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    
    // Send a more specific error message to the client
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate key error. Please contact support.'
      });
    }
    
    // For other errors, use the error middleware
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

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
    const { name, email, phone, college, year } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (college) user.college = college;
    if (year) user.year = year;
    
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
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
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

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, college, year } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (college) user.college = college;
    if (year) user.year = year;
    
    await user.save();
    
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
    
    // Since referrals functionality has been removed, return an empty array
    res.status(200).json({
      success: true,
      count: 0,
      data: []
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
    // Get all users
    const users = await User.find();
    
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
    
    // Only allow admin to promote users
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to promote users', 401));
    }
    
    // Update user role
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

    // Clean phone number (remove spaces)
    const cleanedPhone = phone.replace(/\s/g, '');
    
    // Update user profile
    user.name = fullName;
    user.phone = cleanedPhone;
    if (email) user.email = email;
    user.college = college || user.college;
    user.year = collegeYear || user.year;

    // Handle referral code if provided
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id;
        // Save the referral code used by the student
        user.referrerCodeUsed = referralCode;
        
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
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
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
    
    // Delete the user using findByIdAndDelete instead of deprecated remove()
    await User.findByIdAndDelete(req.params.id);
    
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

// @desc    Add accommodation to user's wishlist
// @route   POST /api/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { accommodationId } = req.body;
    
    console.log('Add to wishlist request:', { user: req.user.id, accommodationId });
    
    if (!accommodationId) {
      return next(new ErrorResponse('No accommodation ID provided', 400));
    }
    
    // Check if accommodation exists
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return next(new ErrorResponse('Accommodation not found', 404));
    }
    
    // Find user and add to wishlist if not already there
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Initialize wishlist array if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    // Check if already in wishlist
    if (user.wishlist.some(item => item && item.toString() === accommodationId)) {
      return res.status(200).json({ success: true, message: 'Already in wishlist' });
    }
    
    user.wishlist.push(accommodationId);
    await user.save();
    
    console.log('Added to wishlist successfully');
    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    next(error);
  }
};

// @desc    Remove accommodation from user's wishlist
// @route   DELETE /api/users/wishlist/:accommodationId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { accommodationId } = req.params;
    
    console.log('Remove from wishlist request:', { user: req.user.id, accommodationId });
    
    if (!accommodationId) {
      return next(new ErrorResponse('No accommodation ID provided', 400));
    }
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Initialize wishlist array if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
      await user.save();
      return res.status(200).json({ success: true, data: [] });
    }
    
    // Filter out the accommodation ID
    user.wishlist = user.wishlist.filter(
      (item) => item && item.toString() !== accommodationId
    );
    
    await user.save();
    
    console.log('Removed from wishlist successfully');
    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    next(error);
  }
};

// @desc    Validate referral code
// @route   POST /api/users/validate-referral-code
// @access  Public
exports.validateReferralCode = async (req, res, next) => {
  try {
    const { referralCode } = req.body;
    
    if (!referralCode) {
      return next(new ErrorResponse('Please provide a referral code', 400));
    }
    
    // Check if the referral code exists for any institute user
    const institute = await User.findOne({
      referralCode,
      role: 'institute'
    }).select('name');
    
    if (!institute) {
      return next(new ErrorResponse('Invalid referral code', 404));
    }
    
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        instituteName: institute.name
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    console.log('Get wishlist request for user:', req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
      await user.save();
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    // Populate the wishlist items with all necessary details
    const populatedUser = await User.findById(req.user.id).populate('wishlist');
    const wishlistItems = populatedUser.wishlist || [];
    
    console.log('Wishlist retrieved successfully, count:', wishlistItems.length);
    
    if (wishlistItems.length > 0) {
      console.log('First wishlist item:', wishlistItems[0]);
    }
    
    res.status(200).json({
      success: true,
      count: wishlistItems.length,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Error in getWishlist:', error);
    next(error);
  }
};