import Student from "../models/Student.model.js";
import Joi from "joi";
import {
  studentRegisterSchema,
  studentLoginSchema,
  studentResetPasswordSchema,
  studentUpdateProfileSchema,
} from "../validations/student.validation.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import {
  generateVerificationToken,
  generateTokenExpiry,
} from "../utils/verificationToken.util.js";
import { generateAccessToken } from "../utils/jwt.util.js";
import {
  sendStudentRegistrationEmail,
  sendStudentVerificationEmail,
  sendStudentPasswordChangedEmail,
  sendStudentPasswordResetEmail,
  sendStudentProfileUpdatedEmail,
} from "../services/emails/studentEmail.service.js";

// ==================== REGISTER STUDENT ====================

const registerStudent = async (req, res) => {
  try {
    // Validate registration data
    const { error, value } = studentRegisterSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, email, password, bio, avatar } = value;

    // Check whether student already exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    // Hash password before storing it
    const hashedPassword = await hashPassword(password);

    // Generate email verification token and expiry
    const verificationToken = generateVerificationToken();
    const verificationExpires = generateTokenExpiry(30);

    // Create student account
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      bio,
      avatar,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Send registration email
    try {
      await sendStudentRegistrationEmail(student);
    } catch (emailError) {
      console.error(
        "Student registration email failed:",
        emailError.message
      );
    }

    // Send email verification link
    try {
      await sendStudentVerificationEmail(student, verificationToken);
    } catch (emailError) {
      console.error(
        "Student verification email failed:",
        emailError.message
      );
    }

    return res.status(201).json({
      success: true,
      message:
        "Student registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Register student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== VERIFY STUDENT EMAIL ====================

const verifyStudentEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Check whether verification token is provided
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Find student using token and expiry
    const student = await Student.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Mark email as verified and remove verification data
    student.isEmailVerified = true;
    student.emailVerificationToken = null;
    student.emailVerificationExpires = null;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify student email error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== RESEND VERIFICATION EMAIL ====================

const resendStudentVerificationEmail = async (req, res) => {
  try {
    // Validate email
    const { error, value } = Joi.object({
      email: Joi.string().trim().lowercase().email().required(),
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email } = value;

    // Find student account
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Prevent verification email for already verified account
    if (student.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate a new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = generateTokenExpiry(30);

    student.emailVerificationToken = verificationToken;
    student.emailVerificationExpires = verificationExpires;

    await student.save();

    // Send new verification email
    try {
      await sendStudentVerificationEmail(student, verificationToken);
    } catch (emailError) {
      console.error(
        "Resend verification email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error(
      "Resend student verification email error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== LOGIN STUDENT ====================

const loginStudent = async (req, res) => {
  try {
    // Validate login credentials
    const { error, value } = studentLoginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;

    // Find student by email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check whether student account is blocked
    if (student.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your student account has been blocked",
      });
    }

    // Check whether email is verified
    if (!student.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login",
      });
    }

    // Compare entered password with hashed password
    const isPasswordMatch = await comparePassword(
      password,
      student.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT access token with student role
    const token = generateAccessToken(student._id, "student");

    return res.status(200).json({
      success: true,
      message: "Student logged in successfully",
      data: {
        token,
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          bio: student.bio,
          avatar: student.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Login student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== FORGOT PASSWORD ====================

const forgotStudentPassword = async (req, res) => {
  try {
    // Validate email
    const { error, value } = Joi.object({
      email: Joi.string().trim().lowercase().email().required(),
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email } = value;

    // Find student account
    const student = await Student.findOne({ email });

    // Return same response even when email does not exist
    if (!student) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent",
      });
    }

    // Generate password reset token and expiry
    const resetToken = generateVerificationToken();
    const resetExpires = generateTokenExpiry(30);

    student.passwordResetToken = resetToken;
    student.passwordResetExpires = resetExpires;

    await student.save();

    // Send password reset email
    try {
      await sendStudentPasswordResetEmail(student, resetToken);
    } catch (emailError) {
      console.error(
        "Student password reset email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot student password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== RESET PASSWORD ====================

const resetStudentPassword = async (req, res) => {
  try {
    // Validate reset password data
    const { error, value } = studentResetPasswordSchema.validate(
      req.body
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { token, password } = value;

    // Find student using valid reset token
    const student = await Student.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    // Hash the new password
    student.password = await hashPassword(password);

    // Clear password reset data after successful reset
    student.passwordResetToken = null;
    student.passwordResetExpires = null;

    await student.save();

    // Notify student about password change
    try {
      await sendStudentPasswordChangedEmail(student);
    } catch (emailError) {
      console.error(
        "Student password changed email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset student password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== UPDATE PROFILE ====================

const updateStudentProfile = async (req, res) => {
  try {
    // Validate profile update data
    const { error, value } = studentUpdateProfileSchema.validate(
      req.body
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Update authenticated student's profile
    const student = await Student.findByIdAndUpdate(
      req.student._id,
      { $set: value },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -passwordResetToken -passwordResetExpires");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student account not found",
      });
    }

    // Send profile update notification
    try {
      await sendStudentProfileUpdatedEmail(student);
    } catch (emailError) {
      console.error(
        "Student profile update email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: {
        student,
      },
    });
  } catch (error) {
    console.error("Update student profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export {
  registerStudent,
  verifyStudentEmail,
  resendStudentVerificationEmail,
  loginStudent,
  forgotStudentPassword,
  resetStudentPassword,
  updateStudentProfile,
};