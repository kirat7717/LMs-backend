import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
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

    // ==================== ACCOUNT STATUS ====================
    isBlocked: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
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
  { timestamps: true }
);

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;