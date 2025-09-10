// models/aboutModel.js
import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  yearsExperience: {
    type: Number,
    required: true
  },
  healthcarePartners: {
    type: Number,
    required: true
  },
  customerSatisfaction: {
    type: Number,
    required: true
  },
  supportAvailable: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);
