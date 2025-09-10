// routes/missionRoutes.js
import express from "express";
import multer from "multer";
import {
  createMission,
  getAllMissions,
  getMissionById,
  updateMission,
  deleteMission,
} from "../controllers/missionController.js";

const router = express.Router();

// Define missionImageUpload inside route file
const storage = multer.memoryStorage();
const missionImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Routes
router.post("/", missionImageUpload.single("image"), createMission);
router.get("/", getAllMissions);
router.get("/:id", getMissionById);
router.put("/:id", missionImageUpload.single("image"), updateMission);
router.delete("/:id", deleteMission);

export default router;
