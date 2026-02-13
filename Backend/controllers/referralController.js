const EmailUser = require('../models/EmailUser');
const Referral = require('../models/Referral');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Validate referral code
// @route   GET /api/referrals/validate/:code
// @access  Public
exports.validateReferralCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    
    // Check if code exists
    const referrer = await EmailUser.findOne({ referralCode: code });
    
    if (!referrer) {
      return next(new ErrorResponse('Invalid referral code', 404));
    }
    
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        referrer: {
          name: referrer.name,
          college: referrer.college
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's referral info
// @route   GET /api/referrals/my-code
// @access  Private
exports.getMyReferralCode = async (req, res, next) => {
  try {
    const user = await EmailUser.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralsCount: user.referrals.length
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get users who used my referral code
// @route   GET /api/referrals/referred-users
// @access  Private
exports.getReferredUsers = async (req, res, next) => {
  try {
    const user = await EmailUser.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      count: user.referrals.length,
      data: user.referrals
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get who referred me
// @route   GET /api/referrals/my-referrer
// @access  Private
exports.getMyReferrer = async (req, res, next) => {
  try {
    const user = await EmailUser.findById(req.user.id).populate('referredBy', 'name email college');
    
    if (!user.referredBy) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'You were not referred by anyone'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user.referredBy
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate new referral code (if needed)
// @route   POST /api/referrals/generate-code
// @access  Private
exports.generateNewReferralCode = async (req, res, next) => {
  try {
    const user = await EmailUser.findById(req.user.id);
    
    // Generate new referral code
    const namePrefix = user.name.substring(0, 4).toUpperCase();
    const randomChars = require('crypto').randomBytes(2).toString('hex').toUpperCase();
    user.referralCode = `${namePrefix}${randomChars}`;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify referral code
// @route   GET /api/referrals/verify/:code
// @access  Public
exports.verifyReferralCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    
    // Check if code exists and belongs to an institute
    const institute = await EmailUser.findOne({ 
      referralCode: code,
      role: 'institute'
    });
    
    if (!institute) {
      return next(new ErrorResponse('Invalid referral code', 404));
    }
    
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        institute: {
          name: institute.name,
          _id: institute._id
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all referrals
// @route   GET /api/referrals
// @access  Private/Admin
exports.getReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find()
      .populate('referrer', 'name email role')
      .populate('referred', 'name email mobile college course year');
    
    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals
    });
  } catch (err) {
    next(err);
  }
}; 