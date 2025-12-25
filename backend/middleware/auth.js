import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import logger from '../utils/logger.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if token is blacklisted
      const isBlacklisted = await TokenBlacklist.findOne({ token });
      if (isBlacklisted) {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, token has been revoked' 
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, token expired' 
        });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, invalid token' 
        });
      }
      logger.error({ error }, 'Token verification error');
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, token failed' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token' 
    });
  }
};

