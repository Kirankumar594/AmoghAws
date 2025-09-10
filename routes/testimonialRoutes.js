import express from "express";
import multer from "multer";
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();

// Multer memory storage (we'll push to S3 via utils)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createTestimonial);
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialById);
router.put("/:id", upload.single("image"), updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;
