import express from "express";

import {
  registerStudent,
  verifyStudentAccount,
  resendStudentVerificationEmail,
  forgotStudentPassword,
  resetStudentPassword,
  loginStudent,
  updateStudentProfile,
  getStudentProfile,
  enrollInCourse,
  getMyEnrollments,
  getEnrolledCourseDetail,
  getLecture,
  updateCourseProgress,
} from "../controllers/student.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import studentMiddleware from "../middlewares/student.middleware.js";

const router = express.Router();

// ==================== STUDENT REGISTRATION ====================

router.post("/register", registerStudent);

// ==================== STUDENT ACCOUNT VERIFICATION ====================

router.get("/verify-account", verifyStudentAccount);

// ==================== RESEND ACCOUNT VERIFICATION ====================

router.post("/resend-verification", resendStudentVerificationEmail);

// ==================== STUDENT LOGIN ====================

router.post("/login", loginStudent);

// ==================== FORGOT PASSWORD ====================

router.post("/forgot-password", forgotStudentPassword);

// ==================== RESET PASSWORD ====================

router.post("/reset-password", resetStudentPassword);

// ==================== UPDATE STUDENT PROFILE ====================

router.put(
  "/profile",
  authMiddleware,
  studentMiddleware,
  updateStudentProfile
);
// ==================== GET STUDENT PROFILE ====================

router.get(
  "/profile",
  authMiddleware,
  studentMiddleware,
  getStudentProfile
);

// ==================== ENROLL IN COURSE ====================

router.post(
  "/enroll/:courseId",
  authMiddleware,
  studentMiddleware,
  enrollInCourse
);
// ==================== MY ENROLLMENTS ====================

router.get(
  "/enrollments",
  authMiddleware,
  studentMiddleware,
  getMyEnrollments
);
// ==================== ENROLLED COURSE DETAIL ====================

router.get(
  "/enrollments/:courseId",
  authMiddleware,
  studentMiddleware,
  getEnrolledCourseDetail
);

// ==================== LECTURE ACCESS ====================

router.get(
  "/courses/:courseId/sections/:sectionId/lectures/:lectureId",
  authMiddleware,
  studentMiddleware,
  getLecture
);

// ==================== UPDATE COURSE PROGRESS ====================
router.patch(
  "/courses/:courseId/progress",
  authMiddleware,
  studentMiddleware,
  updateCourseProgress
);

export default router;