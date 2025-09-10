// models/leaderModel.js
import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: String, // e.g., "/uploads/leaders/xxx.jpg"
  },
  bio: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Leader", leaderSchema);
