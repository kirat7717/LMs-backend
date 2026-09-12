import Admin from "../models/admin.model.js";
import Course from "../models/course.model.js";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import TeacherRequest from "../models/teacherReqest.model.js";
import { sendAdminProfileUpdatedEmail } from "../services/emails/adminEmail.service.js";
import {
  sendCourseApprovalEmail,
  sendCourseRejectionEmail,
} from "../services/emails/courseEmail.service.js";
import {
  sendTeacherApprovalEmail,
  sendTeacherRejectionEmail,
} from "../services/emails/teacherEmail.service.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import {
  adminLoginSchema,
  adminUpdateProfileSchema,
  getStudentsSchema,
  getTeacherRequestsSchema,
  getTeachersSchema,
  setAdminPasswordSchema,
  updateTeacherRequestSchema,
  updateUserBlockStatusSchema,
} from "../validations/admin.validataion.js";
import {
  getCoursesSchema,
  updateCourseApprovalSchema,
} from "../validations/course.validation.js";
import { generateAccessToken } from "../utils/jwt.util.js";
// ==================== SET ADMIN PASSWORD ====================

const setAdminPassword = async (req, res) => {
  try {
    // Validate setup password data
    const { error, value } = setAdminPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { token, password } = value;

    // Find Admin using valid setup token
    const admin = await Admin.findOne({
      adminSetupToken: token,
      adminSetupExpires: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired admin setup token",
      });
    }

    // Hash the new password
    admin.password = await hashPassword(password);

    // Activate Admin account
    admin.isActive = true;

    // Clear setup token after successful setup
    admin.adminSetupToken = null;
    admin.adminSetupExpires = null;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin account setup completed successfully",
    });
  } catch (error) {
    console.error("Set admin password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// ==================== LOGIN ADMIN ====================

const loginAdmin = async (req, res) => {
  try {
    // Validate login data
    const { error, value } = adminLoginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;

    // Find Admin account
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check whether Admin account is active
    if (!admin.isActive || !admin.password) {
      return res.status(403).json({
        success: false,
        message: "Admin account setup is not completed",
      });
    }

    // Check whether Admin account is blocked
    if (admin.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your admin account has been blocked",
      });
    }

    // Compare password
    const isPasswordMatch = await comparePassword(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate Admin JWT
    const token = generateAccessToken(admin._id, "admin");

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          isActive: admin.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Login admin error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// ==================== UPDATE TEACHER REQUEST ====================

const updateTeacherRequest = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateTeacherRequestSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { status, rejectionReason } = value;

    // Find teacher request
    const teacherRequest = await TeacherRequest.findById(req.params.id);

    if (!teacherRequest) {
      return res.status(404).json({
        success: false,
        message: "Teacher registration request not found",
      });
    }

    // Request can only be reviewed once
    if (teacherRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Teacher registration request has already been reviewed",
      });
    }

    // ==================== REJECT REQUEST ====================

    if (status === "rejected") {
      teacherRequest.status = "rejected";
      teacherRequest.rejectionReason = rejectionReason;
      teacherRequest.reviewedAt = new Date();

      if (req.user.role === "admin") {
        teacherRequest.reviewedBy = req.admin._id;
      }

      await teacherRequest.save();

      // Send rejection email to teacher
      try {
        await sendTeacherRejectionEmail(teacherRequest, rejectionReason);
      } catch (emailError) {
        console.error("Teacher rejection email failed:", emailError.message);
      }

      return res.status(200).json({
        success: true,
        message: "Teacher registration request rejected",
        data: {
          requestId: teacherRequest._id,
          status: teacherRequest.status,
          rejectionReason: teacherRequest.rejectionReason,
        },
      });
    }

    // ==================== APPROVE REQUEST ====================

    if (status === "approved") {
      // Create approved Teacher account
      const teacher = await Teacher.create({
        name: teacherRequest.name,
        email: teacherRequest.email,
        password: teacherRequest.password,
        phone: teacherRequest.phone,
        qualification: teacherRequest.qualification,
        experience: teacherRequest.experience,
        specialization: teacherRequest.specialization,
        bio: teacherRequest.bio,

        teacherRequestId: teacherRequest._id,
        approvedAt: new Date(),

        isActive: true,
        isBlocked: false,

        approvedBy:
          req.user.role === "admin" ? req.admin._id : req.superAdmin._id,
      });

      // Update request status
      teacherRequest.status = "approved";
      teacherRequest.reviewedAt = new Date();

      if (req.user.role === "admin") {
        teacherRequest.reviewedBy = req.admin._id;
      }

      await teacherRequest.save();

      // Send approval email to teacher
      try {
        await sendTeacherApprovalEmail(teacher);
      } catch (emailError) {
        console.error("Teacher approval email failed:", emailError.message);
      }

      return res.status(200).json({
        success: true,
        message: "Teacher registration request approved",
        data: {
          requestId: teacherRequest._id,
          teacherId: teacher._id,
          status: teacherRequest.status,
        },
      });
    }
  } catch (error) {
    console.error("Update teacher request error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== UPDATE TEACHER STATUS ====================

const updateTeacherStatus = async (req, res) => {
  try {
    // Validate block status
    const { error, value } = updateUserBlockStatusSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { isBlocked } = value;

    // Find Teacher
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher account not found",
      });
    }

    // Update block status
    teacher.isBlocked = isBlocked;

    await teacher.save();

    return res.status(200).json({
      success: true,
      message: isBlocked
        ? "Teacher account blocked successfully"
        : "Teacher account unblocked successfully",
      data: {
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          isBlocked: teacher.isBlocked,
        },
      },
    });
  } catch (error) {
    console.error("Update teacher status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Block / unblock student
const updateStudentStatus = async (req, res) => {
  try {
    const { error, value } = updateUserBlockStatusSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { isBlocked } = value;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.isBlocked = isBlocked;

    await student.save();

    return res.status(200).json({
      success: true,
      message: isBlocked
        ? "Student account blocked successfully"
        : "Student account unblocked successfully",
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          isBlocked: student.isBlocked,
        },
      },
    });
  } catch (error) {
    console.error("Update student status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get all teacher requests with optional status filter
const getTeacherRequests = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = getTeacherRequestsSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Build filter dynamically
    const filter = {};

    if (value.status) {
      filter.status = value.status;
    }

    // Fetch teacher requests
    const teacherRequests = await TeacherRequest.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Teacher requests fetched successfully",
      data: {
        teacherRequests,
      },
    });
  } catch (error) {
    console.error("Get teacher requests error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get all teachers with optional active and blocked filters
const getTeachers = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = getTeachersSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Build filter dynamically
    const filter = {};

    if (value.isActive !== undefined) {
      filter.isActive = value.isActive;
    }

    if (value.isBlocked !== undefined) {
      filter.isBlocked = value.isBlocked;
    }

    // Fetch teachers
    const teachers = await Teacher.find(filter)
      .select("-password -passwordResetToken -passwordResetExpires")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: {
        teachers,
      },
    });
  } catch (error) {
    console.error("Get teachers error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get all students with optional blocked filter
const getStudents = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = getStudentsSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Build filter dynamically
    const filter = {};

    if (value.isBlocked !== undefined) {
      filter.isBlocked = value.isBlocked;
    }

    // Fetch students
    const students = await Student.find(filter)
      .select(
        "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: {
        students,
      },
    });
  } catch (error) {
    console.error("Get students error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get all courses with optional approval status filter
const getCourses = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = getCoursesSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Build filter dynamically
    const filter = {};

    if (value.approvalStatus !== undefined) {
      filter.approvalStatus = value.approvalStatus;
    }

    // Fetch courses with teacher and category details
    const courses = await Course.find(filter)
      .populate("teacher", "name email")
      .populate("category", "name description")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: {
        courses,
      },
    });
  } catch (error) {
    console.error("Get courses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Approve or reject course
const updateCourseApproval = async (req, res) => {
  try {
    // Validate approval/rejection data
    const { error, value } = updateCourseApprovalSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { status, rejectionReason } = value;

    // Find course with teacher details
    const course = await Course.findById(req.params.id).populate(
      "teacher",
      "name email",
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Only pending courses can be approved or rejected
    if (course.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending courses can be approved or rejected",
      });
    }

    // Get reviewer ID from logged-in Admin or Super Admin
    const reviewerId = req.admin?._id || req.superAdmin?._id;

    if (!reviewerId) {
      return res.status(403).json({
        success: false,
        message: "Reviewer information not found",
      });
    }

    // Update approval status
    course.approvalStatus = status;

    if (status === "approved") {
      course.approvedAt = new Date();
      course.approvedBy = reviewerId;
      course.rejectionReason = null;
    }

    if (status === "rejected") {
      course.rejectionReason = rejectionReason;
      course.approvedAt = null;
      course.approvedBy = null;
    }

    await course.save();

    // Notify teacher after approval
    if (status === "approved") {
      try {
        await sendCourseApprovalEmail(course, course.teacher);
      } catch (emailError) {
        console.error("Course approval email failed:", emailError.message);
      }
    }

    // Notify teacher after rejection
    if (status === "rejected") {
      try {
        await sendCourseRejectionEmail(course, course.teacher, rejectionReason);
      } catch (emailError) {
        console.error("Course rejection email failed:", emailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Course approved successfully"
          : "Course rejected successfully",
      data: {
        course: {
          id: course._id,
          title: course.title,
          approvalStatus: course.approvalStatus,
          rejectionReason: course.rejectionReason,
          approvedAt: course.approvedAt,
          approvedBy: course.approvedBy,
        },
      },
    });
  } catch (error) {
    console.error("Update course approval error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// Update admin profile
const updateAdminProfile = async (req, res) => {
  try {
    const { error, value } = adminUpdateProfileSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const admin = req.admin;

    if (value.name !== undefined) {
      admin.name = value.name;
    }

    if (value.bio !== undefined) {
      admin.bio = value.bio;
    }

    if (value.avatar !== undefined) {
      admin.avatar = value.avatar;
    }

    await admin.save();

    try {
      await sendAdminProfileUpdatedEmail(admin);
    } catch (emailError) {
      console.error("Admin profile update email failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          bio: admin.bio,
          avatar: admin.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Update admin profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== GET ADMIN PROFILE ====================

const getAdminProfile = async (req, res) => {
  try {
    // Admin is already fetched by onlyAdminMiddleware
    return res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      data: req.admin,
    });
  } catch (error) {
    // Handle profile fetch errors
    console.error("Get admin profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export {
  setAdminPassword,
  loginAdmin,
  updateTeacherRequest,
  updateTeacherStatus,
  updateStudentStatus,
  updateAdminProfile,
  getTeacherRequests,
  getTeachers,
  getStudents,
  getCourses,
  updateCourseApproval,
  getAdminProfile,
};
