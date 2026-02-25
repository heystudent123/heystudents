const jwt = require('jsonwebtoken');
const { getAuth, clerkClient } = require('@clerk/express');
const EmailUser = require('../models/EmailUser');

// Try to verify as a regular JWT (used by admin login)
const tryJwtVerify = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.id) {
      return await EmailUser.findById(decoded.id);
    }
  } catch {}
  return null;
};

// Protect routes — supports both Clerk sessions and admin JWT tokens
exports.protect = async (req, res, next) => {
  // ── 1. Try Clerk session (set by clerkMiddleware in server.js) ────────────
  try {
    const { userId } = getAuth(req);
    if (userId) {
      req.user = await EmailUser.findOne({ clerkId: userId });

      if (!req.user) {
        // Auto-create user from Clerk data
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses?.[0]?.emailAddress;
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'New User';
        if (!email) {
          return res.status(401).json({ success: false, message: 'No email associated with Clerk account' });
        }
        req.user = await EmailUser.findOne({ email });
        if (req.user) {
          req.user.clerkId = userId;
          await req.user.save();
        } else {
          req.user = await EmailUser.create({
            clerkId: userId, name, email,
            phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || ''
          });
        }
      }

      return next();
    }
  } catch (clerkErr) {
    // Clerk not available for this request — fall through to JWT
  }

  // ── 2. Fall back to admin JWT (Bearer token in Authorization header) ───────
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    const jwtUser = await tryJwtVerify(token);
    if (jwtUser) {
      req.user = jwtUser;
      return next();
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Not authorized to access this route'
  });
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
}; 