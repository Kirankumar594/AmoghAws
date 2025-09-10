import express from "express";
import multer from "multer";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
} from "../controllers/categoryController.js";

const storage = multer.memoryStorage(); // store file in memory for S3
const UploadCategoryImage = multer({ storage }).single("image");

const categoryRoutes = express.Router();

categoryRoutes.get("/", getAllCategories);
categoryRoutes.post("/", UploadCategoryImage, createCategory);
categoryRoutes.put("/:id", UploadCategoryImage, updateCategory);
categoryRoutes.delete("/:id", deleteCategory);
categoryRoutes.get("/:id", getCategoryById);

export default categoryRoutes;
