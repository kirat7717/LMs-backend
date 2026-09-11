/**
 * @swagger
 * tags:
 *   - name: Category Management
 *     description: Category management APIs for Admin and Super Admin
 */

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     tags:
 *       - Category Management
 *     summary: Create a category
 *     description: Create a new course category. Accessible by Admin and Super Admin.
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Web Development
 *               description:
 *                 type: string
 *                 example: Courses related to web development
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Super Admin access required
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     tags:
 *       - Category Management
 *     summary: Get all categories
 *     description: Fetch all categories sorted by newest first. Accessible by Admin and Super Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Super Admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   patch:
 *     tags:
 *       - Category Management
 *     summary: Update a category
 *     description: Update category details. Accessible by Admin and Super Admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Backend Development
 *               description:
 *                 type: string
 *                 example: Courses related to backend development
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error or invalid category ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     tags:
 *       - Category Management
 *     summary: Delete a category
 *     description: Delete a category permanently. Accessible by Admin and Super Admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */