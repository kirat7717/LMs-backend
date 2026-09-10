import Joi from "joi";

// Create category
const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 100 characters",
    "any.required": "Category name is required",
  }),

  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
});

// Update category
const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 100 characters",
  }),

  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be true or false",
  }),
}).min(1);

export {
  createCategorySchema,
  updateCategorySchema,
};