/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: Image and video upload APIs
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload an image
 *     description: Upload an image file for use as an avatar, thumbnail, or other image resource.
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
 *                 description: Image file. Supported extensions are JPG, JPEG, and PNG. Maximum size is 5MB.
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid image file or image is missing
 *       413:
 *         description: Image file is too large
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections/{sectionId}/lectures/{lectureId}/video:
 *   post:
 *     tags:
 *       - Teacher
 *     summary: Upload lecture video
 *     description: Upload a video file for a specific lecture. Only the teacher who owns the course can upload the lecture video.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012345
 *
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Section MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012346
 *
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture MongoDB ObjectId
 *         example: 64f1a2b3c4d5e6f789012347
 *
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
 *                 description: Lecture video file. Supported extensions are MP4, WEBM, and MOV. Maximum size is 100MB.
 *
 *     responses:
 *       200:
 *         description: Lecture video uploaded successfully
 *       400:
 *         description: Video file is missing or invalid
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access denied or course ownership denied
 *       404:
 *         description: Course, section, or lecture not found
 *       413:
 *         description: Video file is too large
 *       500:
 *         description: Internal server error
 */