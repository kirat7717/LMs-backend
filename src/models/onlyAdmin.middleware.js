import Admin from "../models/admin.model.js";

// ==================== ADMIN MIDDLEWARE ====================

const onlyAdminMiddleware = async (req, res, next) => {
  try {
    // Check whether authenticated user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin access required",
      });
    }

    // Find Admin using authenticated user ID
    const admin = await Admin.findById(req.user.id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    // Check whether Admin still exists
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    // Check whether Admin account is blocked
    if (admin.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your Admin account has been blocked",
      });
    }

    // Attach Admin document to request
    req.admin = admin;

    // Continue to controller
    next();
  } catch (error) {
    // Handle Admin middleware errors
    console.error("Admin middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default onlyAdminMiddleware;