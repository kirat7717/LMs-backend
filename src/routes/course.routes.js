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

const router = express.Router();

/* =========================
   PUBLIC COURSE APIs
========================= */

// Get all approved courses
router.get("/", getCourses);

// Get single approved course detail
router.get("/:id", getCourseDetail);


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
  updateCourse
);

// Add section
router.post(
  "/:courseId/sections",
  authMiddleware,
  teacherMiddleware,
  addSection
);

// Update section / lecture
router.patch(
  "/:courseId/sections/:sectionId",
  authMiddleware,
  teacherMiddleware,
  updateSection
);

// Delete section
router.delete(
  "/:courseId/sections/:sectionId",
  authMiddleware,
  teacherMiddleware,
  deleteSection
);

// Delete specific lecture
router.delete(
  "/:courseId/sections/:sectionId/lectures/:lectureId",
  authMiddleware,
  teacherMiddleware,
  deleteLecture
);

// Upload lecture video
router.post(
  "/:courseId/sections/:sectionId/lectures/:lectureId/video",
  authMiddleware,
  teacherMiddleware,
  uploadVideo.single("video"),
  uploadLectureVideo
);

export default router;