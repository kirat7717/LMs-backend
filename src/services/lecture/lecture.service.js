import Enrollment from "../../models/enrollment.model.js";
import Course from "../../models/course.model.js";

// ==================== GET LECTURE ACCESS ====================

export const getLectureAccess = async ({
  studentId,
  courseId,
  sectionId,
  lectureId,
}) => {
  // Check whether student is enrolled in the course
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    status: { $in: ["active", "completed"] },
  }).lean();

  if (!enrollment) {
    return {
      error: {
        statusCode: 403,
        message: "You are not enrolled in this course",
      },
    };
  }

  // Find only approved and active course
  const course = await Course.findOne({
    _id: courseId,
    approvalStatus: "approved",
    isActive: true,
  }).lean();

  if (!course) {
    return {
      error: {
        statusCode: 404,
        message: "Course not found or not available",
      },
    };
  }

  // Find section
  const section = course.sections.find(
    (section) => section._id.toString() === sectionId
  );

  if (!section) {
    return {
      error: {
        statusCode: 404,
        message: "Section not found",
      },
    };
  }

  // Find lecture
  const lecture = section.lectures.find(
    (lecture) => lecture._id.toString() === lectureId
  );

  if (!lecture) {
    return {
      error: {
        statusCode: 404,
        message: "Lecture not found",
      },
    };
  }

  // Return all verified lecture access data
  return {
    enrollment,
    course,
    section,
    lecture,
  };
};