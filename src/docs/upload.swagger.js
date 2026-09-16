/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: Image upload APIs
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload Image
 *     tags:
 *       - Upload
 *     description: Public image upload for profile avatars and course/lecture thumbnails. Current limit is 5 MB and validation is filename-extension based.
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
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Missing/invalid image or file too large
 *       500:
 *         description: Internal server error
 */
