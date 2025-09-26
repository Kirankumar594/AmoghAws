// controllers/coreValueController.js
import CoreValue from "../models/coreValueModel.js";
import { deleteFile, uploadFile2 } from "../Utils/Aws.upload.js";


// Create
export const createCoreValue = async (req, res) => {
  try {
    const { title, description } = req.body;

    let imageUrl = "";
    if (req.file) {
      // upload to S3 under "core-values" folder
      imageUrl = await uploadFile2(req.file, "core-values");
    }

    const newValue = new CoreValue({ title, description, image: imageUrl });
    await newValue.save();

    res.status(201).json(newValue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All
export const getAllCoreValues = async (req, res) => {
  try {
    const values = await CoreValue.find().sort({ createdAt: -1 });
    res.json(values);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getCoreValueById = async (req, res) => {
  try {
    const value = await CoreValue.findById(req.params.id);
    if (!value) return res.status(404).json({ error: "Not found" });
    res.json(value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateCoreValue = async (req, res) => {
  try {
    const { title, description } = req.body;
    const value = await CoreValue.findById(req.params.id);
    if (!value) return res.status(404).json({ error: "Not found" });

    value.title = title || value.title;
    value.description = description || value.description;

    if (req.file) {
      // delete old image from S3
      if (value.image) {
       
      }
      // upload new image to S3
      value.image = await uploadFile2(req.file, "core-values");
    }

    await value.save();
    res.json(value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteCoreValue = async (req, res) => {
  try {
    const value = await CoreValue.findById(req.params.id);
    if (!value) return res.status(404).json({ error: "Not found" });

    // if (value.image) {
    //   // delete from S3
    //   await deleteFile(value.image);
    // }

    await value.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
