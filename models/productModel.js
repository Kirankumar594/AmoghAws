

import mongoose from "mongoose";

const medicalHardwareSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Device name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
      required: true,
    },
    model: {
      type: String,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discount: {
      type: Number,
      default: 0, // percentage (e.g., 10 for 10% off)
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    warranty: {
      type: String,
      default: "No warranty", // Example: "1 year", "6 months"
    },
    features: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Object, // e.g., { power: "220V", dimensions: "12x8x5 in" }
      default: {},
    },
    usage: {
      type: String,
      default: "",
    },
    images: [
      {
        url: String,
        public_id: String, // for Cloudinary or S3
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }

);
                             
export default mongoose.model("MedicalHardwares", medicalHardwareSchema);

