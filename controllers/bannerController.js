// // controllers/bannerController.js
// import Banner from "../models/bannerModel.js";
// import { uploadFile2, deleteFile, updateFile } from "../Utils/Aws.upload.js";

// export const createBanner = async (req, res) => {
//   try {
//     const { title, description, cta } = req.body;

//     if (!title || !description || !cta || !req.file) {
//       return res
//         .status(400)
//         .json({ message: "All fields including image are required." });
//     }

//     // Upload to S3
//     const imageUrl = await uploadFile2(req.file, "banners");

//     const banner = await Banner.create({
//       title,
//       description,
//       cta,
//       image: imageUrl,
//     });

//     res.status(201).json(banner);
//   } catch (error) {
//     console.error("Error creating banner:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getAllBanners = async (req, res) => {
//   try {
//     const banners = await Banner.find().sort({ createdAt: -1 });
//     res.json(banners);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getBannerById = async (req, res) => {
//   try {
//     const banner = await Banner.findById(req.params.id);
//     if (!banner) return res.status(404).json({ message: "Banner not found" });
//     res.json(banner);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateBanner = async (req, res) => {
//   try {
//     const { title, description, cta } = req.body;
//     const banner = await Banner.findById(req.params.id);
//     if (!banner) return res.status(404).json({ message: "Banner not found" });

//     if (req.file) {
//       // Replace old image on S3
//       const updatedImageUrl = await uploadFile2(req.file, "banners");
//       banner.image = updatedImageUrl;
//     }

//     banner.title = title || banner.title;
//     banner.description = description || banner.description;
//     banner.cta = cta || banner.cta;

//     await banner.save();
//     res.json(banner);
//   } catch (error) {
//     console.error("Error updating banner:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteBanner = async (req, res) => {
//   try {
//     const banner = await Banner.findById(req.params.id);
//     if (!banner) return res.status(404).json({ message: "Banner not found" });

//     // if (banner.image) {
//     //   await deleteFile(banner.image);
//     // }

//     await banner.deleteOne();
//     res.json({ message: "Banner deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting banner:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// controllers/bannerController.js
import Banner from "../models/bannerModel.js";
import { uploadFile2, deleteFile } from "../Utils/Aws.upload.js";

// ✅ Create Banner
export const createBanner = async (req, res) => {
  try {
    const { title, description, cta, textColor } = req.body;

    if (!title || !description || !cta || !req.file) {
      return res
        .status(400)
        .json({ message: "All fields including image are required." });
    }

    // Upload image to S3
    const imageUrl = await uploadFile2(req.file, "banners");

    const banner = await Banner.create({
      title,
      description,
      cta,
      image: imageUrl,
      textColor: textColor || "#000000",
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get by ID
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update
export const updateBanner = async (req, res) => {
  try {
    const { title, description, cta, textColor } = req.body;
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    if (req.file) {
      const updatedImageUrl = await uploadFile2(req.file, "banners");
      banner.image = updatedImageUrl;
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;
    banner.cta = cta || banner.cta;
    banner.textColor = textColor || banner.textColor;

    await banner.save();
    res.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // Optional: remove from S3
    // if (banner.image) {
    //   await deleteFile(banner.image);
    // }

    await banner.deleteOne();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: error.message });
  }
};
