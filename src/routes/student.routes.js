import express from "express";

import {
  registerStudent,
  verifyStudentEmail,
  resendStudentVerificationEmail,
  forgotStudentPassword,
  resetStudentPassword,
  loginStudent,
  updateStudentProfile,
} from "../controllers/student.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import studentMiddleware from "../middlewares/student.middleware.js";

const router = express.Router();

// Register student
router.post("/register", registerStudent);

// Verify student email
router.get("/verify-email", verifyStudentEmail);

// Resend verification email
router.post("/resend-verification", resendStudentVerificationEmail);

// Student login
router.post("/login", loginStudent);

// Forgot student password
router.post("/forgot-password", forgotStudentPassword);

// Reset student password
router.post("/reset-password", resetStudentPassword);

// Update authenticated student profile
router.put(
  "/profile",
  authMiddleware,
  studentMiddleware,
  updateStudentProfile
);

export default router;