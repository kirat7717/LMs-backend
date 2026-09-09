/**
 * @swagger
 * tags:
 *   name: Super Admins
 *   description: Super Admin authentication and profile APIs
 */

/**
 * @swagger
 * /api/super-admin/login:
 *   post:
 *     summary: Login Super Admin
 *     tags: [Super Admins]
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
 *                 example: superadmin@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Super Admin logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Super Admin account blocked or inactive
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/super-admin/forgot-password:
 *   post:
 *     summary: Request Super Admin password reset
 *     tags: [Super Admins]
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
 *                 example: superadmin@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Super Admin not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/super-admin/reset-password:
 *   post:
 *     summary: Reset Super Admin password
 *     tags: [Super Admins]
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
 * /api/super-admin/profile:
 *   put:
 *     summary: Update Super Admin profile
 *     tags: [Super Admins]
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
 *                 example: Super Admin
 *               bio:
 *                 type: string
 *                 example: LMS platform administrator
 *               avatar:
 *                 type: string
 *                 example: http://localhost:9000/images/avatar.png
 *     responses:
 *       200:
 *         description: Super Admin profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Super Admin access required
 *       404:
 *         description: Super Admin not found
 *       500:
 *         description: Server error
 */