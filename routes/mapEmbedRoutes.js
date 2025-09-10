import express from "express";
import { updateMapEmbed, getMapEmbed } from "../controllers/mapEmbedController.js";

const router = express.Router();

router.get("/", getMapEmbed);
router.post("/", updateMapEmbed); // or use PUT

export default router;
