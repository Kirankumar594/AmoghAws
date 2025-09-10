// routes/productRoutes.js
import express from "express";
import multer from "multer";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// ---- Multer Storage (Memory or Disk) ----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images"); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadProductImages = multer({  }).array("images", 10); // max 10 images

// ---- Routes ----
router.post("/create", uploadProductImages, createProduct);
router.get("/", getAllProducts);
router.put("/:id", uploadProductImages, updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);

export default router;
