import Student from "../models/Student.model.js";

const studentMiddleware = async (req, res, next) => {
  try {
    // Check whether authenticated user has student role
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Student access required",
      });
    }

    // Find student using authenticated user ID
    const student = await Student.findById(req.user.id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    // Check whether student still exists
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student account not found",
      });
    }

    // Check whether student account is blocked
    if (student.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your student account has been blocked",
      });
    }

    // Store student document for controllers
    req.student = student;

    // Continue to controller
    next();
  } catch (error) {
    // Handle student middleware errors
    console.error("Student middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default studentMiddleware;