import { getSmtpTransporter, getNoReplyAddress, getSupportAddress } from "./lib/smtp-mailer.js";

async function test() {
  const transporter = getSmtpTransporter();
  try {
    const result = await transporter.sendMail({
      from: getNoReplyAddress(),
      replyTo: getSupportAddress(),
      to: "nikhilsubsun321@gmail.com",
      subject: "Test",
      text: "Testing noreply",
    });
    console.log("Success:", result.messageId);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
