const EmailUser = require('../models/EmailUser');
const Referral = require('../models/Referral');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Sync user from Clerk (create or update local user after Clerk sign-in)
// @route   POST /api/email-users/sync
// @access  Private (requires Clerk token)
exports.syncUser = async (req, res, next) => {
  try {
    const { clerkId, email, name, phone } = req.body;

    if (!clerkId || !email) {
      return next(new ErrorResponse('clerkId and email are required', 400));
    }

    // Try to find user by clerkId first, then by email
    let user = await EmailUser.findOne({ clerkId });
    
    if (!user) {
      user = await EmailUser.findOne({ email });
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
      user = await EmailUser.create({
        clerkId,
        email,
        name: name || 'New User',
        phone: phone || ''
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      isNewUser: !user.profileCompleted // Flag: user hasn't completed profile yet
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/email-users/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await EmailUser.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
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
// @route   PUT /api/email-users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      college,
      course,
      year,
      address
    } = req.body;

    const user = await EmailUser.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (college) user.college = college;
    if (course) user.course = course;
    if (year) user.year = year;
    if (address) user.address = address;

    // Mark profile as completed if key fields are filled
    if (user.college && user.course && user.year) {
      user.profileCompleted = true;
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

// @desc    Complete user profile (with referral)
// @route   POST /api/email-users/complete-profile
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

    const user = await EmailUser.findById(req.user.id);

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
      const referrer = await EmailUser.findOne({ referralCode });
      
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

// @desc    Get user's wishlist
// @route   GET /api/email-users/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await EmailUser.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name type rent address nearestCollege images'
    });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add accommodation to wishlist
// @route   POST /api/email-users/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { accommodationId } = req.body;

    if (!accommodationId) {
      return next(new ErrorResponse('Please provide an accommodation ID', 400));
    }

    const user = await EmailUser.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if already in wishlist
    if (user.wishlist.includes(accommodationId)) {
      return next(new ErrorResponse('Accommodation already in wishlist', 400));
    }

    user.wishlist.push(accommodationId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove accommodation from wishlist
// @route   DELETE /api/email-users/wishlist/:accommodationId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await EmailUser.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    user.wishlist = user.wishlist.filter(
      item => item.toString() !== req.params.accommodationId
    );

    await user.save();

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};
