import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads/images exists
const dir = 'uploads/images';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// ✅ Updated fileFilter — safe and clear
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const mimetype = file.mimetype.toLowerCase();

  if (allowedMimeTypes.includes(mimetype)) {
    cb(null, true);
  } else {
    // ❗ Properly send multer error without crashing
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type. Only JPEG and PNG are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max per image
  }
});

export const uploadProductImages = upload.array('images', 5); // Max 5 files
