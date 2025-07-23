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

// @desc    Promote user to institute role
// @route   PUT /api/admin/users/:id/promote-to-institute
// @access  Private/Admin
exports.promoteToInstitute = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    if (user.role === 'admin') {
      return next(new ErrorResponse('Admin users cannot be promoted to institute', 400));
    }
    
    if (user.role === 'institute') {
      return next(new ErrorResponse('User is already an institute', 400));
    }
    
    // Generate a unique 6-digit alphanumeric referral code
    let referralCode = '';
    let isUnique = false;
    
    // Use custom referral code if provided, otherwise generate one
    if (req.body.customReferralCode && req.body.customReferralCode.length >= 4) {
      referralCode = req.body.customReferralCode.toUpperCase();
      
      // Check if custom code is already in use
      const existingUser = await User.findOne({ referralCode });
      if (existingUser) {
        return next(new ErrorResponse('Custom referral code is already in use', 400));
      }
      
      isUnique = true;
    } else {
      // Generate a random code until we find a unique one
      while (!isUnique) {
        // Generate a 6-character alphanumeric code (excluding ambiguous characters)
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        referralCode = '';
        for (let i = 0; i < 6; i++) {
          referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        // Check if code is unique
        const existingUser = await User.findOne({ referralCode });
        if (!existingUser) {
          isUnique = true;
        }
      }
    }
    
    // Update user to institute role with referral code
    user.role = 'institute';
    user.referralCode = referralCode;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all institutes with referral stats
// @route   GET /api/admin/institutes
// @access  Private/Admin
exports.getInstitutes = async (req, res, next) => {
  try {
    const institutes = await User.find({ role: 'institute' })
      .select('name email phone college referralCode')
      .lean();

    // Get referral counts for each institute
    const institutesWithStats = await Promise.all(
      institutes.map(async (institute) => {
        const referralCount = await User.countDocuments({
          referredBy: institute.referralCode
        });

        return {
          ...institute,
          referralCount,
          createdAt: institute._id.getTimestamp()
        };
      })
    );

    res.status(200).json({
      success: true,
      count: institutesWithStats.length,
      data: institutesWithStats
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

// @desc    Get users by referral code
// @route   GET /api/admin/users-by-referral/:referralCode
// @access  Private/Admin
exports.getUsersByReferralCode = async (req, res, next) => {
  try {
    const { referralCode } = req.params;
    
    if (!referralCode) {
      return next(new ErrorResponse('Referral code is required', 400));
    }
    
    // Find the institute by referral code
    const institute = await User.findOne({ referralCode, role: 'institute' })
      .select('name email phone college referralCode');
      
    if (!institute) {
      return next(new ErrorResponse('Institute not found with this referral code', 404));
    }
    
    // Find all users who used this referral code
    const users = await User.find({ referredBy: referralCode })
      .select('name email phone college collegeYear createdAt');
    
    res.status(200).json({
      success: true,
      count: users.length,
      institute,
      data: users
    });
  } catch (err) {
    next(err);
  }
};