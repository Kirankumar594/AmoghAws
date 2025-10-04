// import productModel from "../models/productModel.js";
// import { deleteFile, uploadFile2 } from "../Utils/Aws.upload.js";


// // @desc    Create product
// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       brand,
//       category,
//       model,
//       sku,
     
//       discount,
//       stock,
//       warranty,
//       features,
//       specifications,
//       usage,
//       status,
//     } = req.body;

//     // Convert incoming JSON strings
//     const featuresArray = features ? JSON.parse(features) : [];
//     const specsObject = specifications ? JSON.parse(specifications) : {};

//     // if (!req.files || req.files.length === 0) {
//     //   return res.status(400).json({ message: "At least one image is required." });
//     // }

//     // Upload images to S3
//     const imageUploads = await Promise.all(
//       req.files.map(async (file) => {
//         const s3Res = await uploadFile2(file, "products"); // returns { Location, Key }
//         return {
//           url: s3Res,
    
//         };
//       })
//     );

//     // Check for duplicate SKU
//     const existing = await productModel.findOne({ sku });
//     if (existing) {
//       return res.status(400).json({ message: "SKU already exists" });
//     }

//     const product = await productModel.create({
//       name,
//       brand,
//       category,
//       model,
//       sku,
      
//       discount: parseFloat(discount) || 0,
//       stock: parseInt(stock),
//       warranty,
//       features: featuresArray,
//       specifications: specsObject,
//       usage,
//       images: imageUploads,
//       status: status || "Active",
//     });

//     res.status(201).json({ success: true, message: "Product created", data: product });
//   } catch (err) {
//     console.error("Error creating product:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // @desc    Get all products
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await productModel.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       total: products.length,
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch products", error: error.message });
//   }
// };

// // @desc    Update product
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = { ...req.body };

//     // Convert numeric fields if they exist
//     if (updates.price !== undefined && updates.price !== "undefined") {
//       updates.price = Number(updates.price);
//     } else {
//       delete updates.price; // prevent "undefined" being cast to Number
//     }

//     if (updates.discount !== undefined && updates.discount !== "undefined") {
//       updates.discount = Number(updates.discount);
//     } else {
//       delete updates.discount;
//     }

//     if (updates.stock !== undefined && updates.stock !== "undefined") {
//       updates.stock = Number(updates.stock);
//     } else {
//       delete updates.stock;
//     }

//     // Handle image replacement if new files are uploaded
//     if (req.files && req.files.length > 0) {
//       const newImages = await Promise.all(
//         req.files.map(async (file) => {
//           const s3Res = await uploadFile2(file, "products");
//           return { url: s3Res };
//         })
//       );
//       updates.images = newImages;
//     }

//     const updatedProduct = await productModel.findByIdAndUpdate(id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({
//       message: "Product updated",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update product",
//       error: error.message,
//     });
//   }
// };

// // @desc    Delete a product
// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedProduct = await productModel.findByIdAndDelete(id);

//     if (!deletedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Delete images from S3 if exist
//     if (deletedProduct.images && deletedProduct.images.length > 0) {
//       await Promise.all(
//         deletedProduct.images.map(async (img) => {
//           await deleteFile(img.public_id);
//         })
//       );
//     }

//     res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete product", error: error.message });
//   }
// };

// // @desc    Get single product
// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await productModel.findById(id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ success: true, product });
//   } catch (error) {
//     console.error("Error fetching product by ID:", error);
//     res.status(500).json({ message: "Failed to fetch product", error: error.message });
//   }
// };

import productModel from "../models/productModel.js";
import { deleteFile, uploadFile2 } from "../Utils/Aws.upload.js";

// @desc    Create product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      model,
      sku,
      discount,
      stock,
      warranty,
      features,
      specifications,
      usage,
      status,
    } = req.body;

    // Convert features - handle both string and array formats
    let featuresArray = [];
    if (features) {
      if (typeof features === 'string') {
        try {
          featuresArray = JSON.parse(features);
        } catch (error) {
          // If JSON parsing fails, try splitting by newline
          featuresArray = features.split('\n').filter(item => item.trim() !== '');
        }
      } else if (Array.isArray(features)) {
        featuresArray = features;
      }
    }

    // Convert specifications
    const specsObject = specifications ? JSON.parse(specifications) : {};

    // Upload images to S3
    const imageUploads = await Promise.all(
      req.files.map(async (file) => {
        const s3Res = await uploadFile2(file, "products");
        return {
          url: s3Res,
        };
      })
    );

    // Check for duplicate SKU
    const existing = await productModel.findOne({ sku });
    if (existing) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    const product = await productModel.create({
      name,
      brand,
      category,
      model,
      sku,
      discount: parseFloat(discount) || 0,
      stock: parseInt(stock),
      warranty,
      features: featuresArray, // Store as clean array
      specifications: specsObject,
      usage,
      images: imageUploads,
      status: status || "Active",
    });

    res.status(201).json({ success: true, message: "Product created", data: product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Handle features conversion in update
    if (updates.features) {
      if (typeof updates.features === 'string') {
        try {
          updates.features = JSON.parse(updates.features);
        } catch (error) {
          updates.features = updates.features.split('\n').filter(item => item.trim() !== '');
        }
      }
    }

    // Handle specifications
    if (updates.specifications && typeof updates.specifications === 'string') {
      updates.specifications = JSON.parse(updates.specifications);
    }

    // Convert numeric fields
    if (updates.price !== undefined && updates.price !== "undefined") {
      updates.price = Number(updates.price);
    } else {
      delete updates.price;
    }

    if (updates.discount !== undefined && updates.discount !== "undefined") {
      updates.discount = Number(updates.discount);
    } else {
      delete updates.discount;
    }

    if (updates.stock !== undefined && updates.stock !== "undefined") {
      updates.stock = Number(updates.stock);
    } else {
      delete updates.stock;
    }

    // Handle image replacement if new files are uploaded
    if (req.files && req.files.length > 0) {
      const newImages = await Promise.all(
        req.files.map(async (file) => {
          const s3Res = await uploadFile2(file, "products");
          return { url: s3Res };
        })
      );
      updates.images = newImages;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Keep other functions (getAllProducts, deleteProduct, getProductById) the same
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: 1 });
    res.status(200).json({
      total: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from S3 if exist
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      await Promise.all(
        deletedProduct.images.map(async (img) => {
          await deleteFile(img.public_id);
        })
      );
    }

    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};