import express from "express";

import morgan from "morgan";

import cors from "cors";

import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";

import studentRoutes from "./routes/student.routes.js";

import teacherRoutes from "./routes/teacher.routes.js";

import uploadRoutes from "./routes/upload.routes.js";

import adminRoutes from "./routes/admin.routes.js";

import adminManagementRoutes from "./routes/adminManagement.routes.js";

import superAdminRoutes from "./routes/superAdmin.routes.js";

import courseRoutes from "./routes/course.routes.js";

import paymentRoutes from "./routes/payment.routes.js";
import categoryRoutes from "./routes/category.routes.js";

import { handleStripeWebhook } from "./controllers/payment.controller.js";

const app = express();

// ==================== GLOBAL MIDDLEWARE ====================

app.use(cors({ origin: "*" }));

// ==================== STRIPE WEBHOOK ====================

app.post(
  "/api/students/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());

app.use(morgan("dev"));

// ==================== STATIC FILES ====================

// Serve uploaded images
app.use("/images", express.static("public/images"));

// ==================== SWAGGER ====================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== STUDENT ROUTES ====================

app.use("/api/students", studentRoutes);

// ==================== TEACHER ROUTES ====================

app.use("/api/teachers", teacherRoutes);

// ==================== UPLOAD ROUTES ====================

app.use("/api/upload", uploadRoutes);

// ==================== ADMIN ROUTES ====================

// Admin authentication & profile
app.use("/api/admin", adminRoutes);

// Admin management
app.use("/api/admin", adminManagementRoutes);

// ==================== SUPER ADMIN ROUTES ====================

app.use("/api/super-admin", superAdminRoutes);

// ==================== COURSE ROUTES ====================

// Public courses + course management
app.use("/api/courses", courseRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/students/payments", paymentRoutes);

// ==================== GLOBAL ERROR HANDLER ====================

// Handle unhandled application errors
app.use((error, req, res, next) => {
  console.error("Global error:", error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;
