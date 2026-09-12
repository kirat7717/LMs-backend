import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    avatar: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      default: null,
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

    // ==================== ADMIN ACCOUNT SETUP ====================
    adminSetupToken: {
      type: String,
      default: null,
    },

    adminSetupExpires: {
      type: Date,
      default: null,
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
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
