import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    image: { type: String }, // URL or path to uploaded image
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const categoryModel=mongoose.model("category",categorySchema)