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

confirmPassword: Joi.any()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),

  bio: Joi.string().trim().max(500).allow("").optional(),

  avatar: Joi.string().trim().allow("").optional(),
})

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