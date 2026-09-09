import Joi from "joi";

// ==================== SUPER ADMIN LOGIN ====================

const superAdminLoginSchema = Joi.object({
  // Super Admin email
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  // Super Admin password
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

// ==================== FORGOT PASSWORD ====================

const superAdminForgotPasswordSchema = Joi.object({
  // Super Admin email for password reset
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
});

// ==================== RESET PASSWORD ====================

const superAdminResetPasswordSchema = Joi.object({
  // Password reset token received through email
  token: Joi.string().required().messages({
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),

  // New Super Admin password
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

const superAdminUpdateProfileSchema = Joi.object({
  // Super Admin name
  name: Joi.string().trim().min(2).max(50),

  // Super Admin bio
  bio: Joi.string().trim().max(500).allow(""),

  // Super Admin avatar
  avatar: Joi.string().trim().allow(""),
}).min(1);

// ==================== EXPORT VALIDATION SCHEMAS ====================

export {
  superAdminLoginSchema,
  superAdminForgotPasswordSchema,
  superAdminResetPasswordSchema,
  superAdminUpdateProfileSchema,
};