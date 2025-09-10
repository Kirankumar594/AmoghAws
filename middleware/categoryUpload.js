// middleware/categoryUpload.js
import multer from "multer";

const storage = multer.memoryStorage(); // keep file in memory buffer

export const UploadCategoryImage = multer({ storage }).single("image");
