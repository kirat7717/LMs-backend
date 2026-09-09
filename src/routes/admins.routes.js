import express from "express";

import {
  setAdminPassword,
  loginAdmin,
  updateAdminProfile,
} from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public Admin APIs
router.post("/set-password", setAdminPassword);
router.post("/login", loginAdmin);
// Update admin profile
router.put(
  "/profile",
  authMiddleware,
  adminMiddleware,
  updateAdminProfile
);
export default router;