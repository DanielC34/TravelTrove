const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    message: "Test server is working!",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Test server is running",
    timestamp: new Date().toISOString(),
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Test server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});
