/**
 * @swagger
 * /api/students/enroll/{courseId}:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 68a123456789abcdef123456
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *       400:
 *         description: Invalid course ID or validation error
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Access denied or course is not available
 *       404:
 *         description: Course not found
 *       409:
 *         description: Student is already enrolled
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/students/enrollments:
 *   get:
 *     summary: Get student's enrollments
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student enrollments fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Student access required or account blocked
 *       404:
 *         description: Student account not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/students/enrollments/{courseId}:
 *   get:
 *     summary: Get enrolled course details
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the enrolled course
 *         example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Enrolled course details fetched successfully
 *       400:
 *         description: Invalid course ID
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Student access required, account blocked, or student is not enrolled
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/students/courses/{courseId}/sections/{sectionId}/lectures/{lectureId}:
 *   get:
 *     summary: Get lecture details
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 68a123456789abcdef123456
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the section
 *         example: 68a123456789abcdef123457
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the lecture
 *         example: 68a123456789abcdef123458
 *     responses:
 *       200:
 *         description: Lecture details fetched successfully
 *       400:
 *         description: Invalid course, section, or lecture ID
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Student is not enrolled or does not have access
 *       404:
 *         description: Course, section, or lecture not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/students/courses/{courseId}/sections/{sectionId}/lectures/{lectureId}/video:
 *   get:
 *     summary: Get protected lecture video
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 68a123456789abcdef123456
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the section
 *         example: 68a123456789abcdef123457
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the lecture
 *         example: 68a123456789abcdef123458
 *     responses:
 *       200:
 *         description: Protected lecture video
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *           video/webm:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid course, section, or lecture ID
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Student is not enrolled or does not have access
 *       404:
 *         description: Course, section, or lecture not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/students/courses/{courseId}/progress:
 *   patch:
 *     summary: Update course lecture progress
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 68a123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lectureId
 *               - watchedDuration
 *               - lastPosition
 *               - isCompleted
 *             properties:
 *               lectureId:
 *                 type: string
 *                 description: MongoDB ID of the lecture
 *                 example: 68a123456789abcdef123458
 *               watchedDuration:
 *                 type: number
 *                 description: Total watched duration in seconds
 *                 example: 180
 *               lastPosition:
 *                 type: number
 *                 description: Last playback position in seconds
 *                 example: 175
 *               isCompleted:
 *                 type: boolean
 *                 description: Whether the lecture is completed
 *                 example: false
 *     responses:
 *       200:
 *         description: Course progress updated successfully
 *       400:
 *         description: Validation error or invalid lecture ID
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Student is not enrolled or does not have access
 *       404:
 *         description: Course or lecture not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/students/courses/{courseId}/progress:
 *   get:
 *     summary: Get course progress
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the enrolled course
 *         example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Course progress fetched successfully
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
 *                   example: Course progress fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: string
 *                       example: 68a123456789abcdef123456
 *                     totalLectures:
 *                       type: integer
 *                       example: 12
 *                     completedLectures:
 *                       type: integer
 *                       example: 7
 *                     progress:
 *                       type: integer
 *                       example: 58
 *                     status:
 *                       type: string
 *                       enum:
 *                         - active
 *                         - completed
 *                         - cancelled
 *                       example: active
 *                     lectureProgress:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           lectureId:
 *                             type: string
 *                             example: 68a123456789abcdef123458
 *                           title:
 *                             type: string
 *                             example: Introduction to Node.js
 *                           duration:
 *                             type: number
 *                             example: 300
 *                           watchedDuration:
 *                             type: number
 *                             example: 180
 *                           lastPosition:
 *                             type: number
 *                             example: 175
 *                           isCompleted:
 *                             type: boolean
 *                             example: false
 *       400:
 *         description: Invalid course ID
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Student is not enrolled in this course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/students/dashboard:
 *   get:
 *     summary: Get student dashboard
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student dashboard fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Student access required or account blocked
 *       404:
 *         description: Student account not found
 *       500:
 *         description: Internal server error
 */