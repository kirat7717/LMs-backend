/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Category management APIs accessible by Admin and Super Admin
 */

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a new category (Admin & Super Admin)
 *     tags:
 *       - Categories
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
 *                 example: Backend Development
 *               description:
 *                 type: string
 *                 example: Courses related to backend development
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
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   patch:
 *     summary: Update category (Admin & Super Admin)
 *     tags:
 *       - Categories
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Advanced Backend Development
 *               description:
 *                 type: string
 *                 example: Advanced backend development courses
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Super Admin access required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Server error
 */