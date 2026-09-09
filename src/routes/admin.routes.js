import express from "express";

import {
  updateTeacherRequest,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import superAdminMiddleware from "../middlewares/superAdmin.middleware.js";
import { createAdmin } from "../controllers/superAdmin.controller.js";

const router = express.Router();

// ==================== TEACHER REQUEST ====================

// Admin + Super Admin can approve or reject teacher requests
router.patch(
  "/teacher-requests/:id",
  authMiddleware,
  adminMiddleware,
  updateTeacherRequest
);

// Super Admin only
router.post(
  "/",
  authMiddleware,
  superAdminMiddleware,
  createAdmin
)
export default router;