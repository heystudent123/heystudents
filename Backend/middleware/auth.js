const jwt = require('jsonwebtoken');
const { clerkClient } = require('@clerk/express');
const EmailUser = require('../models/EmailUser');

// Protect routes - Clerk JWT only
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // If not in header, check cookies (for web apps)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // First, try to verify as a Clerk session token
    try {
      const verifiedToken = await clerkClient.verifyToken(token);
      
      if (verifiedToken && verifiedToken.sub) {
        // Clerk token verified - find user by clerkId in EmailUser collection
        req.user = await EmailUser.findOne({ clerkId: verifiedToken.sub });
        
        if (!req.user) {
          // User exists in Clerk but not in our DB yet - auto-create
          const clerkUser = await clerkClient.users.getUser(verifiedToken.sub);
          const email = clerkUser.emailAddresses?.[0]?.emailAddress;
          const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'New User';
          
          if (email) {
            // Check if user exists by email in EmailUser collection
            req.user = await EmailUser.findOne({ email });
            if (req.user) {
              // Link existing user to Clerk
              req.user.clerkId = verifiedToken.sub;
              await req.user.save();
            } else {
              // Create new EmailUser
              req.user = await EmailUser.create({
                clerkId: verifiedToken.sub,
                name,
                email,
                phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || ''
              });
            }
          } else {
            return res.status(401).json({
              success: false,
              message: 'No email associated with Clerk account'
            });
          }
        }
        
        return next();
      }
    } catch (clerkErr) {
      // Not a valid Clerk token
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
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