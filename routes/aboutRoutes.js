// routes/aboutRoutes.js
import express from "express";
import {
  createAbout,
  getAbout,
  getAboutById,
  updateAbout,
  deleteAbout
} from "../controllers/aboutController.js";

const router = express.Router();

router.post("/", createAbout);
router.get("/", getAbout);
router.get("/:id", getAboutById);
router.put("/:id", updateAbout);
router.delete("/:id", deleteAbout);

export default router;
