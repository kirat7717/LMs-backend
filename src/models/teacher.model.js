import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    // ==================== PROFESSIONAL INFORMATION ====================

    qualification: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
    },

    specialization: {
      type: [String],
      default: [],
    },

    // ==================== ACCOUNT STATUS ====================

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

   

    // ==================== APPROVAL ====================

    approvalStatus: {
      type: String,
      enum: ["approved"],
      default: "approved",
    },

    teacherRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherRequest",
      required: true,
      unique: true,
    },

    approvedAt: {
      type: Date,
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },


    // ==================== PASSWORD RESET ====================

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;