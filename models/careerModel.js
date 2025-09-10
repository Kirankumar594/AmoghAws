import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  resume: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String
  }
}, {
  timestamps: true
});

const Career = mongoose.model('Career', careerSchema);
export default Career;
