import express from "express";

// ==================== COURSE CONTROLLERS ====================

import {
  getCourses,
  getCourseDetail,
  createCourse,
  updateCourse,
  addSection,
  updateSection,
  deleteSection,
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

import { getTeacherDashboard } from "../controllers/teacher.dashboard.controller.js";

const router = express.Router();

// ============================================================
// TEACHER AUTH ROUTES
// ============================================================

// Teacher registration
router.post("/register", registerTeacher);

// Teacher login
router.post("/login", loginTeacher);

// Forgot teacher password
router.post("/forgot-password", forgotTeacherPassword);

// Reset teacher password
router.post("/reset-password", resetTeacherPassword);

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

// Teacher logout
router.post(
  "/logout",
  authMiddleware,
  teacherMiddleware,
  logoutTeacher
);

// ============================================================
// TEACHER DASHBOARD
// ============================================================

// Get dashboard data of the logged-in teacher
// Keep this BEFORE /:id
router.get(
  "/dashboard",
  authMiddleware,
  teacherMiddleware,
  getTeacherDashboard
);

// ============================================================
// PUBLIC COURSE ROUTES
// ============================================================

// Get all approved courses
router.get("/", getCourses);

// ============================================================
// TEACHER COURSE VIEW ROUTES
// ============================================================

// Get all courses created by logged-in teacher
// Keep this BEFORE /:id
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

// Update course basic information
router.patch(
  "/:id",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("id"),
  updateCourse
);

// ============================================================
// SECTION & LECTURE ROUTES
// ============================================================

// Add section + optional lecture
router.post(
  "/:courseId/sections",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  addSection
);

// Update section / add lecture / update lecture
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
// LECTURE VIDEO
// ============================================================

// Upload lecture video
router.post(
  "/:courseId/sections/:sectionId/lectures/:lectureId/video",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  validateObjectId("lectureId"),
  uploadVideo.single("video"),
  uploadLectureVideo
);

// ============================================================
// PUBLIC COURSE DETAIL
// ============================================================

// Get single approved course
// Keep this LAST because /:id can match many paths
router.get(
  "/:id",
  validateObjectId("id"),
  getCourseDetail
);

export default router;