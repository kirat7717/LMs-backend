import Joi from "joi";

// ==================== CREATE ADMIN ====================

const createAdminSchema = Joi.object({
  // Admin name
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),

  // Admin email
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
});

// ==================== SET ADMIN PASSWORD ====================

const setAdminPasswordSchema = Joi.object({
  // Temporary setup token received through email
  token: Joi.string().required().messages({
    "string.empty": "Setup token is required",
    "any.required": "Setup token is required",
  }),

  // First password for the Admin account
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),

  // Confirm first password
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});

// ==================== ADMIN LOGIN ====================

const adminLoginSchema = Joi.object({
  // Admin email
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  // Admin password
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

// ==================== FORGOT PASSWORD ====================

const adminForgotPasswordSchema = Joi.object({
  // Admin email for password reset
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
});

// ==================== RESET PASSWORD ====================

const adminResetPasswordSchema = Joi.object({
  // Password reset token received through email
  token: Joi.string().required().messages({
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),

  // New Admin password
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),

  // Confirm new password
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});

// ==================== UPDATE PROFILE ====================

const adminUpdateProfileSchema = Joi.object({
  // Admin name
  name: Joi.string().trim().min(2).max(50),

  // Admin bio
  bio: Joi.string().trim().max(500).allow(""),

  // Admin avatar
  avatar: Joi.string().trim().allow(""),
}).min(1);


const updateTeacherRequestSchema = Joi.object({
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
    .allow("")
    .when("status", {
      is: "rejected",
      then: Joi.string().trim().min(1).required().messages({
        "string.empty": "Rejection reason is required",
        "any.required": "Rejection reason is required",
      }),
      otherwise: Joi.forbidden(),
    }),
});

// ==================== UPDATE TEACHER STATUS ====================

const updateUserBlockStatusSchema = Joi.object({
  isBlocked: Joi.boolean().required().messages({
    "boolean.base": "isBlocked must be true or false",
    "any.required": "isBlocked is required",
  }),
});

// Get teacher requests filter
const getTeacherRequestsSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional()
    .messages({
      "any.only": "Status must be pending, approved or rejected",
    }),
});

// Get teachers with optional active and blocked filters
const getTeachersSchema = Joi.object({
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be true or false",
  }),

  isBlocked: Joi.boolean().optional().messages({
    "boolean.base": "isBlocked must be true or false",
  }),
});
// Get students with optional blocked filter
const getStudentsSchema = Joi.object({
  isBlocked: Joi.boolean().optional().messages({
    "boolean.base": "isBlocked must be true or false",
  }),
});
// ==================== EXPORT VALIDATION SCHEMAS ====================

export {
  createAdminSchema,
  setAdminPasswordSchema,
  adminLoginSchema,
  adminForgotPasswordSchema,
  adminResetPasswordSchema,
  adminUpdateProfileSchema,
  updateTeacherRequestSchema,
  updateUserBlockStatusSchema,
  getTeacherRequestsSchema,
  getTeachersSchema,
  getStudentsSchema
};