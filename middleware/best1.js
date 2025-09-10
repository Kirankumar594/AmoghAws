// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Leader upload folder
const leaderPath = "uploads/leaders";
fs.mkdirSync(leaderPath, { recursive: true });

const leaderStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, leaderPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowed.test(file.mimetype);
  extValid && mimeValid ? cb(null, true) : cb(new Error("Only image files are allowed"));
};

export const leaderImageUpload = multer({
  storage: leaderStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
