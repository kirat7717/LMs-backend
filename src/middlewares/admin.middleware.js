import Admin from "../models/admin.model.js";
import SuperAdmin from "../models/superAdmin.model.js";

const adminMiddleware = async (req, res, next) => {
  try {
    // Normal Admin or Super Admin can access Admin APIs
    if (req.user.role !== "admin" && req.user.role !== "superAdmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin access required",
      });
    }

    if (req.user.role === "admin") {
      const admin = await Admin.findById(req.user.id).select(
        "-password -adminSetupToken -adminSetupExpires -passwordResetToken -passwordResetExpires"
      );

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin account not found",
        });
      }

      if (admin.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your admin account has been blocked",
        });
      }

      req.admin = admin;
    }

    if (req.user.role === "superAdmin") {
      const superAdmin = await SuperAdmin.findById(req.user.id).select(
        "-password -passwordResetToken -passwordResetExpires"
      );

      if (!superAdmin) {
        return res.status(404).json({
          success: false,
          message: "Super Admin account not found",
        });
      }

      if (superAdmin.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your Super Admin account has been blocked",
        });
      }

      req.superAdmin = superAdmin;
    }

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