import express from "express";

import {
  registerTeacher,
  loginTeacher,
  updateTeacherProfile,
  forgotTeacherPassword,
  resetTeacherPassword,
} from "../controllers/teacher.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import teacherMiddleware from "../middlewares/teacher.middleware.js";

const router = express.Router();

// Register teacher request
router.post("/register", registerTeacher);

// Teacher login
router.post("/login", loginTeacher);

// Update authenticated teacher profile
router.put(
  "/profile",
  authMiddleware,
  teacherMiddleware,
  updateTeacherProfile
);

// Forgot teacher password
router.post("/forgot-password", forgotTeacherPassword);

// Reset teacher password
router.post("/reset-password", resetTeacherPassword);

export default router;