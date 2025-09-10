// routes/coreValueRoutes.js
import express from "express";
import multer from "multer";
import {
  createCoreValue,
  getAllCoreValues,
  getCoreValueById,
  updateCoreValue,
  deleteCoreValue,
} from "../controllers/coreValueController.js";

const router = express.Router();

// ✅ Multer memory storage (best for AWS S3)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extName = allowedTypes.test(file.originalname.toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  if (extName && mimeType) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

const coreValueImageUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

router.post("/", coreValueImageUpload.single("image"), createCoreValue);
router.get("/", getAllCoreValues);
router.get("/:id", getCoreValueById);
router.put("/:id", coreValueImageUpload.single("image"), updateCoreValue);
router.delete("/:id", deleteCoreValue);

export default router;
