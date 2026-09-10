  import mongoose from "mongoose";

  // Lecture Schema
  const lectureSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
      },

      thumbnail: {
        type: String,
        trim: true,
      },

      videoUrl: {
        type: String,
        trim: true,
      },

      duration: {
        type: Number,
        default: 0,
      },
    },
    {
      _id: true,
    }
  );

  // Section Schema
  const sectionSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
      },

      lectures: {
        type: [lectureSchema],
        default: [],
      },
    },
    {
      _id: true,
    }
  );

  // Course Schema
  const courseSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      thumbnail: {
        type: String,
        trim: true,
        default: "",
      },

      // Course must belong to a Category
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },

      // Teacher who created the course
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },

      price: {
        type: Number,
        default: 0,
      },

      sections: {
        type: [sectionSchema],
        default: [],
      },
      // Course active/inactive status
  isActive: {
    type: Boolean,
    default: true,
  },
      // Course approval state
      approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },

      rejectionReason: {
        type: String,
        trim: true,
        default: null,
      },

      approvedAt: {
        type: Date,
        default: null,
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  const Course = mongoose.model("Course", courseSchema);

  export default Course;