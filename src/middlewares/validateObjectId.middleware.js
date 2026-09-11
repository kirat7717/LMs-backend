import mongoose from "mongoose";

// ==================== VALIDATE MONGODB OBJECT ID ====================

const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    // Check whether the route parameter is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}`,
      });
    }

    next();
  };
};

export default validateObjectId;