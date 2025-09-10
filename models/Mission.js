import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  title: String,
  description: String,
  points: [String],
  image: String
}, { timestamps: true });

export default mongoose.model('Mission', missionSchema);
