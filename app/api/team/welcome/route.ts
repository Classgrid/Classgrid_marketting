import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust this to specific domains if needed (e.g., 'https://studio.classgrid.in')
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { name, personalEmail, classgridEmail, password } = await req.json();

    if (!name || !personalEmail || !classgridEmail || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders });
    }

    const port = Number(process.env.BREVO_SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    const htmlContent = `
                    <p style="margin:0 0 16px 0; font-size:16px; color:#374151; line-height:1.6;">We are absolutely thrilled to officially welcome you aboard. The entire team is excited to have you join us. As we continue to scale our platform and expand our community, your expertise and vision will be an invaluable asset to our mission.</p>
                    <p style="margin:0 0 32px 0; font-size:16px; color:#374151; line-height:1.6;">To help you hit the ground running, we've outlined your core focus areas and the initial resources you'll need below.</p>
                    
                    <h3 style="color:#111111; margin:0 0 16px 0; text-transform:uppercase; font-size:14px; letter-spacing:1px; border-bottom:1px solid #eaeaea; padding-bottom:8px;">Your Responsibilities</h3>
                    <ul style="margin:0 0 32px 0; padding-left:20px; color:#374151; font-size:15px; line-height:1.6;">
                      <li style="margin-bottom:8px;"><strong>Marketing Site:</strong> Maintain the marketing codebase and send PRs. (<a href="https://github.com/Classgrid/Classgrid_marketting" style="color:#ffffff !important;text-decoration:underline;">Repository</a>)</li>
                      <li style="margin-bottom:8px;"><strong>Main Platform:</strong> Contribute directly to our core desktop platform. (<a href="https://github.com/Classgrid/classgrid_platoform-desktop-" style="color:#ffffff !important;text-decoration:underline;">Repository</a>)</li>
                      <li style="margin-bottom:8px;"><strong>Infrastructure:</strong> Help maintain our CI/CD GitHub Actions and monitor Vercel deployment stability.</li>
                      <li style="margin-bottom:8px;"><strong>Growth & Analytics:</strong> Oversee user tracking via <a href="https://posthog.com/" style="color:#ffffff !important;text-decoration:underline;">PostHog</a> and lead our Google SEO strategies.</li>
                      <li style="margin-bottom:8px;"><strong>Content Management:</strong> Manage new blog posts and changelog updates via our Sanity CMS.</li>
                    </ul>

                    <h3 style="color:#111111; margin:0 0 16px 0; text-transform:uppercase; font-size:14px; letter-spacing:1px; border-bottom:1px solid #eaeaea; padding-bottom:8px;">Official Account Access</h3>
                    <p style="margin:0 0 20px 0; font-size:16px; color:#374151; line-height:1.6;">We use Zoho Mail exclusively for all official Classgrid email communications (we do not use Gmail). Below are your temporary credentials.</p>
                    
                    <!-- CREDENTIALS BOX -->
                    <div style="background-color:#111111; border:1px solid #333333; border-radius:8px; padding:20px; margin-bottom:24px;">
                      <div style="font-size:13px; text-transform:uppercase; letter-spacing:0.5px; color:#6b7280; margin-bottom:8px; font-weight:600;">Email Address</div>
                      <div style="font-family:monospace; font-size:18px; color:#111111; font-weight:bold; background-color:#000000; padding:12px 14px; border-radius:6px; border:1px solid #333333; margin-bottom:16px;"><a href="mailto:${classgridEmail}" style="color:#ffffff !important; text-decoration:none;">${classgridEmail}</a></div>
                      
                      <div style="font-size:13px; text-transform:uppercase; letter-spacing:0.5px; color:#6b7280; margin-bottom:8px; font-weight:600;">Temporary Password</div>
                      <div style="font-family:monospace; font-size:18px; color:#111111; font-weight:bold; background-color:#000000; padding:12px 14px; border-radius:6px; border:1px solid #333333;">${password}</div>
                    </div>
                    
                    <p style="margin:0 0 24px 0; font-size:16px; color:#374151;">Please log in and <strong style="color:#111111;">change your temporary password</strong> immediately.</p>
                    
                    <!-- Google Account Setup Instructions -->
                    <div style="background-color:#1a1a1a; border-left:3px solid #34d399; padding:16px 20px; border-radius:4px; margin-bottom:24px;">
                      <h4 style="color:#111111; margin:0 0 12px 0; font-size:16px;">Setup Your Chrome Profile & Workspace</h4>
                      <p style="margin:0 0 12px 0;color:#374151;font-size:15px;line-height:1.6;">To get the full workspace experience, please register this email as a Google Account. This allows you to create a dedicated Chrome Browser Profile, set your professional profile photo, use "Continue with Google" across our tools, and access Google Services (excluding Gmail). Follow these steps:</p>
                      <ol style="margin:0; padding-left:20px; color:#374151; font-size:15px; line-height:1.6;">
                        <li style="margin-bottom:6px;">Click <strong>Setup Google Account</strong> below and enter your name and details.</li>
                        <li style="margin-bottom:6px;">When prompted to create an email, click <strong>"Use your existing email"</strong> instead.</li>
                        <li style="margin-bottom:6px;">Enter your Zoho email address from above. Google will send an OTP to it, so <strong>you must log into your Zoho Mailbox first</strong> to retrieve the code and verify it.</li>
                      </ol>
                    </div>
                    
                    <!-- BUTTONS -->
                    <div style="margin-top:24px;margin-bottom:32px;">
                      <a href="https://mail.zoho.in/zm/#mail/views/unread" style="display:inline-block; background-color:#34d399 !important; color:#022c22 !important; padding:12px 28px; text-decoration:none !important; border-radius:6px; font-weight:bold; font-size:14px; margin-right:12px; margin-bottom:12px;">Login to Zoho Mailbox</a>
                      <a href="https://accounts.google.com/signup" style="display:inline-block; background-color:#2a2a2a !important; color:#ffffff !important; padding:12px 28px; text-decoration:none !important; border-radius:6px; font-weight:bold; font-size:14px; margin-bottom:12px; border:1px solid #333333;">Setup Google Account</a>
                    </div>
                    
                    <!-- SIGNATURE -->
                    <div style="margin-top:40px;">
                      <p style="margin:0; color:#111111; font-weight:bold; font-size:16px;">Nikhil Shinde</p>
                      <p style="margin:0; font-size:14px; color:#6b7280;">Founder, Classgrid</p>
                    </div>
                  </td>
                </tr>
                
                <!-- FOOTER -->
                <tr>
                  <td style="padding:20px;text-align:center;border-top:1px solid #eaeaea;color:#9ca3af;font-size:12px;">
                    © ${new Date().getFullYear()} Classgrid. All rights reserved.<br>
                    Secure access message. Do not forward this email.
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const senderName = "Nikhil Shinde";
    const senderEmail = "nikhil.shinde@classgrid.in";
    
    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: personalEmail,
      subject: 'Welcome to Classgrid! Your Account Credentials Inside',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500, headers: corsHeaders }
    );
  }
}
