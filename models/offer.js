import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // image filename
  cta: { type: String },   // call to action button label or link
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
