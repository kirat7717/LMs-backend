import express from "express";

import {
  getCourses,
  getCourseDetail,
  createCourse,
  updateCourse,
  addSection,
  updateSection,
  deleteSection,
  deleteLecture,
  uploadLectureVideo,
} from "../controllers/course.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import teacherMiddleware from "../middlewares/teacher.middleware.js";
import uploadVideo from "../middlewares/uploadVideo.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";

const router = express.Router();

/* =========================
   PUBLIC COURSE APIs
========================= */

// Get all approved courses
router.get("/", getCourses);

// Get single approved course detail
router.get(
  "/:id",
  validateObjectId("id"),
  getCourseDetail
);


/* =========================
   TEACHER COURSE APIs
========================= */

// Create new course
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

// Add section
router.post(
  "/:courseId/sections",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  addSection
);

// Update section / lecture
router.patch(
  "/:courseId/sections/:sectionId",
  authMiddleware,
  teacherMiddleware,
  validateObjectId("courseId"),
  validateObjectId("sectionId"),
  updateSection
);

// Delete section
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


export default router;