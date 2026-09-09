import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminsRoutes from "./routes/admins.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use(
  "/images",
  express.static(path.join(process.cwd(), "public", "images"))
);
// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
// Upload APIs
app.use("/api/upload", uploadRoutes);
// Shared Admin APIs
app.use("/api/admin", adminRoutes);

// Admin account APIs
app.use("/api/admins", adminsRoutes);

export default app;