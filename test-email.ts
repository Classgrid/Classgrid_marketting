import { Resend } from "resend";
import { getNoAccountSignInAttemptHtml } from "./lib/email-templates.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log("Using Resend API Key starting with:", process.env.RESEND_API_KEY?.substring(0, 5));
  
  const html = getNoAccountSignInAttemptHtml("nikhilsubsun123@gmail.com", { device: "Test Device (Sent by AI)" });

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "nikhilsubsun123@gmail.com",
      subject: "Test: Login attempt (No Account)",
      html: html,
    });
    console.log("Email sent successfully!");
    console.log(data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();
