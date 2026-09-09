import mongoose from "mongoose";

const teacherRequestSchema = new mongoose.Schema(
  {
    // ==================== BASIC INFORMATION ====================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // ==================== PROFESSIONAL INFORMATION ====================

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    specialization: {
      type: [String],
      required: true,
      default: [],
    },

    bio: {
      type: String,
      default: "",
    },

    // ==================== REQUEST STATUS ====================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ==================== ADMIN REVIEW ====================

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TeacherRequest = mongoose.model(
  "TeacherRequest",
  teacherRequestSchema
);

export default TeacherRequest;