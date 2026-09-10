import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
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

    isBlocked: {
      type: Boolean,
      default: false,
    },
    // Student account verification
isVerified: {
  type: Boolean,
  default: false,
},

verificationToken: {
  type: String,
  default: null,
},

verificationExpires: {
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
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;