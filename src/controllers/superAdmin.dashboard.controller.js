import { getCommonDashboardData } from "../services/dashboard/dashboard.service.js";

// ==================== GET SUPER ADMIN DASHBOARD ====================

export const getSuperAdminDashboard = async (req, res) => {
  try {
    // Super Admin ke liye admin-specific stats bhi chahiye
    const dashboardData = await getCommonDashboardData(true);

    return res.status(200).json({
      success: true,
      message: "Super Admin dashboard fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Get Super Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch super admin dashboard",
    });
  }
};