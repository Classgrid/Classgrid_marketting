import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { supabaseAdmin } from "@/lib/supabase";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
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
<div style="margin-top:40px;padding-top:30px;border-top:1px solid #2a2a2a;">
  <h3 style="color:#ffffff;font-size:16px;margin:0 0 20px;font-weight:700;">Latest from Our Blog</h3>
  ${blogs
    .map((blog) => {
      const blogUrl = `${siteUrl}/blog/${blog.slug}`;
      const imageHtml = blog.imageUrl
        ? `<img src="${escapeHtml(blog.imageUrl)}" alt="${escapeHtml(blog.resolvedTitle)}" width="520" style="width:100%;max-width:520px;border-radius:6px;display:block;margin:0 0 12px;" />`
        : "";

      return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr>
      <td style="padding:16px;background:#1a1a1a;border-radius:10px;border:1px solid #2a2a2a;">
        ${imageHtml}
        <a href="${escapeHtml(blogUrl)}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;line-height:1.3;">${escapeHtml(blog.resolvedTitle)}</a>
        <p style="color:#9ca3af;font-size:13px;margin:6px 0 0;line-height:1.5;">${escapeHtml(blog.resolvedExcerpt)}</p>
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
<div style="margin-top:30px;padding-top:30px;border-top:1px solid #2a2a2a;">
  <h3 style="color:#ffffff;font-size:16px;margin:0 0 20px;font-weight:700;">What's New in Classgrid</h3>
  ${changelogs
    .map((entry) => {
      const changelogUrl = `${siteUrl}/changelog/${entry.slug}`;
      const imageHtml = entry.imageUrl
        ? `<img src="${escapeHtml(entry.imageUrl)}" alt="${escapeHtml(entry.resolvedTitle)}" width="520" style="width:100%;max-width:520px;border-radius:6px;display:block;margin:0 0 12px;" />`
        : "";

      return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr>
      <td style="padding:16px;background:#1a1a1a;border-radius:10px;border:1px solid #2a2a2a;">
        ${imageHtml}
        <div style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;background:#34d399;color:#000;">
          ${escapeHtml(formatUpdateType(entry.updateType))}
        </div>
        <a href="${escapeHtml(changelogUrl)}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;line-height:1.3;display:block;margin-top:6px;">${escapeHtml(entry.resolvedTitle)}</a>
        <p style="color:#9ca3af;font-size:13px;margin:6px 0 0;line-height:1.5;">${escapeHtml(entry.resolvedSummary)}</p>
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

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    // Clean the name: trim whitespace, take just the first word as first name
    const firstName = (name || "").trim().split(/\s+/)[0] || "";

    if (!firstName) {
      return NextResponse.json({ error: "Please enter your name to subscribe." }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address. Please enter a valid email." }, { status: 400 });
    }

    const { data: existingSub } = await supabaseAdmin
      .from("blog_subscribers")
      .select("email")
      .eq("email", email)
      .single();

    if (existingSub) {
      return NextResponse.json(
        { message: "You are already subscribed to our updates!" },
        { status: 409 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("blog_subscribers")
      .insert({ email });

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { message: "You are already subscribed to our updates!" },
          { status: 409 }
        );
      }

      throw insertError;
    }

    const senderName = process.env.BREVO_SENDER_NAME || "Classgrid";
    const senderEmail = "noreply@classgrid.in";
    const supportEmail = "support@classgrid.in";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
    const unsubHash = generateUnsubscribeHash(email);
    const unsubscribeUrl = `${siteUrl}/api/blog/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubHash}`;

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


    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Classgrid Updates</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, html {
      margin: 0; padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0f0f0f;
      -webkit-font-smoothing: antialiased;
    }
    h1 { color: #ffffff; margin-top: 0; margin-bottom: 16px; font-size: 20px;}
    p { margin: 0 0 20px; color: #cccccc; font-size: 14px; line-height: 1.7; }
    ul { margin: 0 0 20px 20px; color: #cccccc; font-size: 14px; padding: 0; line-height: 1.7; }
    li { margin-bottom: 8px; }
    strong { color: #ffffff; }
    a { color: #ffffff; text-decoration: underline; }
    .btn {
      display: inline-block;
      background-color: #34d399;
      color: #000000 !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
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
<img src="https://classgrid.in/Classgrid.png" alt="Classgrid" width="48" height="48" style="display:block;margin:0 auto 16px;border-radius:6px;">
<h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.3px;">You're Subscribed!</h1>
<p style="color:#9ca3af;margin-top:10px;font-size:13px;line-height:1.6;margin-bottom:0;">Thanks for joining us.</p>
</td>
</tr>
<tr>
<td style="padding:32px 30px;color:#cccccc;font-size:14px;line-height:1.8;">
<p style="color:#ffffff;font-size:16px;font-weight:600;margin:0 0 20px;">${firstName ? `Hi ${escapeHtml(firstName)},` : `Hi there,`}</p>
<p style="color:#cccccc;font-size:14px;line-height:1.8;margin:0 0 16px;">You are now subscribed to receive the latest updates from the <strong style="color:#ffffff;">Classgrid Blog</strong> and <strong style="color:#ffffff;">Changelog</strong>.</p>
<p style="color:#cccccc;font-size:14px;line-height:1.8;margin:0 0 20px;">We'll keep you in the loop whenever we publish new product features, platform improvements, or practical insights on modern campus administration.</p>

${renderRecentBlogs(blogsWithImages, siteUrl)}
${renderRecentChangelogs(changelogsWithImages, siteUrl)}

${!hasContent ? `
<div style="margin-top:30px;padding-top:20px;border-top:1px solid #2a2a2a;background:#1a1a1a;border-radius:10px;padding:24px;text-align:center;">
  <p style="color:#34d399;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Stay Tuned</p>
  <p style="color:#cccccc;font-size:14px;margin:0 0 20px;line-height:1.7;">We are actively building new content and product updates. Check our blog and changelog regularly — we will keep updating!</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="${siteUrl}/blog" style="background:#34d399;color:#000;padding:10px 22px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;font-size:13px;">Visit Our Blog</a>
    <a href="${siteUrl}/changelog" style="background:#ffffff;color:#000;padding:10px 22px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;font-size:13px;">View Changelog</a>
  </div>
</div>` : `
<div style="text-align:center;margin:30px 0;">
<a href="${siteUrl}/blog" style="background:#34d399;color:#000;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">Read the Latest Insights</a>
</div>`}


<div style="margin-top:40px;padding-top:30px;border-top:1px solid #2a2a2a;">
  <p style="color:#cccccc;font-size:14px;margin:0 0 8px;">Build smarter academic workflows</p>
  <a href="${siteUrl}" style="color:#9ca3af;text-decoration:underline;font-size:13px;margin-bottom:24px;display:inline-block;">classgrid.in &rarr;</a>

  <div style="margin-bottom:24px;">
    <a href="https://www.instagram.com/classgridedu/" target="_blank" style="display:inline-block;border:1px solid #2a2a2a;border-radius:6px;padding:8px;margin-right:8px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="16" height="16" style="display:block;opacity:0.8;">
    </a>
    <a href="https://www.facebook.com/profile.php?id=61588646851017" target="_blank" style="display:inline-block;border:1px solid #2a2a2a;border-radius:6px;padding:8px;margin-right:8px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width="16" height="16" style="display:block;opacity:0.8;">
    </a>
    <a href="https://www.youtube.com/channel/UC3ayKBJSpgxEhQQD1Ux6SaA" target="_blank" style="display:inline-block;border:1px solid #2a2a2a;border-radius:6px;padding:8px;margin-right:8px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" width="16" height="16" style="display:block;opacity:0.8;">
    </a>
  </div>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="color:#7a7a7a;font-size:12px;text-align:left;">
        &copy; ${new Date().getFullYear()} Classgrid. All rights reserved.
      </td>
      <td style="color:#7a7a7a;font-size:12px;text-align:right;">
        <a href="${unsubscribeUrl}" style="color:#7a7a7a;text-decoration:none;">Unsubscribe</a>
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
      "Thanks for subscribing to the Classgrid Blog & Changelog.",
      "",
      ...(blogsWithImages.length > 0 ? [
        "Recent blog posts:",
        ...blogsWithImages.map((blog) => `- ${blog.resolvedTitle}: ${siteUrl}/blog/${blog.slug}`),
        "",
      ] : []),
      ...(changelogsWithImages.length > 0 ? [
        "Recent product updates:",
        ...changelogsWithImages.map((entry) => `- ${entry.resolvedTitle}: ${siteUrl}/changelog/${entry.slug}`),
        "",
      ] : []),
      ...(!hasContent ? [
        "We are actively building content. Check our blog at: " + siteUrl + "/blog",
        "And our changelog at: " + siteUrl + "/changelog",
        "We will keep updating — stay tuned!",
      ] : []),
    ].join("\n");

    const emailSubject = firstName
      ? `You're subscribed to Classgrid Updates, ${firstName}!`
      : "You're subscribed to Classgrid Updates!";


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
