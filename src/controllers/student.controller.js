import Student from "../models/student.model.js";
import Joi from "joi";
import {
  studentRegisterSchema,
  studentLoginSchema,
  studentResetPasswordSchema,
  studentUpdateProfileSchema,
  updateCourseProgressSchema,
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
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import { getLectureAccess } from "../services/lecture/lecture.service.js";
import fs from "fs";
import path from "path";
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
    const existingStudent = await Student.findOne({ email }).lean();

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate account verification data
    const verificationToken = generateVerificationToken();
    const verificationExpires = generateTokenExpiry(30);

    // Create student account
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      bio,
      avatar,
      isVerified: false,
      verificationToken,
      verificationExpires,
    });

    // Send registration and verification emails
    try {
      await Promise.all([
        sendStudentRegistrationEmail(student),
        sendStudentVerificationEmail(student, verificationToken),
      ]);
    } catch (emailError) {
      console.error(
        "Student registration/verification email failed:",
        emailError.message
      );
    }

    return res.status(201).json({
      success: true,
      message:
        "Student registered successfully. Please verify your account using the link sent to your email.",
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

// ==================== VERIFY STUDENT ACCOUNT ====================

const verifyStudentAccount = async (req, res) => {
  try {
    const { token } = req.query;

    // Check whether verification token is provided
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Find student using valid and non-expired token
    const student = await Student.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Mark student account as verified
    student.isVerified = true;

    // Remove verification data after successful verification
    student.verificationToken = null;
    student.verificationExpires = null;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student account verified successfully",
    });
  } catch (error) {
    console.error("Verify student account error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== RESEND VERIFICATION EMAIL ====================

// ==================== RESEND STUDENT ACCOUNT VERIFICATION ====================

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
    if (student.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Student account is already verified",
      });
    }

    // Generate a new verification token and expiry
    const verificationToken = generateVerificationToken();
    const verificationExpires = generateTokenExpiry(30);

    // Replace old verification token with the new one
    student.verificationToken = verificationToken;
    student.verificationExpires = verificationExpires;

    await student.save();

    // Send new account verification email
    try {
      await sendStudentVerificationEmail(student, verificationToken);
    } catch (emailError) {
      console.error(
        "Resend student verification email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Account verification email sent successfully",
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
   if (!student.isVerified) {
  return res.status(403).json({
    success: false,
    message: "Please verify your student account before logging in",
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

// ==================== GET STUDENT PROFILE ====================

const getStudentProfile = async (req, res) => {
  try {
    // Student is already fetched by studentMiddleware
    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully",
      data: req.student,
    });
  } catch (error) {
    // Handle profile fetch errors
    console.error("Get student profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    // Find course
    const course = await Course.findOne({
      _id: req.params.courseId,
      approvalStatus: "approved",
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not available",
      });
    }

    // Paid courses will be handled through Stripe
    if (course.price > 0) {
      return res.status(400).json({
        success: false,
        message: "Please complete payment to enroll in this course",
      });
    }

    // Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      student: req.student._id,
      course: course._id,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Create enrollment for free course
    const enrollment = await Enrollment.create({
      student: req.student._id,
      course: course._id,
      payment: null,
      status: "active",
      progress: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      data: {
        enrollment,
      },
    });
  } catch (error) {
    console.error("Enroll course error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// ==================== GET MY ENROLLMENTS ====================

const getMyEnrollments = async (req, res) => {
  try {
    // Find all courses enrolled by the logged-in student
    const enrollments = await Enrollment.find({
      student: req.student._id,
      status: { $in: ["active", "completed"] },
    })
      .populate({
        path: "course",
        select: "title description thumbnail price category teacher",
        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "teacher",
            select: "name",
          },
        ],
      })
      .sort({ enrolledAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      data: {
        enrollments,
      },
    });
  } catch (error) {
    console.error("Get my enrollments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== GET ENROLLED COURSE DETAIL ====================

const getEnrolledCourseDetail = async (req, res) => {
  try {
    // Check whether student is enrolled in this course
    const enrollment = await Enrollment.findOne({
      student: req.student._id,
      course: req.params.courseId,
      status: { $in: ["active", "completed"] },
    }).lean();

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Find course with complete learning content
    const course = await Course.findOne({
      _id: req.params.courseId,
      approvalStatus: "approved",
      isActive: true,
    })
      .populate("category", "name description")
      .populate("teacher", "name")
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled course details fetched successfully",
      data: {
        enrollment: {
          id: enrollment._id,
          status: enrollment.status,
          progress: enrollment.progress,
          enrolledAt: enrollment.enrolledAt,
          completedAt: enrollment.completedAt,
        },
        course,
      },
    });
  } catch (error) {
    console.error(
      "Get enrolled course detail error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ==================== GET LECTURE ====================


const getLecture = async (req, res) => {
  try {
    const { courseId, sectionId, lectureId } = req.params;

    // Reuse common lecture access checks
    const result = await getLectureAccess({
      studentId: req.student._id,
      courseId,
      sectionId,
      lectureId,
    });

    // Handle access errors
    if (result.error) {
      return res.status(result.error.statusCode).json({
        success: false,
        message: result.error.message,
      });
    }

    const { course, section, lecture } = result;

    // Remove protected video URL from normal lecture response
    const { videoUrl, ...publicLecture } = lecture;

    return res.status(200).json({
      success: true,
      message: "Lecture fetched successfully",
      data: {
        course: {
          id: course._id,
          title: course.title,
        },
        section: {
          id: section._id,
          title: section.title,
        },
        lecture: publicLecture,

        // Protected endpoint for video access
        videoUrl: `/api/students/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}/video`,
      },
    });
  } catch (error) {
    console.error("Get lecture error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// ==================== GET PROTECTED LECTURE VIDEO ====================

export const getLectureVideo = async (req, res) => {
  try {
    const { courseId, sectionId, lectureId } = req.params;

    // Reuse common lecture access checks
    const result = await getLectureAccess({
      studentId: req.student._id,
      courseId,
      sectionId,
      lectureId,
    });

    // Handle access errors
    if (result.error) {
      return res.status(result.error.statusCode).json({
        success: false,
        message: result.error.message,
      });
    }

    const { lecture } = result;

    // Check whether lecture has a video
    if (!lecture.videoUrl) {
      return res.status(404).json({
        success: false,
        message: "Video not available for this lecture",
      });
    }

    // Get only the filename from stored video URL
    const videoFileName = path.basename(lecture.videoUrl);

    // Build actual video file path
    const videoPath = path.join(
      process.cwd(),
      "public",
      "videos",
      videoFileName
    );

    // Check whether video file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        message: "Video file not found",
      });
    }

    // Send video only after authorization
    return res.sendFile(videoPath);
  } catch (error) {
    console.error("Get lecture video error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// ==================== UPDATE COURSE PROGRESS ====================
export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate request body
    const { error, value } = updateCourseProgressSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      lectureId,
      watchedDuration,
      lastPosition,
      isCompleted,
    } = value;

    // Find student's enrollment
    const enrollment = await Enrollment.findOne({
      student: req.student._id,
      course: courseId,
      status: { $in: ["active", "completed"] },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Find approved and active course
    const course = await Course.findOne({
      _id: courseId,
      approvalStatus: "approved",
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find the requested lecture inside course sections
    let lecture = null;

    for (const section of course.sections) {
      const foundLecture = section.lectures.id(lectureId);

      if (foundLecture) {
        lecture = foundLecture;
        break;
      }
    }

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found in this course",
      });
    }

    // Lecture duration must be available for completion checking
    if (lecture.duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Lecture duration is not available",
      });
    }

    // Prevent values greater than the actual video duration
    const safeWatchedDuration = Math.min(
      watchedDuration,
      lecture.duration
    );

    const safeLastPosition = Math.min(
      lastPosition,
      lecture.duration
    );

    // Find existing progress record for this lecture
    let lectureProgress = enrollment.lectureProgress.find(
      (item) => item.lecture.toString() === lectureId
    );

    if (!lectureProgress) {
      // Create progress record for first time
      enrollment.lectureProgress.push({
        lecture: lectureId,
        watchedDuration: safeWatchedDuration,
        lastPosition: safeLastPosition,
        isCompleted: false,
      });

      lectureProgress =
        enrollment.lectureProgress[
          enrollment.lectureProgress.length - 1
        ];
    } else {
      // Keep the highest watched duration
      lectureProgress.watchedDuration = Math.max(
        lectureProgress.watchedDuration,
        safeWatchedDuration
      );

      // Update latest video position
      lectureProgress.lastPosition = safeLastPosition;
    }

    // Mark lecture completed only after watching the full video
    if (
      isCompleted === true &&
      lectureProgress.watchedDuration >= lecture.duration
    ) {
      lectureProgress.isCompleted = true;
    }

    // Calculate total lectures in the course
    const totalLectures = course.sections.reduce(
      (total, section) => total + section.lectures.length,
      0
    );

    // Get all lecture IDs belonging to this course
    const courseLectureIds = [];

    for (const section of course.sections) {
      for (const lecture of section.lectures) {
        courseLectureIds.push(lecture._id.toString());
      }
    }

    // Count completed lectures
    const completedLectures = enrollment.lectureProgress.filter(
      (item) =>
        item.isCompleted &&
        courseLectureIds.includes(item.lecture.toString())
    ).length;

    // Calculate overall course progress
    const progress =
      totalLectures > 0
        ? Math.round((completedLectures / totalLectures) * 100)
        : 0;

    enrollment.progress = progress;

    // Mark enrollment completed when all lectures are completed
    if (progress === 100) {
      enrollment.status = "completed";
      enrollment.completedAt = enrollment.completedAt || new Date();
    }

    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: {
        courseId,
        lectureId,
        watchedDuration: lectureProgress.watchedDuration,
        lastPosition: lectureProgress.lastPosition,
        isCompleted: lectureProgress.isCompleted,
        progress: enrollment.progress,
        status: enrollment.status,
      },
    });
  } catch (error) {
    console.error("Update course progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ==================== GET COURSE PROGRESS ====================
 const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check student's enrollment
    const enrollment = await Enrollment.findOne({
      student: req.student._id,
      course: courseId,
      status: { $in: ["active", "completed"] },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Find approved and active course
    const course = await Course.findOne({
      _id: courseId,
      approvalStatus: "approved",
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get all lectures from the course
    const lectures = [];

    for (const section of course.sections) {
      for (const lecture of section.lectures) {
        lectures.push({
          lectureId: lecture._id.toString(),
          title: lecture.title,
          duration: lecture.duration,
        });
      }
    }

    // Match saved progress with current course lectures
    const lectureProgress = lectures.map((lecture) => {
      const savedProgress = enrollment.lectureProgress.find(
        (item) => item.lecture.toString() === lecture.lectureId
      );

      return {
        lectureId: lecture.lectureId,
        title: lecture.title,
        duration: lecture.duration,
        watchedDuration: savedProgress?.watchedDuration || 0,
        lastPosition: savedProgress?.lastPosition || 0,
        isCompleted: savedProgress?.isCompleted || false,
      };
    });

    // Count completed lectures
    const completedLectures = lectureProgress.filter(
      (lecture) => lecture.isCompleted
    ).length;

    const totalLectures = lectures.length;

    // Calculate progress
    const progress =
      totalLectures > 0
        ? Math.round((completedLectures / totalLectures) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      message: "Course progress fetched successfully",
      data: {
        courseId,
        totalLectures,
        completedLectures,
        progress,
        status: enrollment.status,
        lectureProgress,
      },
    });
  } catch (error) {
    console.error("Get course progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export {
  registerStudent,
  verifyStudentAccount,
  resendStudentVerificationEmail,
  loginStudent,
  forgotStudentPassword,
  resetStudentPassword,
  updateStudentProfile,
  getStudentProfile,
  enrollInCourse,
  getMyEnrollments,
  getEnrolledCourseDetail,
  getLecture,
  getCourseProgress
};