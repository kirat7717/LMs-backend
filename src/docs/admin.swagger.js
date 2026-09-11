/**
 * @swagger
 * tags:
 *   - name: Admin & Management
 *     description: Admin authentication, profile and Admin/Super Admin management APIs
 */

/**
 * @swagger
 * /api/admin/set-password:
 *   post:
 *     summary: Set Password
 *     tags:
 *       - Admin
 *     description: Set the Admin password using the invitation/setup token.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: YOUR_ADMIN_SETUP_TOKEN
 *               password:
 *                 type: string
 *                 example: Admin@123
 *               confirmPassword:
 *                 type: string
 *                 example: Admin@123
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Admin
 *     description: Authenticate the user and return an access token.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *             required:
 *               - email
 *               - password
 */

/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     summary: Get Profile
 *     tags:
 *       - Admin
 *     description: Get the authenticated user's profile.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 */

/**
 * @swagger
 * /api/admin/profile:
 *   patch:
 *     summary: Update Profile
 *     tags:
 *       - Admin
 *     description: Update the authenticated user's profile.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Admin
 *               bio:
 *                 type: string
 *                 example: LMS administrator
 *               avatar:
 *                 type: string
 *                 example: ""
 *             required:
 *               - name
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Dashboard
 *     tags:
 *       - Admin
 *     description: Get the authenticated user's dashboard.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 */

/**
 * @swagger
 * /api/admin/teacher-requests:
 *   get:
 *     summary: Get Teacher Requests
 *     tags:
 *       - Admin Management
 *     description: Get teacher registration/application requests.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 */

/**
 * @swagger
 * /api/admin/teacher-requests/{teacherRequestId}:
 *   patch:
 *     summary: Update Teacher Request
 *     tags:
 *       - Admin Management
 *     description: Approve or reject a teacher registration/application request.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 *     parameters:
 *       - in: "path"
 *         name: teacherRequestId
 *         required: true
 *         schema:
 *           type: string
 *         description: teacherRequestId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: approved
 *             required:
 *               - status
 */

/**
 * @swagger
 * /api/admin/teachers:
 *   get:
 *     summary: Get Teachers
 *     tags:
 *       - Admin Management
 *     description: Get teachers.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 */

/**
 * @swagger
 * /api/admin/teachers/{teacherId}/status:
 *   patch:
 *     summary: Update Teacher Status
 *     tags:
 *       - Admin Management
 *     description: Block/unblock or update teacher status.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 *     parameters:
 *       - in: "path"
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: teacherId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *                 example: false
 */

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get Students
 *     tags:
 *       - Admin Management
 *     description: Get students.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 */

/**
 * @swagger
 * /api/admin/students/{studentId}/status:
 *   patch:
 *     summary: Update Student Status
 *     tags:
 *       - Admin Management
 *     description: Block/unblock or update student status.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 *     parameters:
 *       - in: "path"
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: studentId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *                 example: false
 */

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Get Courses
 *     tags:
 *       - Admin Management
 *     description: Get courses for management/approval.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 */

/**
 * @swagger
 * /api/admin/courses/{courseId}:
 *   patch:
 *     summary: Update Course Approval
 *     tags:
 *       - Admin Management
 *     description: Approve or reject a course.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 *     parameters:
 *       - in: "path"
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: courseId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: approved
 *             required:
 *               - status
 */

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create Category
 *     tags:
 *       - Admin Management
 *     description: Create a course category.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Web Development
 *               description:
 *                 type: string
 *                 example: Web development courses
 *             required:
 *               - name
 */

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get Categories
 *     tags:
 *       - Admin Management
 *     description: Get all categories.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 */

/**
 * @swagger
 * /api/admin/categories/{categoryId}:
 *   patch:
 *     summary: Update Category
 *     tags:
 *       - Admin Management
 *     description: Update a course category.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 *     parameters:
 *       - in: "path"
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: categoryId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Backend Development
 *               description:
 *                 type: string
 *                 example: Backend courses
 *               isActive:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - name
 */

/**
 * @swagger
 * /api/admin/categories/{categoryId}:
 *   delete:
 *     summary: Delete Category
 *     tags:
 *       - Admin Management
 *     description: Delete a course category.
 *     responses:
 *       200:
 *         description: Request completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resource not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth:
 *     parameters:
 *       - in: "path"
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: categoryId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 */
