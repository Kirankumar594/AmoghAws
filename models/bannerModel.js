// // models/bannerModel.js
// import mongoose from 'mongoose';

// const bannerSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     image: { type: String, required: true },
//     cta: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const Banner = mongoose.model('Banner', bannerSchema);

// export default Banner;
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cta: { type: String, required: true },
    textColor: { type: String, default: "#000000" }, // ✅ new field with default black
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
