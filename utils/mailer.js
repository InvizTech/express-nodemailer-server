// utils/mailer.js
// -----------------------------
// Handles the Nodemailer transport configuration and email sending
// -----------------------------

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter using GoDaddy email SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net", // GoDaddy SMTP host
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your GoDaddy email (e.g. tushar@virtualtechx.com)
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// Function to send email
export const sendMail = async ({ to, subject, text, html, attachments }) => {
  const mailOptions = {
    from: `"VirtualTechX" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
  };

  return await transporter.sendMail(mailOptions);
};
