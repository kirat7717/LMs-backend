import Student from "../models/student.model.js";
import Enrollment from "../models/enrollment.model.js";

// ==================== GET STUDENT DASHBOARD ====================

export const getStudentDashboard = async (req, res) => {
  try {
    // Fetch student and enrollment data in parallel
    const [student, enrollments] = await Promise.all([
      Student.findById(req.student._id).select("name email avatar"),

      Enrollment.aggregate([
        // Only current student's active/completed enrollments
        {
          $match: {
            student: req.student._id,
            status: { $in: ["active", "completed"] },
          },
        },

        // Get required course information
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "course",
          },
        },

        // Convert course array into object
        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Only fetch fields required by dashboard
        {
          $project: {
            course: 1,
            status: 1,
            progress: 1,
            lectureProgress: 1,
            enrolledAt: 1,
            completedAt: 1,

            "course._id": 1,
            "course.title": 1,
            "course.thumbnail": 1,
            "course.price": 1,
          },
        },

        // Latest enrollments first
        {
          $sort: {
            enrolledAt: -1,
          },
        },
      ]),
    ]);

    // Check student
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==================== COURSE STATISTICS ====================

    const totalCourses = enrollments.length;

    const activeCourses = enrollments.filter(
      (enrollment) => enrollment.status === "active"
    ).length;

    const completedCourses = enrollments.filter(
      (enrollment) => enrollment.status === "completed"
    ).length;

    // ==================== CONTINUE LEARNING ====================

    const continueLearningEnrollment = enrollments.find(
      (enrollment) =>
        enrollment.status === "active" &&
        enrollment.progress > 0
    );

    let continueLearning = null;

    if (continueLearningEnrollment) {
      const progressList =
        continueLearningEnrollment.lectureProgress || [];

      // Last progress entry represents the latest watched lecture
      const lastWatchedLecture =
        progressList.length > 0
          ? progressList[progressList.length - 1]
          : null;

      continueLearning = {
        courseId: continueLearningEnrollment.course?._id,
        title: continueLearningEnrollment.course?.title,
        thumbnail: continueLearningEnrollment.course?.thumbnail,
        progress: continueLearningEnrollment.progress,

        lastWatchedLecture: lastWatchedLecture
          ? {
              lectureId: lastWatchedLecture.lecture,
              watchedDuration: lastWatchedLecture.watchedDuration,
              lastPosition: lastWatchedLecture.lastPosition,
              isCompleted: lastWatchedLecture.isCompleted,
            }
          : null,
      };
    }

    // ==================== RECENT COURSES ====================

    const recentCourses = enrollments.slice(0, 5).map((enrollment) => ({
      courseId: enrollment.course?._id,
      title: enrollment.course?.title,
      thumbnail: enrollment.course?.thumbnail,
      price: enrollment.course?.price,
      progress: enrollment.progress,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
    }));

    // ==================== COMPLETED COURSES ====================

    const recentlyCompletedCourses = enrollments
      .filter((enrollment) => enrollment.status === "completed")
      .slice(0, 5)
      .map((enrollment) => ({
        courseId: enrollment.course?._id,
        title: enrollment.course?.title,
        thumbnail: enrollment.course?.thumbnail,
        progress: enrollment.progress,
        completedAt: enrollment.completedAt,
      }));

    // ==================== RESPONSE ====================

    return res.status(200).json({
      success: true,
      message: "Student dashboard fetched successfully",

      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
        },

        stats: {
          totalCourses,
          activeCourses,
          completedCourses,
        },

        continueLearning,

        recentCourses,

        recentlyCompletedCourses,
      },
    });
  } catch (error) {
    console.error("Get student dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};