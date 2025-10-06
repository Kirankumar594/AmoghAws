
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { uploadFile2, deleteFile } from "../Utils/Aws.upload.js"; 
import nodemailer from "nodemailer";


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// @desc Register new user (User registration only)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please include all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // User registration can only create user accounts
    const user = await User.create({
      name,
      email,
      password,
      role: "user", // Force user role
      profileImage: null,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// @desc Register new admin (Admin registration - public)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please include all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create admin account with automatic approval
    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
      profileImage: null,
    });

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      token: generateToken(admin._id),
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// @desc Login user (User login only)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Only find users with role 'user'
    const user = await User.findOne({ email, role: "user" }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: "Account deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "User login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Login admin (Admin login only)
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Only find users with role 'admin'
    const admin = await User.findOne({ email, role: "admin" }).select("+password");
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    // Check if admin account is active
    if (!admin.isActive) {
      return res.status(401).json({ success: false, message: "Admin account deactivated" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: generateToken(admin._id),
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage
      },
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

// @desc Update user profile
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

    // Handle profile image upload to S3
    if (req.file) {
      if (user.profileImage) {
        try {
          await deleteFile(user.profileImage);
        } catch (err) {
          console.error("Error deleting old S3 image:", err);
        }
      }
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

// @desc Upload user photo
export const uploadUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!req.file) return res.status(400).json({ success: false, message: "Please upload a file" });

    if (user.profileImage) {
      try {
        await deleteFile(user.profileImage);
      } catch (err) {
        console.error("Error deleting old S3 image:", err);
      }
    }

    user.profileImage = await uploadFile2(req.file, "profileImages");
    await user.save();

    res.status(200).json({ success: true, data: user.profileImage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Prevent self-deletion
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Toggle user active status (Admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}; 
// ==================== PASSWORD RESET ====================

// @desc Forgot password - send OTP to email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password request for:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = user.getOtp();
    console.log("Generated OTP:", otp);

    await user.save();
    console.log("User saved with OTP");

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for password reset",
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// @desc Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email & OTP required" });

    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    if (Date.now() > user.otpExpires) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    res.status(200).json({ success: true, message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP, newPassword required" });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpires +password");
    if (!user) return res.status(400).json({ success: false, message: "Invalid request" });

    if (Date.now() > user.otpExpires) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    // Update password
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
