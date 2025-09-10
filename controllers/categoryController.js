// controllers/categoryController.js
import { categoryModel } from "../models/categoryModel.js";
import { deleteFile, uploadFile2 } from "../Utils/Aws.upload.js";


// ✅ Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check duplicate category name
    const existing = await categoryModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Upload image to S3
    let imagePath = null;
    if (req.file) {
      imagePath = await uploadFile2(req.file, "categories");
    }

    const category = new categoryModel({
      name,
      description,
      image: imagePath,
    });

    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create category",
      error: err.message,
    });
  }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // If new image uploaded → delete old one & upload new
    if (req.file) {
      if (category.image) {
        // await deleteFile(category.image); // delete old from S3
      }
      updates.image = await uploadFile2(req.file, "categories");

    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({ message: "Category updated", category: updatedCategory });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update category",
      error: err.message,
    });
  }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete image from S3 if exists
    if (category.image) {
      await deleteFile(category.image);
    }

    res.status(200).json({ message: "Category deleted", category });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete category",
      error: err.message,
    });
  }
};

// ✅ Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: err.message,
    });
  }
};

// ✅ Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch category",
      error: err.message,
    });
  }
};
