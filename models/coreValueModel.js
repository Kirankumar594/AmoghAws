// models/coreValueModel.js
import mongoose from 'mongoose';

const coreValueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('CoreValue', coreValueSchema);
