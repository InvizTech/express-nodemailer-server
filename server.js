// server.js
// -----------------------------
// Main entry point for the Express server
// -----------------------------

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import emailRoutes from "./routes/email.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rate limiter for /api/email routes
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Routes
app.use("/api/email", emailLimiter, emailRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("✅ Email server is running successfully!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
