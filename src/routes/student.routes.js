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
  getLectureVideo,
  getCourseProgress,
} from "../controllers/student.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import studentMiddleware from "../middlewares/student.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";

import { getStudentDashboard } from "../controllers/student.dashboard.controller.js";

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
  validateObjectId("courseId"),
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
  validateObjectId("courseId"),
  getEnrolledCourseDetail
);

// ==================== LECTURE ACCESS ====================

router.get(
  "/courses/:courseId/sections/:sectionId/lectures/:lectureId",
  authMiddleware,
  studentMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  validateObjectId("lectureId"),
  getLecture
);

// ==================== LECTURE VIDEO ====================

router.get(
  "/courses/:courseId/sections/:sectionId/lectures/:lectureId/video",
  authMiddleware,
  studentMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  validateObjectId("lectureId"),
  getLectureVideo
);

// Get progress of a specific course
router.get(
  "/courses/:courseId/progress",
  authMiddleware,
  studentMiddleware,
  validateObjectId("courseId"),
  getCourseProgress
);

// ==================== UPDATE COURSE PROGRESS ====================

router.patch(
  "/courses/:courseId/progress",
  authMiddleware,
  studentMiddleware,
  validateObjectId("courseId"),
  updateCourseProgress
);

// ==================== STUDENT DASHBOARD ====================

router.get(
  "/dashboard",
  authMiddleware,
  studentMiddleware,
  getStudentDashboard
);

export default router;