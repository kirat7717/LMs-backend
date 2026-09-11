import Joi from "joi";


export const studentRegisterSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),

  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .strip() // Validates match, then removes confirmPassword from validated output
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),

  bio: Joi.string().trim().max(500).allow("").optional(),

  avatar: Joi.string().trim().allow("").optional(),
});

export const studentResetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),

  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});

export const studentUpdateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),

  email: Joi.string().trim().lowercase().email().optional().messages({
    "string.email": "Please provide a valid email",
  }),

  bio: Joi.string().trim().max(500).allow("").optional(),

  avatar: Joi.string().trim().allow("").optional(),
}).min(1);

export const studentChangeEmailSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "New email is required",
    "string.email": "Please provide a valid email",
    "any.required": "New email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});
export const studentLoginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});


// ==================== STUDENT COURSE QUERY VALIDATION ====================

export const studentCourseQuerySchema = Joi.object({
  // Search course by title
  search: Joi.string().trim().max(100).optional(),

  // Search category by category name
  category: Joi.string().trim().max(100).lowercase().optional(),

  // Pagination
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(50).default(10),
});


// ==================== UPDATE COURSE PROGRESS ====================

export const updateCourseProgressSchema = Joi.object({
  // Embedded lecture ID
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

  // How much of the video has been watched
  watchedDuration: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Watched duration must be a number",
      "number.min": "Watched duration cannot be negative",
      "any.required": "Watched duration is required",
    }),

  // Current video position
  lastPosition: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Last position must be a number",
      "number.min": "Last position cannot be negative",
      "any.required": "Last position is required",
    }),

  // Student marks lecture as completed
  isCompleted: Joi.boolean()
    .default(false),
});