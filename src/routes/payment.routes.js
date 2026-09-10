import express from "express";

import {
  createCheckoutSession,
 
} from "../controllers/payment.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import studentMiddleware from "../middlewares/student.middleware.js";

const router = express.Router();

// ==================== CREATE CHECKOUT SESSION ====================

router.post(
  "/create-checkout",
  authMiddleware,
  studentMiddleware,
  createCheckoutSession
);
// ==================== STRIPE WEBHOOK ====================




export default router;