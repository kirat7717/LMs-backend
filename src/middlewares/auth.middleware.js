import jwt from "jsonwebtoken";
import 'dotenv/config'
const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization header from request
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // Check Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // Extract JWT token from Bearer header
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // Verify JWT signature and expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store decoded JWT payload for next middleware
    req.user = decoded;

    // Continue to role-specific middleware
    next();
  } catch (error) {
    // Handle expired JWT separately
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authorization token has expired",
      });
    }

    // Handle invalid JWT
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization token",
      });
    }

    // Handle unexpected authentication errors
    console.error("Authentication middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default authMiddleware;