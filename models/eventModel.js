// import mongoose from 'mongoose';

// const eventSchema = new mongoose.Schema({
//   eventTitle: { type: String, required: true },
//   eventDate: { type: String, required: true },
//   time: { type: String, required: true },
//   description: { type: String, required: true },
//   images: [{ type: String }],
//   videos: [{ type: String }],
// }, { timestamps: true });

// export default mongoose.model('Event', eventSchema);

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  eventDate: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  videos: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);