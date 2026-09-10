/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Student authentication and profile APIs
 */

/**
 * @swagger
 * /api/students/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               confirmPassword:
 *                 type: string
 *                 example: Password123
 *               bio:
 *                 type: string
 *                 example: Backend learner
 *               avatar:
 *                 type: string
 *                 example: http://localhost:9000/images/avatar.png
 *     responses:
 *       201:
 *         description: Student registered successfully. Account verification link sent.
 *       400:
 *         description: Validation error
 *       409:
 *         description: Student already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/verify-account:
 *   get:
 *     summary: Verify student account
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Temporary student account verification token
 *         example: verification-token-here
 *     responses:
 *       200:
 *         description: Student account verified successfully
 *       400:
 *         description: Verification token is missing, invalid, or expired
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/resend-verification:
 *   post:
 *     summary: Resend student account verification email
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *     responses:
 *       200:
 *         description: Account verification email sent successfully
 *       400:
 *         description: Validation error or student account is already verified
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/login:
 *   post:
 *     summary: Login student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Student logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Student account is not verified or is blocked
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/forgot-password:
 *   post:
 *     summary: Request student password reset
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/reset-password:
 *   post:
 *     summary: Reset student password
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: reset-token-here
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/profile:
 *   put:
 *     summary: Update student profile
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               bio:
 *                 type: string
 *                 example: Full stack developer
 *               avatar:
 *                 type: string
 *                 example: http://localhost:9000/images/avatar.png
 *     responses:
 *       200:
 *         description: Student profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Student access required or account blocked
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/students/profile:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student profile
 *     description: Returns the profile of the currently authenticated student.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Access denied, student access required, or account is blocked
 *       404:
 *         description: Student account not found
 *       500:
 *         description: Internal server error
 */