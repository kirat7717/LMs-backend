import Category from "../models/category.model.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation.js";

// Create category
const createCategory = async (req, res) => {
  try {
    const { error, value } = createCategorySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, description } = value;

    const existingCategory = await Category.findOne({
      name: name.toLowerCase(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category: {
          id: category._id,
          name: category.name,
          description: category.description,
          isActive: category.isActive,
          createdAt: category.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Create category error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { error, value } = updateCategorySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check duplicate name
    if (value.name) {
      const existingCategory = await Category.findOne({
        name: value.name.toLowerCase(),
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }
    }

    Object.assign(category, value);

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category: {
          id: category._id,
          name: category.name,
          description: category.description,
          isActive: category.isActive,
          updatedAt: category.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Update category error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== DELETE CATEGORY ====================

const deleteCategory = async (req, res) => {
  try {
    // Find category
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete category
    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ==================== GET CATEGORIES ====================

const getCategories = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export { createCategory, getCategories, updateCategory, deleteCategory };
