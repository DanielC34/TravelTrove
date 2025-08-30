// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth.routes";
import { preferencesRouter } from "./routes/preferences.routes";
import { tripRouter } from "./routes/trip.routes";
import { aiRouter } from "./routes/ai.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Travel Trove API is running",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/preferences", preferencesRouter);
app.use("/api/trips", tripRouter);
app.use("/api/ai", aiRouter);

// Start server first
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log("");
  console.log("🎯 Ready to accept requests!");
});

// MongoDB connection (non-blocking)
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/travel-trove";

console.log("🔌 Attempting to connect to MongoDB...");
console.log("📍 URI:", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("💡 Troubleshooting tips:");
    console.log("   1. Make sure MongoDB is installed and running");
    console.log("   2. Try: brew services start mongodb-community (macOS)");
    console.log("   3. Try: sudo systemctl start mongod (Linux)");
    console.log("   4. Or use MongoDB Atlas: https://cloud.mongodb.com");
    console.log("   5. Update MONGODB_URI in your .env file");
    console.log("");
    console.log("🔄 Server will continue without database connection...");
    console.log("⚠️  Some features may not work without MongoDB");
  });
