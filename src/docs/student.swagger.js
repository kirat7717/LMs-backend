/**
 * @swagger
 * tags:
 *   - name: Student
 *     description: Student APIs
 */

/**
 * @swagger
 * /students/register:
 *   post:
 *     summary: Register
 *     tags:
 *       - Student
 *     description: Register a new student account.
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
 *                 example: Test Student
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 example: Student@123
 *             required:
 *               - name
 *               - email
 *               - password
 */

/**
 * @swagger
 * /students/verify-account:
 *   get:
 *     summary: Verify Account
 *     tags:
 *       - Student
 *     description: Verify the student account using the verification token.
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
 *     parameters:
 *       - in: "query"
 *         name: token
 *         required: false
 *         schema:
 *           type: string
 *         example: YOUR_VERIFICATION_TOKEN
 */

/**
 * @swagger
 * /students/resend-verification:
 *   post:
 *     summary: Resend Verification
 *     tags:
 *       - Student
 *     description: Resend the student account verification email.
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
 *                 example: student@example.com
 *             required:
 *               - email
 */

/**
 * @swagger
 * /students/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Student
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
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 example: Student@123
 *             required:
 *               - email
 *               - password
 */

/**
 * @swagger
 * /students/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags:
 *       - Student
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
 *                 example: student@example.com
 *             required:
 *               - email
 */

/**
 * @swagger
 * /students/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags:
 *       - Student
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
 * /students/profile:
 *   get:
 *     summary: Get Profile
 *     tags:
 *       - Student
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
 * /students/profile:
 *   put:
 *     summary: Update Profile
 *     tags:
 *       - Student
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
 *                 example: Updated Student
 *               bio:
 *                 type: string
 *                 example: LMS student
 *               avatar:
 *                 type: string
 *                 example: ""
 *             required:
 *               - name
 */

/**
 * @swagger
 * /students/enroll/{courseId}:
 *   post:
 *     summary: Enroll Course
 *     tags:
 *       - Student
 *     description: Enroll the authenticated student in a course.
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
 * /students/enrollments:
 *   get:
 *     summary: My Enrollments
 *     tags:
 *       - Student
 *     description: Get courses enrolled by the authenticated student.
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
 * /students/enrollments/{courseId}:
 *   get:
 *     summary: Enrolled Course Detail
 *     tags:
 *       - Student
 *     description: Get details of an enrolled course.
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
 * /students/courses/{courseId}/sections/{sectionId}/lectures/{lectureId}:
 *   get:
 *     summary: Get Lecture
 *     tags:
 *       - Student
 *     description: Get a lecture available to the enrolled student.
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

/**
 * @swagger
 * /students/courses/{courseId}/sections/{sectionId}/lectures/{lectureId}/video:
 *   get:
 *     summary: Get Lecture Video
 *     tags:
 *       - Student
 *     description: Get protected lecture video for an enrolled student.
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

/**
 * @swagger
 * /students/courses/{courseId}/progress:
 *   patch:
 *     summary: Update Course Progress
 *     tags:
 *       - Student
 *     description: Update lecture/course learning progress.
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
 *               lectureId:
 *                 type: string
 *                 example: "{{lectureId}}"
 *               watchedDuration:
 *                 type: integer
 *                 example: 60
 *               lastPosition:
 *                 type: integer
 *                 example: 60
 *               isCompleted:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - lectureId
 */

/**
 * @swagger
 * /students/courses/{courseId}/progress:
 *   get:
 *     summary: Get Course Progress
 *     tags:
 *       - Student
 *     description: Get the student's course progress.
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
 * /students/dashboard:
 *   get:
 *     summary: Dashboard
 *     tags:
 *       - Student
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
