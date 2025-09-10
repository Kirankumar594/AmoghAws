import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  feedback: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String },
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema);
