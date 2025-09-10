import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import featureRoutes from "./routes/featureRoutes.js";
import offerBannerRoutes from "./routes/offerBannerRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import contactInfoRoutes from "./routes/contactInfoRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import mapEmbedRoutes from "./routes/mapEmbedRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import coreValueRoutes from "./routes/coreValueRoutes.js";
import leaderRoutes from "./routes/leaderRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";


import path from "path";
import { fileURLToPath } from "url"; // ✅ ES Module fix for __dirname


// Fix __dirname for ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ✅ Serve static files (e.g., image URLs like /uploads/categories/xyz.jpg)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer error handler (optional)
app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/features', featureRoutes);
app.use("/api/offer-banners", offerBannerRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use('/api/contact-info', contactInfoRoutes)
app.use('/api/messages', messageRoutes);
app.use("/api/map-embed", mapEmbedRoutes);
app.use("/api/core-values", coreValueRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/leaders", leaderRoutes);
app.use("/api/about", aboutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/events', eventRoutes);

app.use(express.static(path.join(__dirname, 'build'))); // Change 'build' to your frontend folder if needed

// Redirect all requests to the index.html file

app.get("*", (req, res) => {
  return  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
