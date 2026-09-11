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
import adminSuperMiddleware from "../middlewares/adminSuperAdminMiddleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";

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
  adminSuperMiddleware,
  getTeacherRequests
);

// Approve or reject teacher registration request
router.patch(
  "/teacher-requests/:id",
  authMiddleware,
  adminSuperMiddleware,
  validateObjectId("id"),
  updateTeacherRequest
);

// Get all teachers
router.get(
  "/teachers",
  authMiddleware,
  adminSuperMiddleware,
  getTeachers
);

// Block / unblock teacher
router.patch(
  "/teachers/:id/status",
  authMiddleware,
  adminSuperMiddleware,
  validateObjectId("id"),
  updateTeacherStatus
);

// ==================== STUDENT MANAGEMENT ====================

// Get all students
router.get(
  "/students",
  authMiddleware,
  adminSuperMiddleware,
  getStudents
);

// Block / unblock student
router.patch(
  "/students/:id/status",
  authMiddleware,
  adminSuperMiddleware,
  validateObjectId("id"),
  updateStudentStatus
);

// ==================== COURSE MANAGEMENT ====================

// Get all courses
router.get(
  "/courses",
  authMiddleware,
  adminSuperMiddleware,
  getCourses
);

// Approve or reject course
router.patch(
  "/courses/:id",
  authMiddleware,
  adminSuperMiddleware,
  validateObjectId("id"),
  updateCourseApproval
);

// ==================== CATEGORY MANAGEMENT ====================

// Create category
router.post(
  "/categories",
  authMiddleware,
  adminSuperMiddleware,
  createCategory
);

// Update category
router.patch(
  "/categories/:id",
  authMiddleware,
  adminSuperMiddleware,
  validateObjectId("id"),
  updateCategory
);

// Get all categories
router.get(
  "/categories",
  authMiddleware,
  adminSuperMiddleware,
  getCategories
);

// Delete category
router.delete(
  "/categories/:id",
  authMiddleware,
  adminSuperMiddleware,
  validateObjectId("id"),
  deleteCategory
);

export default router;