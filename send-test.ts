import { getSmtpTransporter } from "./lib/email";
import dotenv from "dotenv";

dotenv.config();

async function send() {
  const transporter = getSmtpTransporter();
  await transporter.sendMail({
    from: `"Test User" <tryfailnever25@gmail.com>`,
    to: "support@classgrid.in",
    subject: "Test Issue with Attendance - Please Help",
    text: "Hello, my attendance is still not showing up. Could you please check? \n\nAmit Sharma\nromanticgirneverseen@gmail.com",
  });
  console.log("Sent email to support@classgrid.in");
}

send().catch(console.error);
