import express from "express";

import {
  loginSuperAdmin,
  forgotSuperAdminPassword,
  resetSuperAdminPassword,
  updateSuperAdminProfile,
  getSuperAdminProfile,
  createAdmin,
} from "../controllers/superAdmin.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import superAdminMiddleware from "../middlewares/superAdmin.middleware.js";

const router = express.Router();


// ==================== PUBLIC SUPER ADMIN APIs ====================

// Super Admin login
router.post(
  "/login",
  loginSuperAdmin
);

// Forgot Super Admin password
router.post(
  "/forgot-password",
  forgotSuperAdminPassword
);

// Reset Super Admin password
router.post(
  "/reset-password",
  resetSuperAdminPassword
);


// ==================== PROTECTED SUPER ADMIN APIs ====================

// Get Super Admin profile
router.get(
  "/profile",
  authMiddleware,
  superAdminMiddleware,
  getSuperAdminProfile
);

// Update Super Admin profile
router.patch(
  "/profile",
  authMiddleware,
  superAdminMiddleware,
  updateSuperAdminProfile
);


// ==================== ADMIN MANAGEMENT ====================

// Create new Admin
router.post(
  "/admins",
  authMiddleware,
  superAdminMiddleware,
  createAdmin
);


export default router;