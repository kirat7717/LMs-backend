/**
 * @swagger
 * tags:
 *   - name: Teachers
 *     description: Teacher authentication, profile, dashboard and course management APIs
 */

/**
 * @swagger
 * /api/teachers/register:
 *   post:
 *     summary: Submit teacher registration request
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *               - phone
 *               - qualification
 *               - experience
 *               - specialization
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amit Kumar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: amit@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               qualification:
 *                 type: string
 *                 example: B.Tech Computer Science
 *               experience:
 *                 type: number
 *                 example: 5
 *               specialization:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Node.js
 *                   - MongoDB
 *               bio:
 *                 type: string
 *                 example: Backend developer and instructor
 *     responses:
 *       201:
 *         description: Teacher registration request submitted successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Teacher or pending request already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/login:
 *   post:
 *     summary: Login teacher
 *     tags: [Teachers]
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
 *                 example: amit@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Teacher logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Teacher account is inactive or blocked
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/forgot-password:
 *   post:
 *     summary: Request teacher password reset
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: amit@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/reset-password:
 *   post:
 *     summary: Reset teacher password
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: reset-token-here
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/profile:
 *   get:
 *     summary: Get teacher profile
 *     tags: [Teachers]
 *     description: Returns the profile of the currently authenticated teacher.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher profile fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Teacher access required, account inactive, or account blocked
 *       404:
 *         description: Teacher account not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/teachers/profile:
 *   patch:
 *     summary: Update teacher profile
 *     tags: [Teachers]
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
 *                 example: Amit Kumar
 *               bio:
 *                 type: string
 *                 example: Backend instructor
 *               avatar:
 *                 type: string
 *                 example: http://localhost:9000/images/avatar.png
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               qualification:
 *                 type: string
 *                 example: B.Tech Computer Science
 *               experience:
 *                 type: number
 *                 example: 6
 *               specialization:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Node.js
 *                   - Express
 *     responses:
 *       200:
 *         description: Teacher profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access required, account inactive, or account blocked
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/teachers/logout:
 *   post:
 *     summary: Logout teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher logged out successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Teacher access required, account inactive, or account blocked
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/dashboard:
 *   get:
 *     summary: Get teacher dashboard
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher dashboard fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Teacher access required, account inactive, or account blocked
 *       404:
 *         description: Teacher account not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get available courses
 *     tags: [Teachers]
 *     description: Returns approved and active courses. Supports search, category filtering and pagination.
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search courses by title
 *         example: Node.js
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter courses by category name
 *         example: Backend Development
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       404:
 *         description: Category not found or inactive
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/courses:
 *   get:
 *     summary: Get teacher's courses
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher courses fetched successfully
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Teacher access required, account inactive, or account blocked
 *       404:
 *         description: Teacher account not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/courses/{id}:
 *   get:
 *     summary: Get teacher course details
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Course details fetched successfully
 *       400:
 *         description: Invalid course ID
 *       401:
 *         description: Authentication token is missing or invalid
 *       403:
 *         description: Teacher access required or course does not belong to teacher
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Create a new course
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - categoryId
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Node.js Backend Development
 *               description:
 *                 type: string
 *                 example: Learn Node.js and Express backend development.
 *               thumbnail:
 *                 type: string
 *                 example: http://localhost:9000/images/course-thumbnail.jpg
 *               categoryId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               price:
 *                 type: number
 *                 example: 499
 *               sections:
 *                 type: array
 *                 description: Optional initial course sections
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Express Basics
 *                     lectures:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: Introduction to Express
 *                           thumbnail:
 *                             type: string
 *                             example: http://localhost:9000/images/lecture-thumbnail.jpg
 *                           videoUrl:
 *                             type: string
 *                             example: http://localhost:9000/videos/lecture.mp4
 *                           duration:
 *                             type: number
 *                             example: 900
 *     responses:
 *       201:
 *         description: Course created successfully and is pending approval
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access required, account inactive, or account blocked
 *       404:
 *         description: Category not found or inactive
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/{id}:
 *   patch:
 *     summary: Update own course
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 example: Advanced Node.js Backend
 *               description:
 *                 type: string
 *                 example: Advanced Node.js and Express backend development.
 *               thumbnail:
 *                 type: string
 *                 example: http://localhost:9000/images/new-course-thumbnail.jpg
 *               categoryId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               price:
 *                 type: number
 *                 example: 599
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Advanced Express
 *                     lectures:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: Middleware Deep Dive
 *                           thumbnail:
 *                             type: string
 *                             example: http://localhost:9000/images/lecture-thumbnail.jpg
 *                           videoUrl:
 *                             type: string
 *                             example: http://localhost:9000/videos/video.mp4
 *                           duration:
 *                             type: number
 *                             example: 1200
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher can only update own course
 *       404:
 *         description: Course or active category not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections:
 *   post:
 *     summary: Add section to own course
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Express.js Fundamentals
 *               lecture:
 *                 type: object
 *                 description: Optional lecture to add with the section
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: Introduction to Express
 *                   thumbnail:
 *                     type: string
 *                     example: http://localhost:9000/images/lecture-thumbnail.jpg
 *                   videoUrl:
 *                     type: string
 *                     example: http://localhost:9000/videos/lecture.mp4
 *                   duration:
 *                     type: number
 *                     example: 900
 *     responses:
 *       201:
 *         description: Section or section with lecture added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access required or course does not belong to teacher
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections/{sectionId}:
 *   patch:
 *     summary: Update course section or lecture
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 64f123456789abcdef123456
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the section
 *         example: 64f123456789abcdef123457
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Advanced Express.js
 *               lectureId:
 *                 type: string
 *                 description: Lecture ID when updating an existing lecture
 *                 example: 64f123456789abcdef123458
 *               lecture:
 *                 type: object
 *                 description: Lecture data for adding or updating a lecture
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: Express Middleware
 *                   thumbnail:
 *                     type: string
 *                     example: http://localhost:9000/images/lecture-thumbnail.jpg
 *                   videoUrl:
 *                     type: string
 *                     example: http://localhost:9000/videos/lecture.mp4
 *                   duration:
 *                     type: number
 *                     example: 1200
 *     responses:
 *       200:
 *         description: Section updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access required or course does not belong to teacher
 *       404:
 *         description: Course or section not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections/{sectionId}:
 *   delete:
 *     summary: Delete course section
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 64f123456789abcdef123456
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the section
 *         example: 64f123456789abcdef123457
 *     responses:
 *       200:
 *         description: Section and all its lectures deleted successfully
 *       400:
 *         description: Invalid course or section ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access required or course does not belong to teacher
 *       404:
 *         description: Course or section not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections/{sectionId}/lectures/{lectureId}:
 *   delete:
 *     summary: Delete lecture
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f123456789abcdef123456
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f123456789abcdef123457
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f123456789abcdef123458
 *     responses:
 *       200:
 *         description: Lecture deleted successfully
 *       400:
 *         description: Invalid course, section, or lecture ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access required or course does not belong to teacher
 *       404:
 *         description: Course, section, or lecture not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/teachers/{courseId}/sections/{sectionId}/lectures/{lectureId}/video:
 *   post:
 *     summary: Upload lecture video
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the course
 *         example: 64f123456789abcdef123456
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the section
 *         example: 64f123456789abcdef123457
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the lecture
 *         example: 64f123456789abcdef123458
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
 *                 description: Lecture video file
 *     responses:
 *       200:
 *         description: Lecture video uploaded successfully
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
 *                   example: Lecture video uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     videoUrl:
 *                       type: string
 *                       example: http://localhost:9000/videos/lecture.mp4
 *                     courseId:
 *                       type: string
 *                       example: 64f123456789abcdef123456
 *                     sectionId:
 *                       type: string
 *                       example: 64f123456789abcdef123457
 *                     lectureId:
 *                       type: string
 *                       example: 64f123456789abcdef123458
 *       400:
 *         description: Video is required or video validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher access required or teacher does not own the course
 *       404:
 *         description: Course, section, or lecture not found
 *       500:
 *         description: Internal server error
 */