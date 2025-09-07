/// <reference path="./types/express.d.ts" />

// Load environment variables first
import dotenv from "dotenv";
dotenv.config();



import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import { authRouter } from "./routes/auth.routes";
import { preferencesRouter } from "./routes/preferences.routes";
import { tripRouter } from "./routes/trip.routes";
import { aiRouter } from "./routes/ai.routes";
import { globalErrorHandler } from "./utils/errorHandler";

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error("❌ CRITICAL: Missing required environment variables:");
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error("   Please check your .env file and ensure all required variables are set.");
  process.exit(1);
}

// Validate JWT_SECRET strength
const JWT_SECRET = process.env.JWT_SECRET!;
if (JWT_SECRET.length < 32) {
  console.error("❌ CRITICAL: JWT_SECRET is too weak!");
  console.error("   JWT_SECRET should be at least 32 characters long.");
  console.error("   Current length:", JWT_SECRET.length);
  process.exit(1);
}

const app = express();

// Security middleware
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session middleware for OAuth
app.use(session({
  secret: process.env.JWT_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (res.statusCode < 400) {
        console.log(`✅ ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Travel Trove API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/preferences", preferencesRouter);
app.use("/api/trips", tripRouter);
app.use("/api/ai", aiRouter);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      type: "NOT_FOUND_ERROR",
      message: `Route ${req.originalUrl} not found`,
      code: "RES_001",
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
});

// Global error handler (must be last)
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("");
  console.log("🎯 Ready to accept requests!");
});

// MongoDB connection (non-blocking)
const MONGODB_URI = process.env.MONGODB_URI!;

console.log("🔌 Attempting to connect to MongoDB...");
console.log("📍 URI:", MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")); // Hide credentials in logs

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
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

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    mongoose.connection.close().then(() => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    mongoose.connection.close().then(() => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});
