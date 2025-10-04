// import express from "express";
// import {
//   getMe,
//   login,
//   register,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   uploadUserPhoto,
// } from "../controllers/userController.js";
// import { protect, authorize } from "../middleware/authMiddleware.js";
// import upload from "../middleware/UserImage.js"; // ✅ multer memory storage

// const router = express.Router();

// // Public
// router.post("/register", register);
// router.post("/login", login);

// // Private
// router.use(protect);
// router.get("/me", getMe);
// router.put("/update-profile", upload.single("profileImage"), updateUser);
// router.put("/upload-photo", upload.single("profileImage"), uploadUserPhoto);

// // Admin only
// router.use(authorize("admin"));
// router.get("/users", getUsers);
// router.get("/users/:id", getUserById);
// router.delete("/users/:id", deleteUser);

// export default router;
import express from "express";
import {
  getMe,
  login,
  register,
  loginAdmin,
  registerAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  toggleUserStatus,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/UserImage.js";

const router = express.Router();

// Public routes
router.post("/register", register); // User registration only
router.post("/login", login); // User login only

// Admin authentication (public)
router.post("/admin/register", registerAdmin); // Admin registration - automatic approval
router.post("/admin/login", loginAdmin); // Admin login only

// Protected user routes
router.use(protect);
router.get("/me", getMe);
router.put("/update-profile", upload.single("profileImage"), updateUser);
router.put("/upload-photo", upload.single("profileImage"), uploadUserPhoto);

// Admin only routes
router.use(authorize("admin"));
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/toggle-status", toggleUserStatus);

export default router;