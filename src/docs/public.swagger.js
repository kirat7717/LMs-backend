/**
 * @swagger
 * tags:
 *   - name: Public
 *     description: Public course and category catalogue APIs
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get Public Courses
 *     tags:
 *       - Public
 *     description: Browse approved and active courses. Supports search, category, pagination, and excludes protected lecture video URLs.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: node
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: backend-development
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       400:
 *         description: Invalid query
 *       404:
 *         description: Category not found or inactive
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get Public Course Detail
 *     tags:
 *       - Public
 *     description: Get an approved and active course detail for public browsing. Protected video URLs are not exposed.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f789012345
 *     responses:
 *       200:
 *         description: Course detail fetched successfully
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found or unavailable
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get Public Categories
 *     tags:
 *       - Public
 *     description: List active course categories for public course browsing.
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       500:
 *         description: Internal server error
 */
