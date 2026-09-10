import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // Student who enrolled in the course
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Course in which the student is enrolled
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Payment associated with this enrollment
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    // Current enrollment status
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    // Overall course progress percentage
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Progress of each lecture
    lectureProgress: {
      type: [
        {
          // Embedded lecture ID from Course.sections[].lectures[]
          lecture: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },

          // Total video duration watched by the student
          watchedDuration: {
            type: Number,
            default: 0,
            min: 0,
          },

          // Last position where the student stopped watching
          lastPosition: {
            type: Number,
            default: 0,
            min: 0,
          },

          // Whether the student completed this lecture
          isCompleted: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },

    // Enrollment date
    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    // Course completion date
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// A student can enroll in the same course only once
enrollmentSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;