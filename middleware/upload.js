// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage();

export const uploadBannerImage = multer({ storage }).single("image");
