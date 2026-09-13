import express from "express";

// ==================== COURSE CONTROLLERS ====================

import {
  createCourse,
  updateCourse,
  addSection,
  updateSection,
  deleteSection,
  addLecture,
  updateLecture,
  deleteLecture,
  getTeacherCourses,
  getTeacherCourseDetail,
  uploadLectureVideo,
} from "../controllers/course.controller.js";

// ==================== TEACHER AUTH CONTROLLER ====================

import {
  registerTeacher,
  loginTeacher,
  updateTeacherProfile,
  forgotTeacherPassword,
  resetTeacherPassword,
  getTeacherProfile,
  logoutTeacher,
} from "../controllers/teacher.controller.js";

// ==================== MIDDLEWARES ====================

import authMiddleware from "../middlewares/auth.middleware.js";
import teacherMiddleware from "../middlewares/teacher.middleware.js";
import uploadVideo from "../middlewares/uploadVideo.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";

// ==================== DASHBOARD ====================

import {
  getTeacherDashboard,
} from "../controllers/teacher.dashboard.controller.js";

const router = express.Router();

// ============================================================
// TEACHER AUTH ROUTES
// ============================================================

// Register teacher
router.post(
  "/register",
  registerTeacher
);

// Login teacher
router.post(
  "/login",
  loginTeacher
);

// Forgot password
router.post(
  "/forgot-password",
  forgotTeacherPassword
);

// Reset password
router.post(
  "/reset-password",
  resetTeacherPassword
);

// ============================================================
// TEACHER PROFILE ROUTES
// ============================================================

// Get logged-in teacher profile
router.get(
  "/profile",
  authMiddleware,
  teacherMiddleware,
  getTeacherProfile
);

// Update logged-in teacher profile
router.patch(
  "/profile",
  authMiddleware,
  teacherMiddleware,
  updateTeacherProfile
);

// Logout teacher
router.post(
  "/logout",
  authMiddleware,
  teacherMiddleware,
  logoutTeacher
);

// ============================================================
// TEACHER DASHBOARD
// ============================================================

// Keep before /:id
router.get(
  "/dashboard",
  authMiddleware,
  teacherMiddleware,
  getTeacherDashboard
);

// ============================================================
// TEACHER COURSE VIEW ROUTES
// ============================================================

// Get all courses created by logged-in teacher
router.get(
  "/courses",
  authMiddleware,
  teacherMiddleware,
  getTeacherCourses
);

// Get single course created by logged-in teacher
router.get(
  "/courses/:id",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("id"),
  getTeacherCourseDetail
);

// ============================================================
// TEACHER COURSE MANAGEMENT
// ============================================================

// Create course
router.post(
  "/",
  authMiddleware,
  teacherMiddleware,
  createCourse
);

// Update own course
router.patch(
  "/:id",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("id"),
  updateCourse
);

// ============================================================
// SECTION MANAGEMENT
// ============================================================

// Add new section + first lecture
router.post(
  "/:courseId/sections",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  addSection
);

// Update section ONLY
router.patch(
  "/:courseId/sections/:sectionId",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  updateSection
);

// Delete complete section + all lectures
router.delete(
  "/:courseId/sections/:sectionId",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  deleteSection
);

// ============================================================
// LECTURE MANAGEMENT
// ============================================================

// Add lecture to existing section
router.post(
  "/:courseId/sections/:sectionId/lectures",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  addLecture
);

// Update specific lecture
router.patch(
  "/:courseId/sections/:sectionId/lectures/:lectureId",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  validateObjectId("lectureId"),
  updateLecture
);

// Delete specific lecture
router.delete(
  "/:courseId/sections/:sectionId/lectures/:lectureId",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  validateObjectId("lectureId"),
  deleteLecture
);

// ============================================================
// LECTURE VIDEO UPLOAD
// ============================================================

// Upload video only
// No courseId / sectionId / lectureId required
router.post(
  "/upload-video",
  authMiddleware,
  teacherMiddleware,
  uploadVideo.single("video"),
  uploadLectureVideo
);

export default router;