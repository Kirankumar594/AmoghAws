import mongoose from "mongoose";

const mapEmbedSchema = new mongoose.Schema({
  embedUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model("MapEmbed", mapEmbedSchema);
