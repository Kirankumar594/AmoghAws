import { Feature } from '../models/feature.js';

// Create
export const createFeature = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newFeature = new Feature({ title, description });
    await newFeature.save();
    res.status(201).json(newFeature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All
export const getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find().sort({ createdAt: -1 });
    res.status(200).json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getFeatureById = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) return res.status(404).json({ error: "Feature not found" });
    res.status(200).json(feature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateFeature = async (req, res) => {
  try {
    const { title, description } = req.body;
    const feature = await Feature.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!feature) return res.status(404).json({ error: "Feature not found" });
    res.status(200).json(feature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) return res.status(404).json({ error: "Feature not found" });
    res.status(200).json({ message: "Feature deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
