import nodemailer from "nodemailer";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function verifyTransporters() {
  console.log("🔍 Verifying SMTP Configurations...\n");

  // 1. Check AWS SES
  console.log("1️⃣ Testing AWS SES...");
  const sesTransporter = nodemailer.createTransport({
    host: process.env.AWS_SES_SMTP_HOST,
    port: Number(process.env.AWS_SES_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.AWS_SES_SMTP_USER,
      pass: process.env.AWS_SES_SMTP_PASS,
    },
  });

  try {
    await sesTransporter.verify();
    console.log("✅ AWS SES is perfectly configured and authenticated!");
  } catch (err) {
    console.error("❌ AWS SES Failed:", err.message);
  }

  // 2. Check Brevo
  console.log("\n2️⃣ Testing Brevo...");
  const brevoTransporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  try {
    await brevoTransporter.verify();
    console.log("✅ Brevo is perfectly configured and authenticated!");
  } catch (err) {
    console.error("❌ Brevo Failed:", err.message);
  }

  // 3. Check Resend (We can't do .verify() on the SDK, but we can check the key)
  console.log("\n3️⃣ Testing Resend API Key...");
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_")) {
    console.log("✅ Resend API Key is present and looks valid!");
  } else {
    console.error("❌ Resend API Key is missing or invalid!");
  }
}

verifyTransporters();
