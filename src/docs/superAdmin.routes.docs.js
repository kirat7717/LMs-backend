/**
 * @swagger
 * tags:
 *   - name: Super Admin
 *     description: Super Admin authentication and profile APIs
 *   - name: Super Admin Management
 *     description: Super Admin management APIs
 */

/**
 * @swagger
 * /api/super-admin/login:
 *   post:
 *     tags:
 *       - Super Admin
 *     summary: Super Admin login
 *     description: Login Super Admin using email and password.
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
 *                 format: email
 *                 example: superadmin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SuperAdmin@123
 *     responses:
 *       200:
 *         description: Super Admin logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Super Admin account is blocked or inactive
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/super-admin/forgot-password:
 *   post:
 *     tags:
 *       - Super Admin
 *     summary: Forgot Super Admin password
 *     description: Sends a password reset email to the Super Admin.
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
 *                 format: email
 *                 example: superadmin@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Super Admin account not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/super-admin/reset-password:
 *   post:
 *     tags:
 *       - Super Admin
 *     summary: Reset Super Admin password
 *     description: Reset Super Admin password using a valid password reset token.
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
 *                 example: 9f8a7b6c5d4e3f2a1b0c
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: NewPassword@123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Super Admin password reset successfully
 *       400:
 *         description: Invalid/expired token or validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/super-admin/profile:
 *   get:
 *     tags:
 *       - Super Admin
 *     summary: Get Super Admin profile
 *     description: Returns the profile of the currently authenticated Super Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Super Admin profile fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Super Admin access required
 *       404:
 *         description: Super Admin account not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/super-admin/profile:
 *   patch:
 *     tags:
 *       - Super Admin
 *     summary: Update Super Admin profile
 *     description: Update one or more Super Admin profile fields.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Rahul Sharma
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 example: LMS Super Administrator
 *               avatar:
 *                 type: string
 *                 example: https://example.com/images/super-admin-avatar.jpg
 *     responses:
 *       200:
 *         description: Super Admin profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Super Admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/super-admin/admins:
 *   post:
 *     tags:
 *       - Super Admin Management
 *     summary: Create a new Admin
 *     description: Create an Admin account and send an invitation/setup email to the Admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *     responses:
 *       201:
 *         description: Admin created successfully and setup email sent
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Super Admin access required
 *       409:
 *         description: Admin with this email already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/super-admin/dashboard:
 *   get:
 *     tags:
 *       - Super Admin
 *     summary: Get Super Admin dashboard
 *     description: Returns dashboard information for the authenticated Super Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Super Admin dashboard fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Super Admin access required
 *       500:
 *         description: Internal server error
 */