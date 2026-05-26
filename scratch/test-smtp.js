import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testSMTP() {
    console.log("Testing Brevo SMTP Connection with OTP Template...");
    
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_SMTP_HOST,
        port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASS,
        },
    });

    try {
        const otpCode = "999999";
        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                <h2 style="color: #10b981; margin-top: 0;">Classgrid Demo Verification</h2>
                <p>Hello,</p>
                <p>Please use the verification code below to confirm your email and continue booking your demo.</p>
                <div style="background-color: #f3f4f6; border-radius: 6px; padding: 16px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827;">${otpCode}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Classgrid" <${process.env.BREVO_SENDER_EMAIL}>`,
            to: "smartkomalshinde5049@gmail.com",
            subject: "Your New Classgrid Demo Verification Code",
            html: emailHtml,
        });

        console.log("✅ OTP Email handed to Brevo successfully!");
        console.log("Message ID:", info.messageId);

    } catch (error) {
        console.error("❌ SMTP Error Occurred:", error);
    }
}

testSMTP();
