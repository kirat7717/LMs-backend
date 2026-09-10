import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // Student who is making the payment
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Course being purchased
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Amount paid for the course
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Currency used for the payment
    currency: {
      type: String,
      default: "inr",
      lowercase: true,
      trim: true,
    },

    // Stripe Checkout Session ID
    stripeCheckoutSessionId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    // Stripe Payment Intent ID
    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    // Payment status
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    // Date when payment was successfully completed
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;