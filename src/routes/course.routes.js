import express from "express";

import {
  getCourses,
  getCourseDetail,
} from "../controllers/course.controller.js";

import validateObjectId from "../middlewares/validateObjectId.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// ============================================================
// PUBLIC COURSE ROUTES
// ============================================================

// Get all approved courses
// No authentication required
router.get("/", getCourses);

// Get single approved course
// No authentication required
router.get(
  "/:id",
  authMiddleware,
  validateObjectId("id"),
  getCourseDetail
);

export default router;