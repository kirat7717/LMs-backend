/**
 * @swagger
 * tags:
 *   - name: Super Admin
 *     description: Super Admin authentication, profile, Admin creation and dashboard APIs
 */

/**
 * @swagger
 * /super-admin/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Super Admin
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
 *                 example: superadmin@example.com
 *               password:
 *                 type: string
 *                 example: SuperAdmin@123
 *             required:
 *               - email
 *               - password
 */

/**
 * @swagger
 * /super-admin/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags:
 *       - Super Admin
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
 *                 example: superadmin@example.com
 *             required:
 *               - email
 */

/**
 * @swagger
 * /super-admin/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags:
 *       - Super Admin
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
 * /super-admin/profile:
 *   get:
 *     summary: Get Profile
 *     tags:
 *       - Super Admin
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
 * /super-admin/profile:
 *   patch:
 *     summary: Update Profile
 *     tags:
 *       - Super Admin
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
 *                 example: Updated Super Admin
 *               bio:
 *                 type: string
 *                 example: LMS Super Administrator
 *               avatar:
 *                 type: string
 *                 example: ""
 *             required:
 *               - name
 */

/**
 * @swagger
 * /super-admin/admins:
 *   post:
 *     summary: Create Admin
 *     tags:
 *       - Super Admin
 *     description: Create a new Admin and send an invitation/setup email.
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
 *                 example: New Admin
 *               email:
 *                 type: string
 *                 example: newadmin@example.com
 *             required:
 *               - name
 *               - email
 */

/**
 * @swagger
 * /super-admin/dashboard:
 *   get:
 *     summary: Dashboard
 *     tags:
 *       - Super Admin
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
