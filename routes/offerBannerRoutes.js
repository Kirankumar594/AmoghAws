// routes/offerRoutes.js
import express from "express";
import multer from "multer";
import {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer
} from "../controllers/offerBannerController.js";

const router = express.Router();

// Multer middleware defined here itself (in-memory buffer for S3)
const storage = multer.memoryStorage();
const offerImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes
router.post("/", offerImageUpload.single("image"), createOffer);
router.get("/", getAllOffers);
router.get("/:id", getOfferById);
router.put("/:id", offerImageUpload.single("image"), updateOffer);
router.delete("/:id", deleteOffer);

export default router;
