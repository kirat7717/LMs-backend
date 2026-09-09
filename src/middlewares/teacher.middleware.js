import Teacher from "../models/teacher.model.js";

const teacherMiddleware = async (req, res, next) => {
  try {
    // Check whether authenticated user has teacher role
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Teacher access required",
      });
    }

    // Find teacher using authenticated user ID
    const teacher = await Teacher.findById(req.user.id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    // Check whether teacher account still exists
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher account not found",
      });
    }

    // Check whether teacher account is blocked
    if (teacher.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your teacher account has been blocked",
      });
    }

    // Store teacher document for controllers
    req.teacher = teacher;

    // Continue to controller
    next();
  } catch (error) {
    // Handle teacher middleware errors
    console.error("Teacher middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default teacherMiddleware;