// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

require("./config/db");

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// =============================================================================
// STATIC FILE (untuk akses file upload)
// =============================================================================

// Expose folder uploads agar bisa diakses dari browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================================================================
// ROUTES
// =============================================================================

const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Route default
app.get("/", (req, res) => {
  res.send("API jalan");
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Server running on port ${PORT}`);
});