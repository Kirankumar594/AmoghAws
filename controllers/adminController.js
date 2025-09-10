import { adminModel } from "../models/adminModel.js"
import jwt from 'jsonwebtoken';
export const registerAdmin = async (req, res) => {
  console.log("Request Body:", req.body)
  const { email, password, role } = req.body // Destructure role

  try {
    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email })
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    // Create new admin with specified role or default to 'admin'
    const admin = new adminModel({ email, password })
    await admin.save()

    // Generate JWT token including the role
    const token = jwt.sign({ id: admin._id,  }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.status(201).json({ token,  }) // Return role in response
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message })
  }
}

// Login Admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body

  try {
    // Find admin by email
    const admin = await adminModel.findOne({ email })
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token including the role
    const token = jwt.sign({ id: admin._id, }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.status(200).json({ token,  }) // Return role in response
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message })
  }
}
