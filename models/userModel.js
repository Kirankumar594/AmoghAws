


// import mongoose from "mongoose"
// import bcrypt from "bcryptjs"

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please add a name"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Please add an email"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Please add a password"],
//       minlength: 6,
//       select: false,
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     profileImage: {
//       type: String,
//       default: "default.jpg",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// )

// // Encrypt password using bcrypt
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next()
//   }

//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
// })

// // Match user entered password to hashed password in database
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password)
// }

// const User = mongoose.model("User", userSchema)
// export default User

import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: {
      type: String,
      default: "default.jpg",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // OTP fields
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    // For password reset
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash OTP
userSchema.methods.getOtp = function () {
  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Hash OTP
  const salt = bcrypt.genSaltSync(10)
  const hashedOtp = bcrypt.hashSync(otp, salt)
  
  // Set OTP and expiration (10 minutes)
  this.otp = hashedOtp
  this.otpExpires = Date.now() + 10 * 60 * 1000
  
  return otp
}

// Generate reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')
  
  // Hash and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  
  // Set expire (30 minutes)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
  
  return resetToken
}

const User = mongoose.model("User", userSchema)
export default User