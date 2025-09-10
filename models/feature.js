import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Feature = mongoose.model("Feature", featureSchema);
