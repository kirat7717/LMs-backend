import Joi from "joi";

// ==================== CREATE COURSE VALIDATION ====================

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

  // ==================== SECTIONS ====================

  sections: Joi.array()
    .min(1)
    .required()
    .items(
      Joi.object({
        title: Joi.string().trim().min(2).max(200).required().messages({
          "string.empty": "Section title is required",
          "string.min": "Section title must be at least 2 characters",
          "string.max": "Section title cannot exceed 200 characters",
          "any.required": "Section title is required",
        }),

        // ==================== LECTURES ====================

        lectures: Joi.array()
          .min(1)
          .required()
          .items(
            Joi.object({
              title: Joi.string().trim().min(2).max(200).required().messages({
                "string.empty": "Lecture title is required",
                "string.min": "Lecture title must be at least 2 characters",
                "string.max": "Lecture title cannot exceed 200 characters",
                "any.required": "Lecture title is required",
              }),

              // Lecture thumbnail is required
              thumbnail: Joi.string().trim().required().messages({
                "string.empty": "Lecture thumbnail is required",
                "any.required": "Lecture thumbnail is required",
              }),

              // Video is uploaded separately
              // Therefore videoUrl can initially be empty
              videoUrl: Joi.string().trim().uri().allow("").optional().messages({
                "string.uri": "Invalid video URL",
              }),

              // Duration can be updated/filled later
              duration: Joi.number().min(0).optional().default(0),
            })
          )
          .messages({
            "array.min": "At least one lecture is required in each section",
            "any.required": "Lectures are required in each section",
          }),
      })
    )
    .messages({
      "array.min": "At least one section is required",
      "any.required": "At least one section is required",
    }),
});

// ==================== UPDATE COURSE VALIDATION ====================

const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200),

  description: Joi.string().trim().min(10).max(2000),

  thumbnail: Joi.string().trim().allow(""),

  categoryId: Joi.string().hex().length(24),

  price: Joi.number().min(0),

  isActive: Joi.boolean(),
}).min(1);

// ==================== GET COURSES FILTER VALIDATION ====================

const getCoursesSchema = Joi.object({
  approvalStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional()
    .messages({
      "any.only":
        "Approval status must be pending, approved or rejected",
    }),
});

// ==================== COURSE APPROVAL / REJECTION ====================

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
  search: Joi.string().trim().max(100).optional(),

  category: Joi.string().trim().max(100).lowercase().optional(),

  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(50).default(10),
});

// ==================== CREATE SECTION VALIDATION ====================

const createSectionSchema = Joi.object({
  // Section title
  title: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Section title is required",
    "string.min": "Section title must be at least 2 characters",
    "string.max": "Section title cannot exceed 200 characters",
    "any.required": "Section title is required",
  }),

  // At least one lecture is required
  lecture: Joi.object({
    // Lecture title
    title: Joi.string().trim().min(2).max(200).required().messages({
      "string.empty": "Lecture title is required",
      "string.min": "Lecture title must be at least 2 characters",
      "string.max": "Lecture title cannot exceed 200 characters",
      "any.required": "Lecture title is required",
    }),

    // Lecture thumbnail is optional
    thumbnail: Joi.string().trim().allow("").optional(),

    // Video is uploaded separately
    // It can initially be empty
    videoUrl: Joi.string().trim().uri().allow("").optional().messages({
      "string.uri": "Invalid video URL",
    }),

    // Duration is optional
    duration: Joi.number().min(0).optional().default(0),
  })
    .required()
    .messages({
      "any.required": "At least one lecture is required",
    }),
});

// ==================== UPDATE SECTION / LECTURE ====================

const updateSectionSchema = Joi.object({
  // Update section title
  title: Joi.string().trim().min(2).max(200).optional(),

  // Existing lecture ID
  lectureId: Joi.string().hex().length(24).optional(),

  // Lecture data
  lecture: Joi.object({
    title: Joi.string().trim().min(2).max(200).optional(),

    thumbnail: Joi.string().trim().allow("").optional(),

    // Video URL can be updated separately through upload API
    videoUrl: Joi.string().trim().uri().allow("").optional(),

    duration: Joi.number().min(0).optional(),
  }).optional(),
}).min(1);

// ==================== UPDATE COURSE PROGRESS ====================

const updateCourseProgressSchema = Joi.object({
  lectureId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "Lecture ID is required",
      "string.hex": "Invalid lecture ID",
      "string.length": "Invalid lecture ID",
      "any.required": "Lecture ID is required",
    }),

  watchedDuration: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Watched duration must be a number",
      "number.min": "Watched duration cannot be negative",
      "any.required": "Watched duration is required",
    }),

  lastPosition: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Last position must be a number",
      "number.min": "Last position cannot be negative",
      "any.required": "Last position is required",
    }),

  isCompleted: Joi.boolean().default(false),
});

export {
  createCourseSchema,
  updateCourseSchema,
  getCoursesSchema,
  updateCourseApprovalSchema,
  courseQuerySchema,
  updateSectionSchema,
  createSectionSchema,
  updateCourseProgressSchema,
};