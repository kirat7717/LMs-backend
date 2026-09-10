import express from "express";

import {
  getTeacherRequests,
  updateTeacherRequest,
  getTeachers,
  updateTeacherStatus,
  getStudents,
  updateStudentStatus,
  getCourses,
  updateCourseApproval,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();


// ==================== TEACHER MANAGEMENT ====================

// Get all teacher registration requests
router.get(
  "/teacher-requests",
  authMiddleware,
  adminMiddleware,
  getTeacherRequests
);

// Approve or reject teacher registration request
router.patch(
  "/teacher-requests/:id",
  authMiddleware,
  adminMiddleware,
  updateTeacherRequest
);

// Get all teachers
router.get(
  "/teachers",
  authMiddleware,
  adminMiddleware,
  getTeachers
);

// Block / unblock teacher
router.patch(
  "/teachers/:id/status",
  authMiddleware,
  adminMiddleware,
  updateTeacherStatus
);


// ==================== STUDENT MANAGEMENT ====================

// Get all students
router.get(
  "/students",
  authMiddleware,
  adminMiddleware,
  getStudents
);

// Block / unblock student
router.patch(
  "/students/:id/status",
  authMiddleware,
  adminMiddleware,
  updateStudentStatus
);


// ==================== COURSE MANAGEMENT ====================

// Get all courses
router.get(
  "/courses",
  authMiddleware,
  adminMiddleware,
  getCourses
);

// Approve or reject course
router.patch(
  "/courses/:id",
  authMiddleware,
  adminMiddleware,
  updateCourseApproval
);


// ==================== CATEGORY MANAGEMENT ====================

// Create category
router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  createCategory
);

// Update category
router.patch(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  updateCategory
);
router.get(
  "/categories",
  authMiddleware,
  adminMiddleware,
  getCategories
);
// Delete category
router.delete(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory
);


export default router;