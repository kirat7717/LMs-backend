/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin authentication, profile and dashboard APIs
 *   - name: Admin Management
 *     description: Admin and Super Admin management APIs
 */

/**
 * @swagger
 * /api/admin/set-password:
 *   post:
 *     summary: Set Admin password
 *     tags: [Admin]
 *     description: Complete Admin account setup using the setup token received by the Admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Admin setup token
 *                 example: admin-setup-token-here
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New Admin password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Admin account setup completed successfully
 *       400:
 *         description: Validation error or invalid/expired setup token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login Admin
 *     tags: [Admin]
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
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Admin logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     admin:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 64f123456789abcdef123456
 *                         name:
 *                           type: string
 *                           example: Admin User
 *                         email:
 *                           type: string
 *                           example: admin@example.com
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Admin account setup is incomplete or account is blocked
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     summary: Get Admin profile
 *     tags: [Admin]
 *     description: Returns the profile of the currently authenticated Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin access required or account is blocked
 *       404:
 *         description: Admin account not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/profile:
 *   patch:
 *     summary: Update Admin profile
 *     tags: [Admin]
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
 *                 example: Admin User
 *               bio:
 *                 type: string
 *                 example: LMS platform administrator
 *               avatar:
 *                 type: string
 *                 example: http://localhost:9000/images/admin-avatar.png
 *     responses:
 *       200:
 *         description: Admin profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin access required or account is blocked
 *       404:
 *         description: Admin account not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get Admin dashboard
 *     tags: [Admin]
 *     description: Returns dashboard statistics and information for the authenticated Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin access required or account is blocked
 *       404:
 *         description: Admin account not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/teacher-requests:
 *   get:
 *     summary: Get teacher registration requests
 *     tags: [Admin Management]
 *     description: Returns teacher registration requests. Results can be filtered by request status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - approved
 *             - rejected
 *         description: Filter teacher requests by status
 *         example: pending
 *     responses:
 *       200:
 *         description: Teacher requests fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/teacher-requests/{id}:
 *   patch:
 *     summary: Approve or reject teacher registration request
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher registration request ID
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - approved
 *                   - rejected
 *                 example: approved
 *               rejectionReason:
 *                 type: string
 *                 description: Required when status is rejected
 *                 example: Required qualification details are missing
 *     responses:
 *       200:
 *         description: Teacher registration request reviewed successfully
 *       400:
 *         description: Validation error or request has already been reviewed
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Teacher registration request not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Admin Management]
 *     description: Returns all teachers with optional active and blocked status filters.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter teachers by active status
 *         example: true
 *       - in: query
 *         name: isBlocked
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter teachers by blocked status
 *         example: false
 *     responses:
 *       200:
 *         description: Teachers fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/teachers/{id}/status:
 *   patch:
 *     summary: Block or unblock teacher
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isBlocked
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Teacher account status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Teacher account not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin Management]
 *     description: Returns all students with an optional blocked status filter.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isBlocked
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter students by blocked status
 *         example: false
 *     responses:
 *       200:
 *         description: Students fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/students/{id}/status:
 *   patch:
 *     summary: Block or unblock student
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isBlocked
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Student account status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Admin Management]
 *     description: Returns all courses with an optional approval status filter.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: approvalStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - approved
 *             - rejected
 *         description: Filter courses by approval status
 *         example: pending
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/courses/{id}:
 *   patch:
 *     summary: Approve or reject a course
 *     tags: [Admin Management]
 *     description: Only courses with pending approval status can be approved or rejected.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - approved
 *                   - rejected
 *                 example: approved
 *               rejectionReason:
 *                 type: string
 *                 description: Required when rejecting a course
 *                 example: Course content does not meet platform requirements
 *     responses:
 *       200:
 *         description: Course approval status updated successfully
 *       400:
 *         description: Validation error or course is not pending
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a category
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category ID
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */