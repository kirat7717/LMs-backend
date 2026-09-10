import Joi from "joi";

// Create course validation
const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages({
    "string.empty": "Course title is required",
    "string.min": "Course title must be at least 3 characters",
    "string.max": "Course title cannot exceed 200 characters",
    "any.required": "Course title is required",
  }),

  description: Joi.string().trim().min(10).max(2000).required().messages({
    "string.empty": "Course description is required",
    "string.min": "Course description must be at least 10 characters",
    "string.max": "Course description cannot exceed 2000 characters",
    "any.required": "Course description is required",
  }),

  thumbnail: Joi.string().trim().allow("").optional(),

  categoryId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Category ID is required",
    "string.hex": "Invalid category ID",
    "string.length": "Invalid category ID",
    "any.required": "Category ID is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),

  sections: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().trim().min(2).max(200).required().messages({
          "string.empty": "Section title is required",
          "string.min": "Section title must be at least 2 characters",
          "string.max": "Section title cannot exceed 200 characters",
          "any.required": "Section title is required",
        }),

        lectures: Joi.array()
          .items(
            Joi.object({
              title: Joi.string().trim().min(2).max(200).required().messages({
                "string.empty": "Lecture title is required",
                "string.min": "Lecture title must be at least 2 characters",
                "string.max": "Lecture title cannot exceed 200 characters",
                "any.required": "Lecture title is required",
              }),

              // Lecture video thumbnail
              thumbnail: Joi.string().trim().required().messages({
                "string.empty": "Lecture thumbnail is required",
                "any.required": "Lecture thumbnail is required",
              }),

              videoUrl: Joi.string().trim().uri().required().messages({
                "string.uri": "Invalid video URL",
                "any.required": "Video URL is required",
              }),

              duration: Joi.number().min(0).optional().default(0),
            })
          )
          .optional()
          .default([]),
      })
    )
    .optional()
    .default([]),
});

// Update course validation
const updateCourseSchema = Joi.object({
  // Course title
  title: Joi.string().trim().min(3).max(200),

  // Course description
  description: Joi.string().trim().min(10).max(2000),

  // Course thumbnail
  thumbnail: Joi.string().trim().allow(""),

  // Course category
  categoryId: Joi.string().hex().length(24),

  // Course price
  price: Joi.number().min(0),

  // Teacher can activate/deactivate their own course
  isActive: Joi.boolean(),
}).min(1);
// Get courses filter validation
const getCoursesSchema = Joi.object({
  approvalStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional()
    .messages({
      "any.only":
        "Approval status must be pending, approved or rejected",
    }),
});

// Course approval/rejection validation
const updateCourseApprovalSchema = Joi.object({
  status: Joi.string()
    .valid("approved", "rejected")
    .required()
    .messages({
      "any.only": "Status must be approved or rejected",
      "any.required": "Status is required",
    }),

  rejectionReason: Joi.string()
    .trim()
    .max(500)
    .when("status", {
      is: "rejected",
      then: Joi.string().min(1).required().messages({
        "string.empty": "Rejection reason is required",
        "any.required": "Rejection reason is required",
      }),
      otherwise: Joi.forbidden(),
    }),
});
// ==================== COURSE QUERY VALIDATION ====================

const courseQuerySchema = Joi.object({
  // Search course by title
  search: Joi.string().trim().max(100).optional(),

  // Search category by category name
  category: Joi.string().trim().max(100).lowercase().optional(),

  // Pagination
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(50).default(10),
});
// Validate section creation
// Create section validation
// Create section validation
const createSectionSchema = Joi.object({
  // Section title
  title: Joi.string().trim().min(2).max(200).required(),

  // Optional lecture while creating section
  lecture: Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    thumbnail: Joi.string().trim().allow("").optional(),
    videoUrl: Joi.string().trim().uri().allow("").optional(),
    duration: Joi.number().min(0).optional(),
  }).optional(),
});
// Update section / lecture validation
// Update section validation
const updateSectionSchema = Joi.object({
  // Update section title
  title: Joi.string().trim().min(2).max(200).optional(),

  // Existing lecture ID - required when updating a lecture
  lectureId: Joi.string().hex().length(24).optional(),

  // Lecture data
  lecture: Joi.object({
    title: Joi.string().trim().min(2).max(200).optional(),
    thumbnail: Joi.string().trim().allow("").optional(),
    videoUrl: Joi.string().trim().uri().allow("").optional(),
    duration: Joi.number().min(0).optional(),
  }).optional(),
}).min(1);


export {
  // Create course validation
  createCourseSchema,
  updateCourseSchema,
  getCoursesSchema,
  updateCourseApprovalSchema,
  courseQuerySchema,
  updateSectionSchema,
  createSectionSchema
};
