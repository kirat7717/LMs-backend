/**
 * @swagger
 * tags:
 *   - name: Teacher
 *     description: Teacher APIs
 */

/**
 * @swagger
 * /api/teachers/register:
 *   post:
 *     summary: Register / Teacher Application
 *     tags:
 *       - Teacher
 *     description: Submit a teacher registration/application request.
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
 *               name:
 *                 type: string
 *                 example: Test Teacher
 *               email:
 *                 type: string
 *                 example: teacher@example.com
 *               password:
 *                 type: string
 *                 example: Teacher@123
 *             required:
 *               - name
 *               - email
 *               - password
 */

/**
 * @swagger
 * /api/teachers/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Teacher
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
 *                 example: teacher@example.com
 *               password:
 *                 type: string
 *                 example: Teacher@123
 *             required:
 *               - email
 *               - password
 */

/**
 * @swagger
 * /api/teachers/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags:
 *       - Teacher
 *     description: Request a password reset email.
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
 *                 example: teacher@example.com
 *             required:
 *               - email
 */

/**
 * @swagger
 * /api/teachers/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags:
 *       - Teacher
 *     description: Reset the account password using a valid reset token.
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
 *                 example: YOUR_RESET_TOKEN
 *               password:
 *                 type: string
 *                 example: NewPassword@123
 *               confirmPassword:
 *                 type: string
 *                 example: NewPassword@123
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 */

/**
 * @swagger
 * /api/teachers/profile:
 *   get:
 *     summary: Get Profile
 *     tags:
 *       - Teacher
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
 * /api/teachers/profile:
 *   patch:
 *     summary: Update Profile
 *     tags:
 *       - Teacher
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
 *                 example: Updated Teacher
 *               bio:
 *                 type: string
 *                 example: LMS teacher
 *               avatar:
 *                 type: string
 *                 example: ""
 *             required:
 *               - name
 */

/**
 * @swagger
 * /api/teachers/logout:
 *   post:
 *     summary: Logout
 *     tags:
 *       - Teacher
 *     description: Logout
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
 * /api/teachers/dashboard:
 *   get:
 *     summary: Dashboard
 *     tags:
 *       - Teacher
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
 * /api/teachers:
 *   get:
 *     summary: Public Courses
 *     tags:
 *       - Teacher
 *     description: Get approved and active public courses.
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
 */

/**
 * @swagger
 * /api/teachers/courses:
 *   get:
 *     summary: My Courses
 *     tags:
 *       - Teacher
 *     description: Get courses owned by the authenticated teacher.
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
 * /api/teachers/courses/{courseId}:
 *   get:
 *     summary: My Course Detail
 *     tags:
 *       - Teacher
 *     description: Get details of a course owned by the authenticated teacher.
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
 */

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Create Course
 *     tags:
 *       - Teacher
 *     description: Create a new course for Admin approval.
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
 *               title:
 *                 type: string
 *                 example: Node.js Backend
 *               description:
 *                 type: string
 *                 example: Backend course
 *               thumbnail:
 *                 type: string
 *                 example: ""
 *               categoryId:
 *                 type: string
 *                 example: "{{categoryId}}"
 *               price:
 *                 type: integer
 *                 example: 0
 *               sections:
 *                 type: array
 *                 example:
 */

/**
 * @swagger
 * /api/teachers/{courseId}:
 *   patch:
 *     summary: Update Course
 *     tags:
 *       - Teacher
 *     description: Update an owned course without changing its approval status.
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
 *               title:
 *                 type: string
 *                 example: Updated Node.js Backend
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections:
 *   post:
 *     summary: Add Section
 *     tags:
 *       - Teacher
 *     description: Add a section to an owned course.
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
 *               title:
 *                 type: string
 *                 example: Introduction
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections/{sectionId}:
 *   patch:
 *     summary: Update Section
 *     tags:
 *       - Teacher
 *     description: Update a course section or its lecture.
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
 *       - in: "path"
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: sectionId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Introduction
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections/{sectionId}:
 *   delete:
 *     summary: Delete Section
 *     tags:
 *       - Teacher
 *     description: Delete a section from an owned course.
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
 *       - in: "path"
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: sectionId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections/{sectionId}/lectures/{lectureId}:
 *   delete:
 *     summary: Delete Lecture
 *     tags:
 *       - Teacher
 *     description: Delete a lecture from an owned course.
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
 *       - in: "path"
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: sectionId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *       - in: "path"
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: lectureId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 */
