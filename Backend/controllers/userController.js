const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Referral = require('../models/Referral');
const Accommodation = require('../models/Accommodation');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Sync user from Clerk (create or update local user after Clerk sign-in)
// @route   POST /api/users/sync
// @access  Private (requires Clerk token)
exports.syncUser = async (req, res, next) => {
  try {
    const { clerkId, email, name, phone } = req.body;

    if (!clerkId || !email) {
      return next(new ErrorResponse('clerkId and email are required', 400));
    }

    // Try to find user by clerkId first, then by email
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      user = await User.findOne({ email });
    }

    if (user) {
      // Update existing user with Clerk ID if not set
      if (!user.clerkId) {
        user.clerkId = clerkId;
      }
      if (name && !user.name) user.name = name;
      if (phone) user.phone = phone;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        clerkId,
        email,
        name: name || 'New User',
        phone: phone || ''
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      isNewUser: !user.college // Flag: user hasn't completed profile yet
    });
  } catch (err) {
    console.error('Sync user error:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate key error. Please contact support.'
      });
    }
    next(err);
  }
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, clerkId } = req.body;

    if (!name || !email) {
      return next(new ErrorResponse('Please provide name and email', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse(`User already exists with email ${email}`, 400));
    }

    const user = await User.create({
      name,
      email,
      phone: phone || '',
      clerkId: clerkId || undefined
    });

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

// @desc    Login user with phone number (legacy - kept for backward compatibility)
// @route   POST /api/users/login-phone
// @access  Public
exports.loginWithPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return next(new ErrorResponse('Phone number is required', 400));
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    const normalizedPhone = cleanedPhone.slice(-10);

    let user = await User.findOne({
      $or: [
        { phone: normalizedPhone },
        { phone: cleanedPhone }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please sign up with email first.'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(200).json({
      success: true,
      token,
      data: user
    });
  } catch (err) {
    console.error('Login with phone error:', err);
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
    // Get pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const phoneSearch = req.query.phone || '';
    
    // Find the user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // If user is not an institute, return empty array
    if (user.role !== 'institute') {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    // Find all users who used this institute's referral code
    let query = { referrerCodeUsed: user.referralCode };
    
    // Add phone search if provided
    if (phoneSearch) {
      query.phone = { $regex: phoneSearch, $options: 'i' };
    }
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    // Get paginated results
    const referredUsers = await User.find(query)
      .select('name phone email college year createdAt')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
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
      count: total,
      pagination,
      data: referredUsers
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

// @desc    Complete user profile (with referral)
// @route   POST /api/users/complete-profile
// @access  Private
exports.completeProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      college,
      course,
      year,
      address,
      referralCode
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Update profile fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.college = college;
    user.course = course;
    user.year = year;
    user.address = address || user.address;
    user.profileCompleted = true;

    // Handle referral code
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      
      if (referrer) {
        user.referrerCodeUsed = referralCode;
        user.referredBy = referrer._id;
        
        // Add this user to referrer's referrals list
        referrer.referrals.push(user._id);
        await referrer.save();
        
        // Create referral record
        await Referral.create({
          referrer: referrer._id,
          referred: user._id,
          code: referralCode,
          status: 'completed'
        });
      }
    }

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