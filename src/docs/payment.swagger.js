/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Payments APIs
 */

/**
 * @swagger
 * /api/students/payments/create-checkout-session:
 *   post:
 *     summary: Create Checkout Session
 *     tags:
 *       - Payments
 *     description: Create a Stripe Checkout Session for a paid course.
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
 *     requestBody:
 *       required: true
 *       content:
 *         json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "{{courseId}}"
 *             required:
 *               - courseId
 */

/**
 * @swagger
 * /api/students/payments/webhook:
 *   post:
 *     summary: Stripe Webhook
 *     tags:
 *       - Payments
 *     description: Receive Stripe payment lifecycle webhook events.
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
 */
