const FRONTEND_URL = process.env.NEXTAUTH_URL ?? "https://classgrid.in";
const PLATFORM_LOGO_URL = "https://classgrid.in/Classgrid.png";

const providerConfig: Record<string, { name: string }> = {
  manual: { name: "Email & Password" },
  google: { name: "Google" },
  github: { name: "GitHub" },
  linkedin: { name: "LinkedIn" },
  facebook: { name: "Facebook" }
};

const formatDate = (date?: Date | string | null): string => {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Kolkata", timeZoneName: "short",
  });
};

interface BaseTemplateProps {
  content: string;
  title?: string;
  ignoreText?: string | null;
  hideSupportLink?: boolean;
}

export function baseTemplate({ content, title = "Notification", ignoreText = null, hideSupportLink = false }: BaseTemplateProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Classgrid</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, html {
      margin: 0; padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0f0f0f;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3 { 
      color: #ffffff; 
      margin-top: 0; 
      margin-bottom: 16px;
    }
    p { 
      margin: 0 0 20px; 
      color: #cccccc; 
      font-size: 14px; 
      line-height: 1.7; 
    }
    ul { 
      margin: 0 0 20px 20px; 
      color: #cccccc; 
      font-size: 14px; 
      padding: 0; 
      line-height: 1.7; 
    }
    li { margin-bottom: 8px; }
    strong { color: #ffffff; }
    a { color: #ffffff; text-decoration: underline; }
    
    .btn {
      display: inline-block;
      background-color: #ffffff;
      color: #000000 !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
      margin: 10px 0;
      text-align: center;
    }
    .btn-danger {
      background-color: #dc2626;
      color: #ffffff !important;
    }
    .box {
      background-color: #161616;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .box p { margin-bottom: 8px; color: #cccccc; }
    .box p:last-child { margin-bottom: 0; }
    .box .meta {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .box .code {
      font-family: monospace;
      font-size: 24px;
      color: #ffffff;
      letter-spacing: 4px;
      font-weight: bold;
      display: block;
      margin-top: 8px;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#0f0f0f;width:100%;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;margin:0 auto;max-width:600px;width:100%;">

<tr>
<td style="padding:30px;border-bottom:1px solid #2a2a2a;text-align:center;">
<img src="${PLATFORM_LOGO_URL}" alt="Classgrid" width="48" height="48" style="display:block;margin:0 auto 16px;border-radius:6px;">
<h1 style="color:#ffffff;margin:0;font-size:20px;">${title}</h1>
</td>
</tr>

<tr>
<td style="padding:30px;color:#cccccc;font-size:14px;line-height:1.7;">

${content}

${hideSupportLink ? '' : `
<div style="margin-top:30px;">
<p style="color:#9ca3af;font-size:13px;margin:0;">
Need help? Contact <a href="mailto:support@classgrid.in" style="color:#ffffff;text-decoration:none;">support@classgrid.in</a>
</p>
</div>
`}

</td>
</tr>

<tr>
<td style="padding:20px;text-align:center;border-top:1px solid #2a2a2a;color:#7a7a7a;font-size:12px;">
${ignoreText ? `<p style="margin-bottom:12px;color:#7a7a7a;font-size:12px;">${ignoreText}</p>` : ''}
© ${new Date().getFullYear()} Classgrid. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

// ------------- PASSWORD RESET -------------
export function getForumPasswordResetEmailHtml(resetLink: string): string {
  const content = `
    <h1>Reset your password</h1>
    <p>We received a request to reset the password for your Classgrid account. This link expires in <strong>5 minutes</strong>.</p>
    <a href="${resetLink}" class="btn">Reset Password</a>
    <p style="margin-top:20px;font-size:13px;color:#9ca3af;">If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  `;
  return baseTemplate({
    content,
    title: "Password Reset",
    ignoreText: "If you did not request this, please ignore this email. Your password will remain unchanged."
  });
}

// ------------- WELCOME EMAIL -------------
export function getForumWelcomeEmailHtml(userName: string, dashboardUrl: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#0f0f0f;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;">

<tr>
<td style="padding:30px;border-bottom:1px solid #2a2a2a;text-align:center;">
<img src="${PLATFORM_LOGO_URL}" alt="Classgrid" width="48" height="48" style="display:block;margin:0 auto 16px;">
<h1 style="color:#ffffff;margin:0;font-size:22px;">Welcome to the Classgrid Community</h1>
<p style="color:#9ca3af;margin-top:8px;font-size:13px;">
Ready to start your academic journey
</p>
</td>
</tr>

<tr>
<td style="padding:30px;color:#cccccc;font-size:14px;line-height:1.7;">

<p>Hi <strong>${userName}</strong>,</p>

<p>Your account has been successfully created. You're now ready to join the Classgrid Community.</p>

<h3 style="color:#ffffff;">What You Can Do</h3>
<ul style="padding-left:20px;">
<li style="margin-bottom:6px;">Join academic discussions with educators and students globally</li>
<li style="margin-bottom:6px;">Ask questions and get real answers from the community</li>
<li style="margin-bottom:6px;">Connect directly with verified Classgrid Platform users</li>
<li style="margin-bottom:6px;">Track the latest product updates and announcements</li>
</ul>

<div style="text-align:center;margin:30px 0;">
<a href="${dashboardUrl}" style="background:#ffffff;color:#000;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">
Join Discussions
</a>
</div>

<p style="color:#9ca3af;font-size:13px;margin:0;">
Need help? Contact <a href="mailto:support@classgrid.in" style="color:#ffffff;text-decoration:none;">support@classgrid.in</a>
</p>

</td>
</tr>

<tr>
<td style="padding:20px;text-align:center;border-top:1px solid #2a2a2a;color:#7a7a7a;font-size:12px;">
© ${new Date().getFullYear()} Classgrid. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

// ------------- LOGIN NOTIFICATION -------------
export function getForumLoginNotificationHtml(user: { name: string; email: string }, provider: string = "manual"): string {
  const config = providerConfig[provider] || providerConfig.manual;
  const content = `
    <h1>New login to your account</h1>
    <p>Hi ${user.name},</p>
    <p>We noticed a new sign-in to your Classgrid Community account (${user.email}) on ${formatDate()} using ${config.name}.</p>
    <a href="${FRONTEND_URL}/login/reset-password" class="btn btn-danger">Secure My Account</a>
  `;
  return baseTemplate({
    content,
    title: "New Login Detected",
    ignoreText: "If this was you, you can safely ignore this email."
  });
}

// ------------- VERIFICATION EMAIL -------------
export function getForumVerificationEmailHtml(name: string, verifyLink: string): string {
  const content = `
    <h1>Verify your email</h1>
    <p>Hi ${name},</p>
    <p>Please verify your email address to complete your setup. This link expires in 24 hours.</p>
    <a href="${verifyLink}" class="btn">Verify Email</a>
  `;
  return baseTemplate({
    content,
    title: "Verify your email",
    ignoreText: "If you did not sign up for Classgrid, please ignore this email."
  });
}

// ------------- OTP EMAIL -------------
export function getForumOtpEmailHtml(otp: string): string {
  const content = `
    <h1>Your Classgrid Login Code</h1>
    <p>Use the following code to sign in to your Classgrid Community account. This code expires in <strong>60 seconds</strong>.</p>
    
    <div class="box">
      <div class="meta">Login Code</div>
      <div class="code">${otp}</div>
    </div>
    
    <p>Never share this code with anyone.</p>
  `;
  return baseTemplate({
    content,
    title: "Your Login Code",
    ignoreText: "If you did not request this, you can safely ignore this email."
  });
}

// ------------- DEMO OTP EMAIL -------------
export function getDemoOtpEmailHtml(name: string, otp: string): string {
  const content = `
    <h1>Verify your email</h1>
    <p>Hi ${name},</p>
    <p>Use the following verification code to unlock the calendar and schedule your Classgrid demo. This code expires in <strong>60 seconds</strong>.</p>
    
    <div class="box">
      <div class="meta">Verification Code</div>
      <div class="code">${otp}</div>
    </div>
    
    <p>If you have any issues booking your demo, please reply to this email.</p>
  `;
  return baseTemplate({
    content,
    title: "Demo Verification Code",
    ignoreText: "If you did not request a demo, you can safely ignore this email."
  });
}

// ------------- DEMO CONFIRMATION EMAIL -------------
export function getDemoConfirmationEmailHtml(name: string, dateStr: string, meetUrl: string): string {
  const content = `
    <h1>Your Demo is Confirmed!</h1>
    <p>Hi ${name},</p>
    <p>Your 30-minute Classgrid Platform demo has been successfully scheduled.</p>
    
    <div class="box">
      <div class="meta">Date & Time</div>
      <div style="font-size: 16px; font-weight: bold; color: #10b981; margin-bottom: 12px;">${dateStr}</div>
      
      <div class="meta">Google Meet Link</div>
      <div style="font-size: 14px; margin-bottom: 16px;">
        <a href="${meetUrl}" style="color: #10b981;">${meetUrl}</a>
      </div>
      
      <div style="margin-top: 10px;">
        <a href="${meetUrl}" class="btn">Join Google Meet</a>
      </div>
    </div>
    
    <p>A Classgrid team member will connect with you and show a personalized demo.</p>
    <p><strong>Please don't forget to join!</strong> You will also receive a phone call shortly before the meeting begins.</p>
    
    <div style="margin-top: 32px; padding: 24px; background-color: #111111; border-left: 4px solid #10b981; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="margin-bottom: 12px;">
        <span style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Premium Support</span>
      </div>
      <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #ffffff;">Introducing Classgrid Talk</p>
      <p style="margin: 0 0 20px 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">Have questions before our meeting? <strong>Classgrid Talk</strong> is our dedicated direct-messaging portal. Connect with your personal product specialist today to get answers tailored specifically to your institution's unique needs.</p>
      <a href="https://classgrid.in/support/inquiry" style="display: inline-block; background-color: transparent; color: #10b981 !important; border: 1px solid #10b981; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; text-decoration: none;">Start a Chat &rarr;</a>
    </div>
    
    <p style="margin-top: 24px;">If you need to reschedule, simply reply to this email.</p>
  `;
  return baseTemplate({
    content,
    title: "Demo Booking Confirmed",
    ignoreText: "You are receiving this because you booked a demo with Classgrid."
  });
}

// ------------- ADMIN DEMO NOTIFICATION -------------
export function getAdminDemoNotificationHtml(lead: any, dateStr: string, meetUrl: string): string {
  const content = `
    <h1>New Demo Scheduled!</h1>
    <p>A new demo has been booked and confirmed by <strong>${lead.adminName}</strong>.</p>
    
    <div class="box">
      <div class="meta">Meeting Details</div>
      <p><strong>Date & Time:</strong> <span style="color: #10b981; font-weight: bold;">${dateStr}</span></p>
      <p><strong>Meeting Link:</strong> <a href="${meetUrl}" style="color: #10b981;">${meetUrl}</a></p>
      
      <div class="meta" style="margin-top: 24px;">Lead Information</div>
      <p><strong>Name:</strong> ${lead.adminName}</p>
      <p><strong>Email:</strong> ${lead.adminEmail}</p>
      <p><strong>Phone:</strong> ${lead.adminPhone || "N/A"}</p>
      <p><strong>Institution:</strong> ${lead.institutionName}</p>
      <p><strong>Organization Type:</strong> ${lead.orgType}</p>
      <p><strong>Location:</strong> ${lead.city || "N/A"}, ${lead.state || "N/A"}</p>
      <p><strong>Message:</strong> ${lead.message || "N/A"}</p>
    </div>
    
    <p>These meeting details have been successfully synced to the dashboard. Please ensure a team member is prepared for the meeting!</p>
  `;
  return baseTemplate({
    content,
    title: "New Demo Booked",
    ignoreText: "Automated notification from Classgrid Admin System.",
    hideSupportLink: true
  });
}
