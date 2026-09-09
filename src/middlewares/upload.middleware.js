import multer from "multer";
import fs from "fs";
import path from "path";

// ==================== UPLOAD DIRECTORY ====================

// Define image upload destination
const uploadDirectory = path.join(process.cwd(), "public", "images");

// Create upload directory if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// ==================== MULTER STORAGE ====================

const storage = multer.diskStorage({
  // Set image destination folder
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  // Generate unique image filename
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, fileName);
  },
});

// ==================== FILE FILTER ====================

const fileFilter = (req, file, cb) => {
  // Get file extension from original filename
  const extension = path.extname(file.originalname).toLowerCase();

  // Allow only JPG, JPEG and PNG images
  const allowedExtensions = [".jpg", ".jpeg", ".png"];

  if (allowedExtensions.includes(extension)) {
    return cb(null, true);
  }

  // Reject unsupported file extensions
  cb(new Error("Only JPG, JPEG and PNG images are allowed"));
};

// ==================== MULTER CONFIGURATION ====================

const upload = multer({
  storage,
  fileFilter,

  // Allow maximum 5 MB per image
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;