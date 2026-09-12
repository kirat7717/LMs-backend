import express from "express";
import { getCategories } from "../controllers/category.controller.js";

const router = express.Router();

// Public: Get active categories
router.get("/", getCategories);

export default router;