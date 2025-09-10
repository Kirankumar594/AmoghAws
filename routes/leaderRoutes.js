import express from "express";
import {
  createLeader,
  getAllLeaders,
  getLeaderById,
  updateLeader,
  deleteLeader
} from "../controllers/leaderController.js";
import multer from "multer";

const router = express.Router();

// Use multer for parsing multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createLeader);
router.get("/", getAllLeaders);
router.get("/:id", getLeaderById);
router.put("/:id", upload.single("image"), updateLeader);
router.delete("/:id", deleteLeader);

export default router;
