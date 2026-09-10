import express from "express";

import {
  setAdminPassword,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();


// ==================== PUBLIC ADMIN APIs ====================

// Set Admin password using setup token
router.post(
  "/set-password",
  setAdminPassword
);

// Admin login
router.post(
  "/login",
  loginAdmin
);


// ==================== PROTECTED ADMIN APIs ====================

// Get Admin profile
router.get(
  "/profile",
  authMiddleware,
  adminMiddleware,
  getAdminProfile
);

// Update Admin profile
router.patch(
  "/profile",
  authMiddleware,
  adminMiddleware,
  updateAdminProfile
);


export default router;