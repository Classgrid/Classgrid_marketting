import nodemailer from "nodemailer";

const REQUIRED_SMTP_ENV = [
  "BREVO_SMTP_HOST",
  "BREVO_SMTP_USER",
  "BREVO_SMTP_PASS",
] as const;

function redact(value: string, message: string) {
  return value ? message.split(value).join("[redacted]") : message;
}

export function getSmtpConfig() {
  const missing = REQUIRED_SMTP_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing SMTP environment variables: ${missing.join(", ")}`);
  }

  const port = Number(process.env.BREVO_SMTP_PORT || 587);

  return {
    host: process.env.BREVO_SMTP_HOST!,
    port,
    secure: port === 465,
    user: process.env.BREVO_SMTP_USER!,
    pass: process.env.BREVO_SMTP_PASS!,
    senderName: process.env.BREVO_SENDER_NAME || "Classgrid",
    senderEmail: process.env.BREVO_SENDER_EMAIL || "support@classgrid.in",
  };
}

export function getSmtpTransporter() {
  // IMPORTANT: Always create a fresh transporter on Vercel serverless.
  // Cached/pooled connections go stale when functions cold-start,
  // causing silent email delivery failures (4 out of 5 emails lost).
  const config = getSmtpConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    pool: false, // No connection pooling on serverless
    requireTLS: config.port === 587,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 45_000,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export function getSenderAddress() {
  const config = getSmtpConfig();
  return `"${config.senderName}" <${config.senderEmail}>`;
}

export function getNoReplyAddress() {
  const config = getSmtpConfig();
  return `"${config.senderName}" <noreply@classgrid.in>`;
}

export function getSupportAddress() {
  const config = getSmtpConfig();
  return `"${config.senderName}" <support@classgrid.in>`;
}

export function sanitizeMailerError(error: unknown) {
  const err = error as {
    code?: string;
    command?: string;
    response?: string;
    responseCode?: number;
    message?: string;
  };

  let message = err?.message || String(error);
  message = redact(process.env.BREVO_SMTP_PASS || "", message);
  message = redact(process.env.BREVO_SMTP_USER || "", message);

  return {
    code: err?.code,
    command: err?.command,
    responseCode: err?.responseCode,
    response: err?.response,
    message,
  };
}
