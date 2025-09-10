import express from "express";
import {
  getMe,
  login,
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserPhoto,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/UserImage.js"; // ✅ multer memory storage

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Private
router.use(protect);
router.get("/me", getMe);
router.put("/update-profile", upload.single("profileImage"), updateUser);
router.put("/upload-photo", upload.single("profileImage"), uploadUserPhoto);

// Admin only
router.use(authorize("admin"));
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

export default router;
