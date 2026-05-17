const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });

const keys = ["BREVO_SMTP_HOST", "BREVO_SMTP_USER", "BREVO_SMTP_PASS"];
const missing = keys.filter((key) => !process.env[key]);

function getArg(name) {
  const prefix = `${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

function redact(message) {
  return [process.env.BREVO_SMTP_USER, process.env.BREVO_SMTP_PASS]
    .filter(Boolean)
    .reduce((text, value) => text.split(value).join("[redacted]"), String(message));
}

async function main() {
  if (missing.length > 0) {
    console.error(`Missing SMTP env vars: ${missing.join(", ")}`);
    process.exit(1);
  }

  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 45_000,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP login verified.");
  } catch (error) {
    console.error("SMTP login failed.");
    console.error(redact(error.message || error));
    process.exit(1);
  }

  const to = getArg("--to");
  if (!to) {
    console.log("No test email sent. Pass --to=you@example.com to test delivery.");
    return;
  }

  const senderName = process.env.BREVO_SENDER_NAME || "Classgrid";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "support@classgrid.in";

  try {
    const result = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      replyTo: senderEmail,
      to,
      subject: "Classgrid SMTP delivery test",
      text: "This is a Classgrid SMTP delivery test.",
      html: "<p>This is a Classgrid SMTP delivery test.</p>",
    });

    console.log("Test email accepted by SMTP.");
    console.log(
      JSON.stringify(
        {
          messageId: result.messageId,
          accepted: result.accepted,
          rejected: result.rejected,
          pending: result.pending,
          response: result.response,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error("Test email failed.");
    console.error(redact(error.message || error));
    process.exit(1);
  }
}

main();
