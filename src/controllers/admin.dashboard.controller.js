import { getCommonDashboardData } from "../services/dashboard/dashboard.service.js";

// ==================== GET ADMIN DASHBOARD ====================

export const getAdminDashboard = async (req, res) => {
  try {
    // Admin ke liye admin-specific stats nahi chahiye
    const dashboardData = await getCommonDashboardData(false);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Get Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard",
    });
  }
};