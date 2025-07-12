const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Validate referral code
// @route   POST /api/validate-referral
// @access  Public
exports.validateReferralCode = async (req, res, next) => {
  try {
    const { referralCode } = req.body;

    // Check if referral code exists
    if (!referralCode) {
      return next(new ErrorResponse('Please provide a referral code', 400));
    }

    // Check if referral code is valid
    const user = await User.findOne({ referralCode });

    if (!user) {
      return res.status(200).json({
        success: false,
        valid: false,
        message: 'Invalid referral code'
      });
    }

    // Return success
    res.status(200).json({
      success: true,
      valid: true,
      message: 'Valid referral code',
      referrer: {
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};
