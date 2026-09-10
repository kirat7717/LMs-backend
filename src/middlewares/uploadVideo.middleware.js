    import multer from "multer";
import fs from "fs";
import path from "path";

// ==================== VIDEO UPLOAD DIRECTORY ====================

// Define video upload destination
const uploadDirectory = path.join(process.cwd(), "public", "videos");

// Create video upload directory if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// ==================== MULTER STORAGE ====================

const storage = multer.diskStorage({
  // Store videos inside public/videos
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  // Generate unique video filename
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, fileName);
  },
});

// ==================== VIDEO FILE FILTER ====================

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  // Allow common video formats
  const allowedExtensions = [".mp4", ".webm", ".mov"];

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error("Only MP4, WEBM and MOV video files are allowed")
    );
  }

  // Ensure uploaded file is actually a video
  if (!file.mimetype.startsWith("video/")) {
    return cb(new Error("Only video files are allowed"));
  }

  cb(null, true);
};

// ==================== MULTER VIDEO CONFIGURATION ====================

const uploadVideo = multer({
  storage,
  fileFilter,

  // Allow maximum 100 MB per video
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export default uploadVideo;