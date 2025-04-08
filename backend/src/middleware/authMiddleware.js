import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes requiring authentication
 * Verifies JWT from cookies and attaches user to request
 */
export const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token) {
      return res.status(401).end();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
