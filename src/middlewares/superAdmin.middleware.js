import SuperAdmin from "../models/superAdmin.model.js";

const superAdminMiddleware = async (req, res, next) => {
  try {
    // Only Super Admin can access Super Admin-only APIs
    if (req.user.role !== "superAdmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super Admin access required",
      });
    }

    // Find Super Admin account
    const superAdmin = await SuperAdmin.findById(req.user.id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin account not found",
      });
    }

    // Check whether Super Admin is blocked
    if (superAdmin.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your Super Admin account has been blocked",
      });
    }

    // Attach Super Admin to request
    req.superAdmin = superAdmin;

    next();
  } catch (error) {
    console.error("Super Admin middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default superAdminMiddleware;