import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

// Upload single image
router.post("/image", upload.single("image"), uploadImage);


export default router;