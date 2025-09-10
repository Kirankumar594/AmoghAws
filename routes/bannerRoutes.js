// routes/bannerRoutes.js
import express from "express";
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import { uploadBannerImage } from "../middleware/upload.js";

const router = express.Router();

router.post("/", uploadBannerImage, createBanner);
router.get("/", getAllBanners);
router.get("/:id", getBannerById);
router.put("/:id", uploadBannerImage, updateBanner);
router.delete("/:id", deleteBanner);

export default router;
