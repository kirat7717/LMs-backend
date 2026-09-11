import Student from "../../models/student.model.js";
import Teacher from "../../models/teacher.model.js";
import Course from "../../models/course.model.js";
import Admin from "../../models/admin.model.js";

// ==================== GET COMMON DASHBOARD DATA ====================

export const getCommonDashboardData = async (
  includeAdminStats = false
) => {
  // --------------------------------------------------
  // Store all required dashboard queries in an array.
  //
  // Student, Teacher and Course statistics are common
  // for both Admin and Super Admin dashboards.
  //
  // Admin statistics are added only when
  // includeAdminStats is true.
  // --------------------------------------------------

  const dashboardQueries = [
    // ==================== STUDENT STATISTICS ====================

    Student.aggregate([
      {
        $facet: {
          // Total number of students
          total: [{ $count: "count" }],

          // Students who are not blocked
          active: [
            {
              $match: {
                isBlocked: false,
              },
            },
            { $count: "count" },
          ],

          // Students who are blocked
          blocked: [
            {
              $match: {
                isBlocked: true,
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]),

    // ==================== TEACHER STATISTICS ====================

    Teacher.aggregate([
      {
        $facet: {
          // Total number of teachers
          total: [{ $count: "count" }],

          // Active and unblocked teachers
          active: [
            {
              $match: {
                isActive: true,
                isBlocked: false,
              },
            },
            { $count: "count" },
          ],

          // Blocked teachers
          blocked: [
            {
              $match: {
                isBlocked: true,
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]),

    // ==================== COURSE STATISTICS ====================

    Course.aggregate([
      {
        $facet: {
          // Total number of courses
          total: [{ $count: "count" }],

          // Approved courses
          approved: [
            {
              $match: {
                approvalStatus: "approved",
              },
            },
            { $count: "count" },
          ],

          // Courses waiting for approval
          pending: [
            {
              $match: {
                approvalStatus: "pending",
              },
            },
            { $count: "count" },
          ],

          // Rejected courses
          rejected: [
            {
              $match: {
                approvalStatus: "rejected",
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]),
  ];

  // --------------------------------------------------
  // Admin statistics are required only by Super Admin.
  //
  // This query is not added for the normal Admin
  // dashboard, so Admin data is not unnecessarily
  // fetched for Admin users.
  // --------------------------------------------------

  if (includeAdminStats) {
    dashboardQueries.push(
      Admin.aggregate([
        {
          $facet: {
            // Total number of admins
            total: [{ $count: "count" }],

            // Active and unblocked admins
            active: [
              {
                $match: {
                  isActive: true,
                  isBlocked: false,
                },
              },
              { $count: "count" },
            ],

            // Inactive admins
            inactive: [
              {
                $match: {
                  isActive: false,
                },
              },
              { $count: "count" },
            ],

            // Blocked admins
            blocked: [
              {
                $match: {
                  isBlocked: true,
                },
              },
              { $count: "count" },
            ],
          },
        },
      ])
    );
  }

  // --------------------------------------------------
  // Run all required aggregation queries in parallel.
  //
  // Each aggregate() returns an array, therefore each
  // result still contains the aggregation result array.
  // --------------------------------------------------

  const [
    studentResult,
    teacherResult,
    courseResult,
    adminResult,
  ] = await Promise.all(dashboardQueries);

  // --------------------------------------------------
  // Extract the actual $facet result from each
  // aggregation response.
  //
  // aggregate() returns:
  //
  // [
  //   {
  //     total: [...],
  //     active: [...],
  //     blocked: [...]
  //   }
  // ]
  //
  // So [0] gets the actual $facet object.
  // --------------------------------------------------

  const students = studentResult[0];
  const teachers = teacherResult[0];
  const courses = courseResult[0];

  // ==================== COMMON DASHBOARD DATA ====================

  const dashboardData = {
    // --------------------------------------------------
    // Platform-wide totals.
    // These statistics are visible to both Admin
    // and Super Admin.
    // --------------------------------------------------

    platformOverview: {
      totalStudents: students.total[0]?.count || 0,
      totalTeachers: teachers.total[0]?.count || 0,
      totalCourses: courses.total[0]?.count || 0,
    },

    // --------------------------------------------------
    // Active and blocked users.
    // These statistics are common for both dashboards.
    // --------------------------------------------------

    userOverview: {
      activeStudents: students.active[0]?.count || 0,
      blockedStudents: students.blocked[0]?.count || 0,
      activeTeachers: teachers.active[0]?.count || 0,
      blockedTeachers: teachers.blocked[0]?.count || 0,
    },

    // --------------------------------------------------
    // Course approval statistics.
    // --------------------------------------------------

    courseOverview: {
      approved: courses.approved[0]?.count || 0,
      pending: courses.pending[0]?.count || 0,
      rejected: courses.rejected[0]?.count || 0,
    },
  };

  // --------------------------------------------------
  // Add Admin Management data only for Super Admin.
  //
  // Normal Admin will never receive this section.
  // --------------------------------------------------

  if (includeAdminStats) {
    const admins = adminResult[0];

    // Total Admins are also shown only to Super Admin
    // because Admin Management belongs to Super Admin.
    dashboardData.platformOverview.totalAdmins =
      admins.total[0]?.count || 0;

    dashboardData.adminManagement = {
      activeAdmins: admins.active[0]?.count || 0,
      inactiveAdmins: admins.inactive[0]?.count || 0,
      blockedAdmins: admins.blocked[0]?.count || 0,
    };
  }

  // Return the dashboard data to the respective controller
  return dashboardData;
};