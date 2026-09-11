import Stripe from "stripe";

import Course from "../models/course.model.js";
import Payment from "../models/payment.model.js";
import Enrollment from "../models/enrollment.model.js";
import Student from "../models/student.model.js";

import {
  sendCourseEnrollmentSuccessEmail,
} from "../services/emails/studentEmail.service.js";

import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==================== CREATE STRIPE CHECKOUT ====================

const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;

    // ==================== CHECK COURSE ====================

    const course = await Course.findOne({
      _id: courseId,
      approvalStatus: "approved",
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not available",
      });
    }

    // ==================== ONLY PAID COURSES USE STRIPE ====================

    if (course.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "This is a free course. Please enroll directly",
      });
    }

    // ==================== CHECK EXISTING ENROLLMENT ====================

    const existingEnrollment = await Enrollment.findOne({
      student: req.student._id,
      course: course._id,
      status: { $in: ["active", "completed"] },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // ==================== CHECK PENDING PAYMENT ====================

    const existingPendingPayment = await Payment.findOne({
      student: req.student._id,
      course: course._id,
      status: "pending",
    });

    if (existingPendingPayment) {
      return res.status(409).json({
        success: false,
        message: "A payment for this course is already in progress",
        data: {
          paymentId: existingPendingPayment._id,
        },
      });
    }

    // ==================== CREATE PENDING PAYMENT ====================

    const payment = await Payment.create({
      student: req.student._id,
      course: course._id,
      amount: course.price,
      currency: "inr",
      status: "pending",
    });

    // ==================== CREATE STRIPE CHECKOUT SESSION ====================

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],

      customer_email: req.student.email,

      metadata: {
        paymentId: payment._id.toString(),
        studentId: req.student._id.toString(),
        courseId: course._id.toString(),
      },

      success_url: `${process.env.BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/payment/cancelled`,
    });

    // ==================== STORE STRIPE SESSION ID ====================

    payment.stripeCheckoutSessionId = session.id;

    await payment.save();

    return res.status(201).json({
      success: true,
      message: "Checkout session created successfully",
      data: {
        checkoutUrl: session.url,
      },
    });
  } catch (error) {
    console.error(
      "Create checkout session error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

// ==================== STRIPE WEBHOOK ====================

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    // Verify that the webhook request actually came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature error:",
      error.message
    );

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  try {
    // We only handle successful Checkout Session events
    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({
        success: true,
        message: "Event received but not handled",
      });
    }

    const session = event.data.object;

    // ==================== GET STRIPE METADATA ====================

    const {
      paymentId,
      studentId,
      courseId,
    } = session.metadata || {};

    // Make sure required metadata exists
    if (!paymentId || !studentId || !courseId) {
      console.error("Missing required Stripe metadata");

      return res.status(400).json({
        success: false,
        message: "Required payment metadata is missing",
      });
    }

    // ==================== CHECK PAYMENT STATUS ====================

    // Make sure Stripe confirms that the payment is actually paid
    if (session.payment_status !== "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment is not completed yet",
      });
    }

    // ==================== FETCH DATABASE RECORDS ====================

    const [payment, student, course] = await Promise.all([
      Payment.findById(paymentId),
      Student.findById(studentId).select("name email"),
      Course.findOne({
        _id: courseId,
        approvalStatus: "approved",
        isActive: true,
      }),
    ]);

    // ==================== CHECK PAYMENT ====================

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // ==================== VERIFY PAYMENT OWNER ====================

    // Stripe student ID must match our local payment record
    if (
      payment.student.toString() !==
      studentId.toString()
    ) {
      console.error(
        "Stripe student metadata does not match payment record"
      );

      return res.status(400).json({
        success: false,
        message:
          "Payment student does not match payment record",
      });
    }

    // ==================== VERIFY PAYMENT COURSE ====================

    // Stripe course ID must match our local payment record
    if (
      payment.course.toString() !==
      courseId.toString()
    ) {
      console.error(
        "Stripe course metadata does not match payment record"
      );

      return res.status(400).json({
        success: false,
        message:
          "Payment course does not match payment record",
      });
    }

    // ==================== VERIFY STRIPE SESSION ====================

    // Stored Stripe Checkout Session ID must match
    // the session that triggered this webhook
    if (
      payment.stripeCheckoutSessionId !== session.id
    ) {
      console.error(
        "Stripe checkout session does not match payment record"
      );

      return res.status(400).json({
        success: false,
        message: "Invalid payment session",
      });
    }

    // ==================== CHECK STUDENT ====================

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==================== CHECK COURSE ====================

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not available",
      });
    }

    // ==================== PREVENT DUPLICATE WEBHOOK ====================

    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
      });
    }

    // ==================== CHECK EXISTING ENROLLMENT ====================

    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    // Create enrollment only if it does not already exist
    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        payment: payment._id,
        status: "active",
        progress: 0,
      });
    }

    // ==================== MARK PAYMENT AS PAID ====================

    payment.status = "paid";
    payment.paidAt = new Date();
    payment.stripePaymentIntentId =
      session.payment_intent || null;

    await payment.save();

    // ==================== SEND ENROLLMENT EMAIL ====================

    // Send email after payment + enrollment are confirmed
    await sendCourseEnrollmentSuccessEmail(
      student,
      course,
      payment
    );

    return res.status(200).json({
      success: true,
      message:
        "Payment processed and course enrollment completed",
      data: {
        paymentId: payment._id,
        enrollmentId: enrollment._id,
        courseId: course._id,
      },
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

// ==================== EXPORTS ====================

export {
  createCheckoutSession,
  handleStripeWebhook,
};