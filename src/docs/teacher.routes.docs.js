/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teacher authentication and profile APIs
 */

/**
 * @swagger
 * /api/teachers/register:
 *   post:
 *     summary: Submit teacher registration request
 *     tags: [Teachers]
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
 *               - phone
 *               - qualification
 *               - experience
 *               - specialization
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amit Kumar
 *               email:
 *                 type: string
 *                 example: amit@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               confirmPassword:
 *                 type: string
 *                 example: Password123
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               qualification:
 *                 type: string
 *                 example: B.Tech Computer Science
 *               experience:
 *                 type: number
 *                 example: 5
 *               specialization:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Node.js
 *                   - MongoDB
 *               bio:
 *                 type: string
 *                 example: Backend developer and instructor
 *     responses:
 *       201:
 *         description: Teacher registration request submitted successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Teacher or pending request already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/login:
 *   post:
 *     summary: Login teacher
 *     tags: [Teachers]
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
 *                 example: amit@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Teacher logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account blocked
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/forgot-password:
 *   post:
 *     summary: Request teacher password reset
 *     tags: [Teachers]
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
 *                 example: amit@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/reset-password:
 *   post:
 *     summary: Reset teacher password
 *     tags: [Teachers]
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
 * /api/teachers/profile:
 *   put:
 *     summary: Update teacher profile
 *     tags: [Teachers]
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
 *                 example: Amit Kumar
 *               bio:
 *                 type: string
 *                 example: Backend instructor
 *               avatar:
 *                 type: string
 *                 example: http://localhost:9000/images/avatar.png
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               qualification:
 *                 type: string
 *                 example: B.Tech Computer Science
 *               experience:
 *                 type: number
 *                 example: 6
 *               specialization:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Node.js
 *                   - Express
 *     responses:
 *       200:
 *         description: Teacher profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access required or account blocked
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */