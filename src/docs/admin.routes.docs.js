/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin and Super Admin management APIs
 */

/**
 * @swagger
 * /api/admin/teacher-requests/{id}:
 *   patch:
 *     summary: Approve or reject a teacher registration request
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher registration request ID
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
 *                 example: Qualification requirements not met
 *     responses:
 *       200:
 *         description: Teacher registration request updated successfully
 *       400:
 *         description: Validation error or request already reviewed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Teacher registration request not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/teachers/{id}/status:
 *   patch:
 *     summary: Block or unblock a teacher
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
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
 *         description: Teacher status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/students/{id}/status:
 *   patch:
 *     summary: Block or unblock a student
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
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
 *         description: Student status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/profile:
 *   put:
 *     summary: Update Admin profile
 *     tags: [Admins]
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
 *                 example: Admin User
 *               bio:
 *                 type: string
 *                 example: LMS platform administrator
 *               avatar:
 *                 type: string
 *                 example: http://localhost:9000/images/avatar.png
 *     responses:
 *       200:
 *         description: Admin profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/admin/courses/{id}:
 *   patch:
 *     summary: Approve or reject a pending course
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
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
 *                 example: Course content needs improvement
 *     responses:
 *       200:
 *         description: Course approval status updated successfully
 *       400:
 *         description: Validation error or course is not pending
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     tags:
 *       - Admins
 *     summary: Get admin profile
 *     description: Returns the profile of the currently authenticated admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Access denied, admin access required, or account is blocked
 *       404:
 *         description: Admin account not found
 *       500:
 *         description: Internal server error
 */
