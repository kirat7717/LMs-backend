import Stripe from "stripe";

import Course from "../models/course.model.js";
import Payment from "../models/payment.model.js";
import Enrollment from "../models/enrollment.model.js";
import 'dotenv/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==================== CREATE STRIPE CHECKOUT ====================

const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check course
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

    // Only paid courses use Stripe
    if (course.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "This is a free course. Please enroll directly",
      });
    }

    // Check existing enrollment
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

    // Create pending payment record
    const payment = await Payment.create({
      student: req.student._id,
      course: course._id,
      amount: course.price,
      currency: "inr",
      status: "pending",
    });

    // Create Stripe Checkout Session
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

    // Store Stripe session ID
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
    console.error("Create checkout session error:", error.message);

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
    // Verify that webhook request actually came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook signature error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // Handle successful Checkout payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const {
        paymentId,
        studentId,
        courseId,
      } = session.metadata;

      // Find our pending payment
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment record not found",
        });
      }

      // Prevent duplicate processing
      if (payment.status === "paid") {
        return res.status(200).json({
          success: true,
          message: "Payment already processed",
        });
      }

      // Update payment
      payment.status = "paid";
      payment.paidAt = new Date();
      payment.stripePaymentIntentId = session.payment_intent;

      await payment.save();

      // Check whether enrollment already exists
      const existingEnrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });

      // Create enrollment only once
      if (!existingEnrollment) {
        await Enrollment.create({
          student: studentId,
          course: courseId,
          payment: payment._id,
          status: "active",
          progress: 0,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

export {
  createCheckoutSession,
  handleStripeWebhook,
};

