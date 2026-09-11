import Teacher from "../models/teacher.model.js";
import Course from "../models/course.model.js";

// ==================== GET TEACHER DASHBOARD ====================

export const getTeacherDashboard = async (req, res) => {
  try {
    // --------------------------------------------------
    // Fetch teacher profile and teacher's course dashboard
    // data in parallel.
    // --------------------------------------------------

    const [teacher, dashboardData] = await Promise.all([
      Teacher.findById(req.teacher._id).select(
        "name email avatar phone qualification experience specialization"
      ),

      Course.aggregate([
        // Get only courses created by the logged-in teacher
        {
          $match: {
            teacher: req.teacher._id,
          },
        },

        // Get enrollment information for each course
        {
          $lookup: {
            from: "enrollments",
            localField: "_id",
            foreignField: "course",
            as: "enrollments",
          },
        },

        // Calculate course-wise student statistics
        {
          $addFields: {
            totalStudents: {
              $size: {
                $filter: {
                  input: "$enrollments",
                  as: "enrollment",
                  cond: {
                    $in: [
                      "$$enrollment.status",
                      ["active", "completed"],
                    ],
                  },
                },
              },
            },

            completedStudents: {
              $size: {
                $filter: {
                  input: "$enrollments",
                  as: "enrollment",
                  cond: {
                    $eq: [
                      "$$enrollment.status",
                      "completed",
                    ],
                  },
                },
              },
            },

            averageProgress: {
              $cond: [
                {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$enrollments",
                          as: "enrollment",
                          cond: {
                            $in: [
                              "$$enrollment.status",
                              ["active", "completed"],
                            ],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                {
                  $round: [
                    {
                      $avg: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$enrollments",
                              as: "enrollment",
                              cond: {
                                $in: [
                                  "$$enrollment.status",
                                  ["active", "completed"],
                                ],
                              },
                            },
                          },
                          as: "enrollment",
                          in: "$$enrollment.progress",
                        },
                      },
                    },
                    0,
                  ],
                },
                0,
              ],
            },
          },
        },

        // We do not need complete enrollment data in the response
        {
          $project: {
            enrollments: 0,
          },
        },

        // Latest courses first
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]),
    ]);

    // --------------------------------------------------
    // Check whether the authenticated teacher exists.
    // --------------------------------------------------

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher account not found",
      });
    }

    // ==================== COURSE STATISTICS ====================

    const totalCourses = dashboardData.length;

    const approvedCourses = dashboardData.filter(
      (course) => course.approvalStatus === "approved"
    ).length;

    const pendingCourses = dashboardData.filter(
      (course) => course.approvalStatus === "pending"
    ).length;

    const rejectedCourses = dashboardData.filter(
      (course) => course.approvalStatus === "rejected"
    ).length;

    // --------------------------------------------------
    // Calculate unique students across all teacher courses.
    // For this dashboard statistic, we fetch only student IDs.
    // --------------------------------------------------

    const approvedCourseIds = dashboardData
      .filter((course) => course.approvalStatus === "approved")
      .map((course) => course._id);

    let totalStudents = 0;

    if (approvedCourseIds.length > 0) {
      const enrollmentStats = await Course.aggregate([
        // Only approved courses of this teacher
        {
          $match: {
            _id: { $in: approvedCourseIds },
          },
        },

        // Find enrollments for each course
        {
          $lookup: {
            from: "enrollments",
            localField: "_id",
            foreignField: "course",
            pipeline: [
              {
                $match: {
                  status: {
                    $in: ["active", "completed"],
                  },
                },
              },
              {
                $project: {
                  student: 1,
                },
              },
            ],
            as: "enrollments",
          },
        },

        // Convert all course enrollments into one array
        {
          $project: {
            students: "$enrollments.student",
          },
        },

        {
          $unwind: "$students",
        },

        // Count each student only once
        {
          $group: {
            _id: "$students",
          },
        },

        // Count unique students
        {
          $count: "totalStudents",
        },
      ]);

      totalStudents =
        enrollmentStats[0]?.totalStudents || 0;
    }

    // ==================== RECENT COURSES ====================

    // Return the five most recently created courses.
    const recentCourses = dashboardData
      .slice(0, 5)
      .map((course) => ({
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        price: course.price,
        approvalStatus: course.approvalStatus,
        rejectionReason: course.rejectionReason,
        createdAt: course.createdAt,
      }));

    // ==================== COURSE SUMMARY ====================

    // Return enrollment and progress summary for each course.
    const courseSummary = dashboardData
      .filter(
        (course) => course.approvalStatus === "approved"
      )
      .map((course) => ({
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        price: course.price,
        totalStudents: course.totalStudents,
        completedStudents: course.completedStudents,
        averageProgress: course.averageProgress,
      }));

    // ==================== RESPONSE ====================

    return res.status(200).json({
      success: true,
      message: "Teacher dashboard fetched successfully",

      data: {
        // Basic teacher information
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          avatar: teacher.avatar,
          phone: teacher.phone,
          qualification: teacher.qualification,
          experience: teacher.experience,
          specialization: teacher.specialization,
        },

        // Overall dashboard statistics
        stats: {
          totalCourses,
          approvedCourses,
          pendingCourses,
          rejectedCourses,
          totalStudents,
        },

        // Recently created courses
        recentCourses,

        // Course-wise enrollment and progress information
        courseSummary,
      },
    });
  } catch (error) {
    console.error(
      "Get teacher dashboard error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};