import crypto from "crypto";
import nodemailer from "nodemailer";
import dns from "dns";
import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { supabaseAdmin } from "@/lib/supabase";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

function getLocalizedString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value || fallback;
  }

  if (value && typeof value === "object") {
    const localized = value as { en?: unknown; hi?: unknown; mr?: unknown };
    if (typeof localized.en === "string" && localized.en) return localized.en;
    if (typeof localized.hi === "string" && localized.hi) return localized.hi;
    if (typeof localized.mr === "string" && localized.mr) return localized.mr;
  }

  return fallback;
}

function truncateText(value: string, maxLength = 120): string {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function resolveImageUrl(image: unknown, width: number): string | null {
  if (!image) return null;

  if (typeof image === "string") {
    return image;
  }

  try {
    return urlFor(image).width(width).url();
  } catch {
    return null;
  }
}

function formatUpdateType(value: string | null | undefined): string {
  switch (value) {
    case "feature":
      return "New Feature";
    case "improvement":
      return "Improvement";
    case "bugfix":
      return "Bug Fix";
    default:
      return "Update";
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Extract a best-effort first name from an email address
// e.g. nikhil.shinde@gmail.com → "Nikhil", john_doe@edu.in → "John"
function firstNameFromEmail(emailAddress: string): string {
  const local = emailAddress.split("@")[0] || "";
  // Split by common separators, take first segment, strip digits, capitalize
  const segment = local.split(/[._\-+]/)[0] || local;
  const alpha = segment.replace(/[^a-zA-Z]/g, "");
  if (alpha.length < 2) return "";
  return alpha.charAt(0).toUpperCase() + alpha.slice(1).toLowerCase();
}

function renderRecentBlogs(
  blogs: Array<{ slug: string; resolvedTitle: string; resolvedExcerpt: string; imageUrl: string | null }>,
  siteUrl: string
) {
  if (blogs.length === 0) return "";

  return `
<div style="margin-top:40px;padding-top:30px;border-top:1px solid #eaeaea;">
  <h3 style="color:#111111;font-size:16px;margin:0 0 20px;font-weight:700;">Latest from Our Blog</h3>
  ${blogs
    .map((blog) => {
      const blogUrl = `${siteUrl}/blog/${blog.slug}`;
      const imageHtml = blog.imageUrl
        ? `<img src="${escapeHtml(blog.imageUrl)}" alt="${escapeHtml(blog.resolvedTitle)}" width="520" style="width:100%;max-width:520px;border-radius:6px;display:block;margin:0 0 12px;" />`
        : "";

      return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr>
      <td style="padding:16px;background:#f9f9f9;border-radius:10px;border:1px solid #eaeaea;">
        ${imageHtml}
        <a href="${escapeHtml(blogUrl)}" style="color:#111111;font-size:15px;font-weight:600;text-decoration:none;line-height:1.3;">${escapeHtml(blog.resolvedTitle)}</a>
        <p style="color:#6b7280;font-size:13px;margin:6px 0 0;line-height:1.5;">${escapeHtml(blog.resolvedExcerpt)}</p>
      </td>
    </tr>
  </table>`;
    })
    .join("")}
</div>`;
}

function renderRecentChangelogs(
  changelogs: Array<{
    slug: string;
    resolvedTitle: string;
    resolvedSummary: string;
    imageUrl: string | null;
    updateType: string | null | undefined;
  }>,
  siteUrl: string
) {
  if (changelogs.length === 0) return "";

  return `
<div style="margin-top:30px;padding-top:30px;border-top:1px solid #eaeaea;">
  <h3 style="color:#111111;font-size:16px;margin:0 0 20px;font-weight:700;">What's New in Classgrid</h3>
  ${changelogs
    .map((entry) => {
      const changelogUrl = `${siteUrl}/changelog/${entry.slug}`;
      const imageHtml = entry.imageUrl
        ? `<img src="${escapeHtml(entry.imageUrl)}" alt="${escapeHtml(entry.resolvedTitle)}" width="520" style="width:100%;max-width:520px;border-radius:6px;display:block;margin:0 0 12px;" />`
        : "";

      return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr>
      <td style="padding:16px;background:#f9f9f9;border-radius:10px;border:1px solid #eaeaea;">
        ${imageHtml}
        <div style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;background:#34d399;color:#000;">
          ${escapeHtml(formatUpdateType(entry.updateType))}
        </div>
        <a href="${escapeHtml(changelogUrl)}" style="color:#111111;font-size:15px;font-weight:600;text-decoration:none;line-height:1.3;display:block;margin-top:6px;">${escapeHtml(entry.resolvedTitle)}</a>
        <p style="color:#6b7280;font-size:13px;margin:6px 0 0;line-height:1.5;">${escapeHtml(entry.resolvedSummary)}</p>
      </td>
    </tr>
  </table>`;
    })
    .join("")}
</div>`;
}

function generateUnsubscribeHash(email: string): string {
  const secret = process.env.SANITY_WEBHOOK_SECRET || "classgrid_fallback";
  return crypto.createHmac("sha256", secret).update(email).digest("hex").slice(0, 32);
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 5; // max 5 per 15 minutes
  const windowMs = 15 * 60 * 1000;
  
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= limit) return false;
  
  record.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { 
      email, 
      name, 
      type = "blog", 
      "cf-turnstile-response": turnstileToken,
      website_url 
    } = await req.json();

    // 1. Honeypot Check
    if (website_url) {
      // Silently accept bots filling the honeypot
      return NextResponse.json(
        { message: "Successfully subscribed! Please check your inbox." },
        { status: 200 }
      );
    }

    // 2. Turnstile Verification
    const turnstileSecret = process.env.TURNSTILE_SECRET;
    if (turnstileSecret && turnstileToken) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: ip,
        }),
      });
      
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json({ error: "Security verification failed." }, { status: 403 });
      }
    } else if (!turnstileToken) {
      return NextResponse.json({ error: "Security token missing." }, { status: 400 });
    }
      // Clean the name: trim whitespace, take just the first word as first name
      const firstName = (name || "").trim().split(/\s+/)[0] || "";
  
      if (!firstName) {
        return NextResponse.json({ error: "Please enter your name to subscribe." }, { status: 400 });
      }
  
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email address. Please enter a valid email." }, { status: 400 });
      }

      // 3. MX Record Validation
      const domain = email.split('@')[1];
      try {
        const mxRecords = await dns.promises.resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
          return NextResponse.json({ error: "Invalid email domain. Please use a valid email." }, { status: 400 });
        }
      } catch (err) {
        return NextResponse.json({ error: "Could not verify email domain. Please use a valid email." }, { status: 400 });
      }
  
      const { data: existingSub } = await supabaseAdmin
        .from("blog_subscribers")
        .select("*")
        .eq("email", email)
        .maybeSingle();
  
      let isExistingSubscriberUpgrade = false;

      if (existingSub) {
        const isSubscribedToType = type === "changelog" ? existingSub.receives_changelog !== false : existingSub.receives_blog !== false;
        if (isSubscribedToType) {
          return NextResponse.json(
            { message: "You are already subscribed!" },
            { status: 200 }
          );
        }
        
        let updatePayload: Record<string, any> = { 
          updated_at: new Date().toISOString(),
          receives_legal: true // Legal is mandatory/implied for active subscribers
        };
        if (type === "changelog") {
          updatePayload.receives_changelog = true;
        } else {
          updatePayload.receives_blog = true;
        }

        const { error: updateError } = await supabaseAdmin
          .from("blog_subscribers")
          .update(updatePayload)
          .eq("email", email);
          
        if (updateError) throw updateError;
        
        // Mark as existing so we don't send a duplicate welcome email
        isExistingSubscriberUpgrade = true;
      } else {
        const { error: insertError } = await supabaseAdmin
          .from("blog_subscribers")
          .insert([{ 
              email, 
              name: firstName,
              receives_blog: type !== "changelog",
              receives_changelog: type === "changelog",
              receives_legal: true
          }]);
  
        if (insertError) {
          if (insertError.code === "23505") {
            return NextResponse.json(
              { message: "You are already subscribed to our updates!" },
              { status: 409 }
            );
          }
          throw insertError;
        }
      }

    // 4. Always send the welcome email — even if they already had a record in the DB.
    // If they are subscribing to Changelog for the first time (even as an existing Blog
    // subscriber), they should still receive the Changelog welcome email.

    const senderName = process.env.BREVO_SENDER_NAME || "Classgrid";
    const senderEmail = "noreply@classgrid.in";
    const supportEmail = "support@classgrid.in";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
    const unsubscribeUrl = `${siteUrl}/api/preferences/unsubscribe?type=${type}`;

    // Date cutoff: 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoff = sevenDaysAgo.toISOString();

    // Fetch recent blogs and changelogs - get more than 3 so we can filter by date
    const [allRecentBlogs, allRecentChangelogs] = await Promise.all([
      client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...10]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        coverImage
      }`),
      client.fetch(`*[_type == "changelogEntry"] | order(releaseDate desc)[0...10]{
        _id,
        title,
        "slug": slug.current,
        summary,
        releaseDate,
        updateType,
        image
      }`),
    ]);

    // Normalize and resolve images for blogs
    const allBlogsWithImages = ((allRecentBlogs as any[]) || [])
      .map((blog: any) => ({
        ...blog,
        resolvedTitle: getLocalizedString(blog.title, "Blog Post"),
        resolvedExcerpt: truncateText(getLocalizedString(blog.excerpt, "Read the latest insight from Classgrid.")),
        imageUrl: resolveImageUrl(blog.coverImage, 520),
      }))
      .filter((blog) => blog.slug && blog.resolvedTitle);

    // Normalize and resolve images for changelogs
    const allChangelogsWithImages = ((allRecentChangelogs as any[]) || [])
      .map((entry: any) => ({
        ...entry,
        resolvedTitle: getLocalizedString(entry.title, "Product Update"),
        resolvedSummary: truncateText(
          getLocalizedString(entry.summary, "Explore the latest Classgrid release update.")
        ),
        imageUrl: resolveImageUrl(entry.image, 520),
      }))
      .filter((entry) => entry.slug && entry.resolvedTitle);

    // Priority 1: items from last 7 days (max 3 each)
    let blogsWithImages = allBlogsWithImages
      .filter((b) => b.publishedAt && b.publishedAt >= cutoff)
      .slice(0, 3);

    let changelogsWithImages = allChangelogsWithImages
      .filter((e) => e.releaseDate && e.releaseDate >= cutoff)
      .slice(0, 3);

    // Priority 2: if nothing in last 7 days, show ONLY the single most recent one (not 3)
    // Per spec: "if nothing is sent, then only the one before last"
    if (blogsWithImages.length === 0) {
      blogsWithImages = allBlogsWithImages.slice(0, 1);
    }
    if (changelogsWithImages.length === 0) {
      changelogsWithImages = allChangelogsWithImages.slice(0, 1);
    }

    // Priority 3: if still nothing at all → hasContent stays false → show "stay tuned" message
    const hasContent = blogsWithImages.length > 0 || changelogsWithImages.length > 0;

    // --- DYNAMIC CONTENT BASED ON SUBSCRIPTION TYPE ---
    const isBlog = type !== "changelog";
    
    // Dynamic text strings
    const greetingName = firstName ? firstName : "there";
    const headerTitle = "You're Subscribed!";
    const subheaderText = isBlog ? "Thanks for joining us." : "Stay up to date with what's changing in Classgrid.";
    const subscribeSubject = isBlog ? "the Classgrid Blog" : "the Classgrid Changelog";
    const contentIntro1 = isBlog 
      ? "You're now subscribed to the <strong style=\"color:#111111;\">Classgrid Blog</strong>." 
      : "You're now subscribed to the <strong style=\"color:#111111;\">Classgrid Changelog</strong>.";
    const contentIntro2 = isBlog
      ? "We'll keep you in the loop whenever we publish new insights, practical guides, company news, and perspectives on building better technology for modern educational institutions."
      : "We'll let you know whenever we release new features, improvements, fixes, platform changes, and other important product updates across Classgrid.";
    
    const legalNotice = "You'll also receive <strong style=\"color:#111111;\">important Legal and Security notices</strong> when we need to communicate changes that may affect your account, privacy, security, or use of Classgrid.";
    
    // Dynamic content blocks
    let contentBlockHtml = "";
    let contentBlockText = "";
    let emailSubject = `You're subscribed to ${subscribeSubject}, ${greetingName}!`;

    if (isBlog && blogsWithImages.length > 0) {
      const blog = blogsWithImages[0];
      const blogUrl = `${siteUrl}/blog/${blog.slug}`;
      const imageHtml = blog.imageUrl
        ? `<img src="${escapeHtml(blog.imageUrl)}" alt="${escapeHtml(blog.resolvedTitle)}" width="520" style="width:100%;max-width:520px;border-radius:6px;display:block;margin:0 0 12px;" />`
        : "";
      contentBlockHtml = `
<div style="margin-top:30px;padding-top:30px;border-top:1px solid #eaeaea;">
  <h3 style="color:#111111;font-size:16px;margin:0 0 20px;font-weight:700;">Latest from Our Blog</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr>
      <td style="padding:16px;background:#f9f9f9;border-radius:10px;border:1px solid #eaeaea;">
        ${imageHtml}
        <h4 style="color:#111111;font-size:16px;margin:0 0 8px;">${escapeHtml(blog.resolvedTitle)}</h4>
        <p style="color:#374151;font-size:14px;margin:0 0 20px;line-height:1.6;">${escapeHtml(blog.resolvedExcerpt)}</p>
        <a href="${escapeHtml(blogUrl)}" style="background:#34d399;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;font-size:13px;">Read the Latest Insights</a>
      </td>
    </tr>
  </table>
</div>`;
      contentBlockText = `\nLatest from Our Blog\n${blog.resolvedTitle}\n${blog.resolvedExcerpt}\n\nRead the Latest Insights: ${blogUrl}\n`;
    } else if (!isBlog && changelogsWithImages.length > 0) {
      const entry = changelogsWithImages[0];
      const changelogUrl = `${siteUrl}/changelog/${entry.slug}`;
      const imageHtml = entry.imageUrl
        ? `<img src="${escapeHtml(entry.imageUrl)}" alt="${escapeHtml(entry.resolvedTitle)}" width="520" style="width:100%;max-width:520px;border-radius:6px;display:block;margin:0 0 12px;" />`
        : "";
      contentBlockHtml = `
<div style="margin-top:30px;padding-top:30px;border-top:1px solid #eaeaea;">
  <h3 style="color:#111111;font-size:16px;margin:0 0 20px;font-weight:700;">What's New in Classgrid</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr>
      <td style="padding:16px;background:#f9f9f9;border-radius:10px;border:1px solid #eaeaea;">
        ${imageHtml}
        <div style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;background:#34d399;color:#000;">
          ${escapeHtml(formatUpdateType(entry.updateType))}
        </div>
        <h4 style="color:#111111;font-size:16px;margin:0 0 8px;">${escapeHtml(entry.resolvedTitle)}</h4>
        <p style="color:#374151;font-size:14px;margin:0 0 20px;line-height:1.6;">${escapeHtml(entry.resolvedSummary)}</p>
        <a href="${escapeHtml(changelogUrl)}" style="background:#34d399;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;font-size:13px;">View Latest Product Update</a>
      </td>
    </tr>
  </table>
</div>`;
      contentBlockText = `\nWhat's New in Classgrid\n[${formatUpdateType(entry.updateType)}] ${entry.resolvedTitle}\n${entry.resolvedSummary}\n\nView Latest Product Update: ${changelogUrl}\n`;
    }

    if (!hasContent) {
      contentBlockHtml = `
<div style="margin-top:30px;padding-top:20px;border-top:1px solid #eaeaea;background:#f9f9f9;border-radius:10px;padding:24px;text-align:center;">
  <p style="color:#34d399;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Stay Tuned</p>
  <p style="color:#374151;font-size:14px;margin:0 0 20px;line-height:1.7;">We are actively building new content and product updates. Check our blog and changelog regularly — we will keep updating!</p>
</div>`;
      contentBlockText = `\nWe are actively building content. Check our blog at: ${siteUrl}/blog and changelog at: ${siteUrl}/changelog\nWe will keep updating — stay tuned!\n`;
    }

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(headerTitle)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, html {
      margin: 0; padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f5f5f5;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f5f5f5;width:100%;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #eaeaea;border-radius:12px;overflow:hidden;margin:0 auto;max-width:600px;width:100%;">
<tr>
<td style="padding:30px;border-bottom:1px solid #eaeaea;text-align:center;">
<img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/android-chrome-512x512.png" alt="Classgrid" height="42" style="display:block;margin:0 auto 16px;height:42px;width:auto;border:none;" />
<h1 style="color:#111111;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.3px;">${escapeHtml(headerTitle)}</h1>
<p style="color:#6b7280;margin-top:10px;font-size:13px;line-height:1.6;margin-bottom:0;">${escapeHtml(subheaderText)}</p>
</td>
</tr>
<tr>
<td style="padding:32px 30px;color:#374151;font-size:14px;line-height:1.8;">
<p style="color:#111111;font-size:16px;font-weight:600;margin:0 0 20px;">Hi ${escapeHtml(greetingName)},</p>
<p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 16px;">${contentIntro1}</p>
<p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 16px;">${escapeHtml(contentIntro2)}</p>
<p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 20px;">${legalNotice}</p>

${contentBlockHtml}

<div style="margin-top:40px;padding-top:30px;border-top:1px solid #eaeaea;">
  <p style="color:#374151;font-size:14px;margin:0 0 8px;">Build smarter academic workflows</p>
  <a href="${siteUrl}" style="color:#6b7280;text-decoration:underline;font-size:13px;margin-bottom:24px;display:inline-block;">classgrid.in &rarr;</a>

  <div style="margin-bottom:24px;">
    <a href="https://www.instagram.com/classgridedu/" target="_blank" style="display:inline-block;border:1px solid #eaeaea;border-radius:6px;padding:8px;margin-right:8px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="16" height="16" style="display:block;opacity:0.8;">
    </a>
    <a href="https://www.facebook.com/profile.php?id=61588646851017" target="_blank" style="display:inline-block;border:1px solid #eaeaea;border-radius:6px;padding:8px;margin-right:8px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width="16" height="16" style="display:block;opacity:0.8;">
    </a>
    <a href="https://www.youtube.com/@classgrid-y7f" target="_blank" style="display:inline-block;border:1px solid #eaeaea;border-radius:6px;padding:8px;margin-right:8px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" width="16" height="16" style="display:block;opacity:0.8;">
    </a>
  </div>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="color:#9ca3af;font-size:12px;text-align:left;">
        &copy; ${new Date().getFullYear()} Classgrid. All rights reserved.
      </td>
      <td style="color:#9ca3af;font-size:12px;text-align:right;">
        <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:none;">Unsubscribe</a>
      </td>
    </tr>
  </table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

    const emailText = [
      `${headerTitle}`,
      `${subheaderText}`,
      "",
      `Hi ${greetingName},`,
      `You're now subscribed to ${subscribeSubject}.`,
      `${contentIntro2}`,
      `You'll also receive important Legal and Security notices when we need to communicate changes that may affect your account, privacy, security, or use of Classgrid.`,
      "",
      `${contentBlockText}`,
      "",
      "Build smarter academic workflows",
      `${siteUrl} ->`,
    ].join("\n");


    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      replyTo: supportEmail,
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Successfully subscribed! Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscribe Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
