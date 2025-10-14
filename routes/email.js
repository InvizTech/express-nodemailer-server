// routes/email.js
// -----------------------------
// This file defines the email-related routes
// -----------------------------

import express from "express";
import multer from "multer";
import { sendEmail } from "../controllers/sendController.js";

const router = express.Router();

// Configure multer for file uploads (attachments)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // store files in uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

// POST route to send email (with or without attachments)
router.post("/send", upload.array("attachments"), sendEmail);

export default router;
