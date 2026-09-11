import Admin from "../models/admin.model.js";

const adminMiddleware = async (req, res, next) => {
  try {
    // Only Admin can access Admin-only APIs
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin access required",
      });
    }

    // Find Admin account
    const admin = await Admin.findById(req.user.id).select(
      "-password -adminSetupToken -adminSetupExpires -passwordResetToken -passwordResetExpires"
    );

    // Check whether Admin account exists
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
        message: "Your admin account has been blocked",
      });
    }

    // Attach Admin to request
    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default adminMiddleware;