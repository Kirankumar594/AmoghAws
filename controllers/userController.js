import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { uploadFile2, deleteFile } from "../Utils/Aws.upload.js"; // ✅ AWS S3 utils

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// @desc Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please include all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      profileImage: null,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// @desc Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Get user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Update user profile (with S3 image upload)
export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ success: false, message: "Email already exists" });
    }

    user.name = name.trim();
    user.email = email.trim().toLowerCase();

    if (password) user.password = password;

    // ✅ Handle profile image upload to S3
    if (req.file) {
      // Delete old image from S3 if exists
      if (user.profileImage) {
        try {
          await deleteFile(user.profileImage);
        } catch (err) {
          console.error("Error deleting old S3 image:", err);
        }
      }
      // Upload new one
      user.profileImage = await uploadFile2(req.file, "profileImages");
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// @desc Upload user photo (separate endpoint)
export const uploadUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!req.file) return res.status(400).json({ success: false, message: "Please upload a file" });

    // Delete old photo from S3
    if (user.profileImage) {
      try {
        await deleteFile(user.profileImage);
      } catch (err) {
        console.error("Error deleting old S3 image:", err);
      }
    }

    // Upload new one
    user.profileImage = await uploadFile2(req.file, "profileImages");
    await user.save();

    res.status(200).json({ success: true, data: user.profileImage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Delete user (with S3 image delete)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot delete admin accounts" });
    }

    // if (user.profileImage) {
    //   try {
    //     await deleteFile(user.profileImage);
    //   } catch (err) {
    //     console.error("Error deleting user image from S3:", err);
    //   }
    // }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
