import Teacher from "../models/teacher.model.js";
import TeacherRequest from "../models/teacherReqest.model.js";
import Admin from "../models/admin.model.js";

import {
  teacherRegisterSchema,
  teacherLoginSchema,
  teacherResetPasswordSchema,
  teacherUpdateProfileSchema,
} from "../validations/teacher.validation.js";

import { hashPassword, comparePassword } from "../utils/password.util.js";

import {
  generateVerificationToken,
  generateTokenExpiry,
} from "../utils/verificationToken.util.js";

import { generateAccessToken } from "../utils/jwt.util.js";

import {
  sendTeacherRegistrationEmail,
  sendAdminTeacherRequestEmail,
  sendTeacherPasswordResetEmail,
  sendTeacherPasswordChangedEmail,
  sendTeacherProfileUpdatedEmail,
} from "../services/emails/teacherEmail.service.js";


// ==================== REGISTER TEACHER ====================

const registerTeacher = async (req, res) => {
  try {
    // Validate teacher registration data
    const { error, value } = teacherRegisterSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      name,
      email,
      password,
      phone,
      qualification,
      experience,
      specialization,
      bio,
    } = value;

    // Check whether teacher already exists
    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: "Teacher with this email already exists",
      });
    }

    // Check whether a pending teacher request already exists
    const existingRequest = await TeacherRequest.findOne({
      email,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "Teacher registration request is already pending",
      });
    }

    // Hash password before storing registration request
    const hashedPassword = await hashPassword(password);

    // Create teacher registration request
    const teacherRequest = await TeacherRequest.create({
      name,
      email,
      password: hashedPassword,
      phone,
      qualification,
      experience,
      specialization,
      bio,
    });

    // Send registration confirmation email to teacher
    try {
      await sendTeacherRegistrationEmail(teacherRequest);
    } catch (emailError) {
      console.error(
        "Teacher registration email failed:",
        emailError.message
      );
    }

    // Find active and unblocked admins
    const admins = await Admin.find({
      isActive: true,
      isBlocked: false,
    }).select("email");

    // Notify all active admins
    for (const admin of admins) {
      try {
        await sendAdminTeacherRequestEmail(
          teacherRequest,
          admin.email
        );
      } catch (emailError) {
        console.error(
          `Admin teacher request email failed for ${admin.email}:`,
          emailError.message
        );
      }
    }

    return res.status(201).json({
      success: true,
      message:
        "Teacher registration request submitted successfully. Please wait for admin approval.",
      data: {
        requestId: teacherRequest._id,
        status: teacherRequest.status,
      },
    });
  } catch (error) {
    console.error("Register teacher error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ==================== LOGIN TEACHER ====================

const loginTeacher = async (req, res) => {
  try {
    // Validate teacher login credentials
    const { error, value } = teacherLoginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;

    // Find teacher account
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check whether teacher account is blocked
    if (teacher.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your teacher account has been blocked",
      });
    }

    // Compare entered password with hashed password
    const isPasswordMatch = await comparePassword(
      password,
      teacher.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT access token with teacher role
    const token = generateAccessToken(
      teacher._id,
      "teacher"
    );

    return res.status(200).json({
      success: true,
      message: "Teacher logged in successfully",
      data: {
        token,
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          bio: teacher.bio,
          avatar: teacher.avatar,
          phone: teacher.phone,
          qualification: teacher.qualification,
          experience: teacher.experience,
          specialization: teacher.specialization,
        },
      },
    });
  } catch (error) {
    console.error("Login teacher error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ==================== UPDATE TEACHER PROFILE ====================

const updateTeacherProfile = async (req, res) => {
  try {
    // Validate teacher profile update data
    const { error, value } =
      teacherUpdateProfileSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Update authenticated teacher profile
    const teacher = await Teacher.findByIdAndUpdate(
      req.teacher._id,
      { $set: value },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher account not found",
      });
    }

    // Send profile update notification
    try {
      await sendTeacherProfileUpdatedEmail(teacher);
    } catch (emailError) {
      console.error(
        "Teacher profile update email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Teacher profile updated successfully",
      data: {
        teacher,
      },
    });
  } catch (error) {
    console.error(
      "Update teacher profile error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ==================== FORGOT TEACHER PASSWORD ====================

const forgotTeacherPassword = async (req, res) => {
  try {
    // Validate email
    const { error, value } = teacherLoginSchema
      .fork(["password"], (schema) => schema.optional())
      .validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email } = value;

    // Find teacher account
    const teacher = await Teacher.findOne({ email });

    // Return same response even if account does not exist
    if (!teacher) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent",
      });
    }

    // Generate reset token and expiry
    const resetToken = generateVerificationToken();
    const resetExpires = generateTokenExpiry(30);

    teacher.passwordResetToken = resetToken;
    teacher.passwordResetExpires = resetExpires;

    await teacher.save();

    // Send password reset email
    try {
      await sendTeacherPasswordResetEmail(
        teacher,
        resetToken
      );
    } catch (emailError) {
      console.error(
        "Teacher password reset email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent",
    });
  } catch (error) {
    console.error(
      "Forgot teacher password error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ==================== RESET TEACHER PASSWORD ====================

const resetTeacherPassword = async (req, res) => {
  try {
    // Validate reset password data
    const { error, value } =
      teacherResetPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { token, password } = value;

    // Find teacher using valid reset token
    const teacher = await Teacher.findOne({
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: new Date(),
      },
    });

    if (!teacher) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired password reset token",
      });
    }

    // Hash new password
    teacher.password = await hashPassword(password);

    // Clear reset token after successful password reset
    teacher.passwordResetToken = null;
    teacher.passwordResetExpires = null;

    await teacher.save();

    // Notify teacher about password change
    try {
      await sendTeacherPasswordChangedEmail(teacher);
    } catch (emailError) {
      console.error(
        "Teacher password changed email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(
      "Reset teacher password error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ==================== GET TEACHER PROFILE ====================

const getTeacherProfile = async (req, res) => {
  try {
    // Teacher is already fetched by teacherMiddleware
    return res.status(200).json({
      success: true,
      message: "Teacher profile fetched successfully",
      data: req.teacher,
    });
  } catch (error) {
    console.error(
      "Get teacher profile error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ==================== LOGOUT TEACHER ====================

const logoutTeacher = async (req, res) => {
  // Token invalidation will be implemented later
  return res.status(200).json({
    success: true,
    message: "Teacher logged out successfully",
  });
};


// ==================== EXPORTS ====================

export {
  registerTeacher,
  loginTeacher,
  updateTeacherProfile,
  forgotTeacherPassword,
  resetTeacherPassword,
  getTeacherProfile,
  logoutTeacher,
};