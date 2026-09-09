import Joi from "joi";

const teacherRegisterSchema = Joi.object({
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
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),

  phone: Joi.string().trim().required().messages({
    "string.empty": "Phone is required",
    "any.required": "Phone is required",
  }),

  qualification: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Qualification is required",
    "string.min": "Qualification must be at least 2 characters",
    "string.max": "Qualification cannot exceed 100 characters",
    "any.required": "Qualification is required",
  }),

  experience: Joi.number().integer().min(0).required().messages({
    "number.base": "Experience must be a number",
    "number.integer": "Experience must be a whole number",
    "number.min": "Experience cannot be negative",
    "any.required": "Experience is required",
  }),

  specialization: Joi.array()
    .items(Joi.string().trim().min(2))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one specialization is required",
      "any.required": "Specialization is required",
    }),

  bio: Joi.string().trim().max(500).allow("").optional(),
});


const teacherLoginSchema = Joi.object({
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


const teacherResetPasswordSchema = Joi.object({
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


const teacherUpdateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  bio: Joi.string().trim().max(500).allow(""),
  avatar: Joi.string().trim().allow(""),
  phone: Joi.string().trim(),
  qualification: Joi.string().trim().min(2).max(100),
  experience: Joi.number().integer().min(0),
  specialization: Joi.array().items(Joi.string().trim().min(2)),

  // Teacher can activate or deactivate own account
  isActive: Joi.boolean(),
}).min(1);


export {
  teacherRegisterSchema,
  teacherLoginSchema,
  teacherResetPasswordSchema,
  teacherUpdateProfileSchema,
};