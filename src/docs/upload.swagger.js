/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: Image and lecture video upload APIs
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload Image
 *     tags:
 *       - Upload
 *     description: Upload an image file.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 */

/**
 * @swagger
 * /teachers/{courseId}/sections/{sectionId}/lectures/{lectureId}/video:
 *   post:
 *     summary: Upload Lecture Video
 *     tags:
 *       - Upload
 *     description: Upload a lecture video for an owned course lecture.
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
 *     parameters:
 *       - in: "path"
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: courseId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *       - in: "path"
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: sectionId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *       - in: "path"
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: lectureId MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 */
