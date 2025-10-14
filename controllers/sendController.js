// controllers/sendController.js
// Handles sending email, logging, and cleaning up uploaded files

import fs from "fs-extra";
import path from "path";
import { sendMail } from "../utils/mailer.js";

// Path to log file
const logFile = path.join(process.cwd(), "log.txt");

// Helper to log email attempts
const logEmail = async (to, subject, status, info = "") => {
  const logEntry = `[${new Date().toISOString()}] TO: ${to} | SUBJECT: ${subject} | STATUS: ${status} | INFO: ${info}\n`;
  await fs.appendFile(logFile, logEntry);
};

// Controller function
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      await logEmail(to || "N/A", subject || "N/A", "FAILED", "Missing required fields");
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Handle attachments
    const attachments = req.files?.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    // Send email
    const info = await sendMail({
      to,
      subject,
      text,
      html,
      attachments,
    });

    // Log success
    await logEmail(to, subject, "SENT", info.response || info.messageId);

    // Cleanup uploaded files asynchronously after sending
    if (attachments && attachments.length) {
      attachments.forEach((file) => {
        fs.remove(file.path).catch((err) =>
          console.warn(`Failed to delete file: ${file.path}`, err.message)
        );
      });
    }

    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
      info,
    });
  } catch (error) {
    console.error("❌ Email send error:", error);

    // Log failure
    await logEmail(req.body.to || "N/A", req.body.subject || "N/A", "FAILED", error.message);

    res.status(500).json({ error: "Failed to send email." });
  }
};
