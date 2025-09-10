import MapEmbed from "../models/mapEmbedModel.js";

// Create or Update Map Embed URL
export const updateMapEmbed = async (req, res) => {
  try {
    const { embedUrl } = req.body;

    let map = await MapEmbed.findOne();
    if (map) {
      map.embedUrl = embedUrl;
      await map.save();
    } else {
      map = await MapEmbed.create({ embedUrl });
    }

    res.status(200).json({ message: "Map URL updated successfully", map });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get Map Embed URL
export const getMapEmbed = async (req, res) => {
  try {
    const map = await MapEmbed.findOne();
    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
