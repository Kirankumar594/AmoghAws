// controllers/aboutController.js
import About from "../models/aboutModel.js";

// Create
export const createAbout = async (req, res) => {
  try {
    const about = new About(req.body);
    await about.save();
    res.status(201).json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all
export const getAbout = async (req, res) => {
  try {
    const data = await About.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single
export const getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ error: "Not found" });
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateAbout = async (req, res) => {
  try {
    const updated = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);
    if (!about) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
