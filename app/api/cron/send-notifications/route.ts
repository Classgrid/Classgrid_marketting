import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { supabaseAdmin } from "@/lib/supabase";
import { connectMongo } from "@/lib/mongodb";
import mongoose from "mongoose";

// ─── Types ───────────────────────────────────────────────────────────────────
type QueueItem = {
  id: string;
  document_type: "post" | "changelogEntry" | "legalPage";
  document_id: string;
  slug: string;
  title: string | null;
  status: string;
  retry_count: number;
  max_retries: number;
};

// ─── SMTP Transporters ───────────────────────────────────────────────────────
// Primary: Brevo (300/day free — we reserve 50 for demos, use 250 for subscribers)
const brevoTransporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

// Fallback: Resend (100/day free via updates.classgrid.in)
const resendTransporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  secure: false,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// High-Priority Transactional: AWS SES (For Legal Pages)
const awsSesTransporter = nodemailer.createTransport({
  host: process.env.AWS_SES_SMTP_HOST || "email-smtp.eu-north-1.amazonaws.com",
  port: Number(process.env.AWS_SES_SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_SMTP_USER,
    pass: process.env.AWS_SES_SMTP_PASS,
  },
});

// Track which provider to use — starts with Brevo, falls back to Resend
let useResendFallback = false;

// ─── Utility Functions ───────────────────────────────────────────────────────
function getLocalizedString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value || fallback;
  if (value && typeof value === "object") {
    const loc = value as { en?: unknown; hi?: unknown; mr?: unknown };
    if (typeof loc.en === "string" && loc.en) return loc.en;
    if (typeof loc.hi === "string" && loc.hi) return loc.hi;
    if (typeof loc.mr === "string" && loc.mr) return loc.mr;
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
  if (typeof image === "string") return image;
  try {
    return urlFor(image).width(width).url();
  } catch {
    return null;
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

function formatUpdateType(value: string | null | undefined): string {
  switch (value) {
    case "feature": return "New Feature";
    case "improvement": return "Improvement";
    case "bugfix": return "Bug Fix";
    default: return "Update";
  }
}

function formatDate(dateValue: string | null | undefined): string {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function generateUnsubscribeHash(email: string): string {
  const secret = process.env.SANITY_WEBHOOK_SECRET || "classgrid_fallback";
  return crypto.createHmac("sha256", secret).update(email).digest("hex").slice(0, 32);
}

// ─── Email HTML Renderers ────────────────────────────────────────────────────
function renderRecentBlogs(
  blogs: Array<{ slug: string; resolvedTitle: string; resolvedExcerpt: string; imageUrl: string | null }>,
  siteUrl: string
) {
  if (blogs.length === 0) return "";
  return `
<div style="margin-top:40px;padding-top:30px;border-top:1px solid #eaeaea;">
  <h3 style="color:#111111;font-size:16px;margin:0 0 20px;font-weight:700;">Recent from the Blog</h3>
  ${blogs.map((blog) => {
    const postUrl = `${siteUrl}/blog/${blog.slug}`;
    const imageHtml = blog.imageUrl
      ? `<img src="${escapeHtml(blog.imageUrl)}" alt="${escapeHtml(blog.resolvedTitle)}" width="520" style="width:100%;max-width:520px;border-radius:6px;display:block;margin:0 0 12px;" />`
      : "";
    return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr>
      <td style="padding:16px;background:#f9f9f9;border-radius:10px;border:1px solid #eaeaea;">
        ${imageHtml}
        <a href="${escapeHtml(postUrl)}" style="color:#111111;font-size:15px;font-weight:600;text-decoration:none;line-height:1.3;">${escapeHtml(blog.resolvedTitle)}</a>
        <p style="color:#6b7280;font-size:13px;margin:6px 0 0;line-height:1.5;">${escapeHtml(blog.resolvedExcerpt)}</p>
      </td>
    </tr>
  </table>`;
  }).join("")}
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
  ${changelogs.map((entry) => {
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
  }).join("")}
</div>`;
}

function buildNotificationEmailHtml(
  post: any,
  unsubscribeUrl: string,
  recentBlogs: Array<{ slug: string; resolvedTitle: string; resolvedExcerpt: string; imageUrl: string | null }>,
  recentChangelogs: Array<{
    slug: string; resolvedTitle: string; resolvedSummary: string;
    imageUrl: string | null; updateType: string | null | undefined;
  }>
): string {
  const currentYear = new Date().getFullYear();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
  const isChangelog = post._type === "changelogEntry";
  const isLegalPage = post._type === "legalPage";
  
  let itemUrl = `${siteUrl}/blog/${post.slug}`;
  if (isChangelog) itemUrl = `${siteUrl}/changelog/${post.slug}`;
  if (isLegalPage) itemUrl = `${siteUrl}/${post.slug}`; // Assuming legal pages live at /privacy, /terms, etc.
  
  const coverImageHtml = post.coverImage
    ? `<img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.resolvedTitle)}" width="600" style="width:100%;max-width:600px;border-radius:8px;display:block;margin:0 auto 20px;" />`
    : "";
  const metaLine = isChangelog
    ? [formatUpdateType(post.updateType), post.versionLabel ? `Version ${post.versionLabel}` : "", formatDate(post.releaseDate)]
        .filter(Boolean).join(" | ")
    : (() => {
        const names = (post.authorNames && post.authorNames.length > 0)
          ? post.authorNames.join(' & ')
          : (post.author || 'Classgrid Team');
        return [`By ${names}`, formatDate(post.publishedAt)].filter(Boolean).join(' | ');
      })();
  let summary = post.resolvedSummary;
  let ctaLabel = "Read Blog";
  let eyebrow = "";
  let legalSubject = "";
  
  if (isChangelog) {
    summary = post.resolvedSummary || "We just published a new update. Click below to read the full entry.";
    ctaLabel = "View Product Update";
    eyebrow = "";
  } else if (isLegalPage) {
    const effectiveDateStr = post._updatedAt ? formatDate(post._updatedAt) : "immediately";
    const changeSummary = post.resolvedSummary || "Important updates to our legal terms and policies.";

    switch (post.slug) {
      case "privacy":
        eyebrow = "Notice of changes to our Privacy Policy";
        summary = `We are writing to notify you that Classgrid Technologies has updated its Privacy Policy. The revised policy explains how personal information is collected, used, disclosed, retained, and protected in connection with the Services.<br><br><b>Changes included in this update:</b><br>${changeSummary}<br><br>The updated Privacy Policy will take effect on ${effectiveDateStr}. The update does not change any rights or choices that apply to you except as expressly described in the revised policy. If the update affects a consent choice or legal right available in your jurisdiction, the relevant instructions are included in the policy.`;
        ctaLabel = "Review the updated Privacy Policy";
        break;
      case "terms":
        eyebrow = "Updates to the Terms of Service";
        summary = `We are notifying you that Classgrid Technologies has updated its Terms of Service governing access to and use of the Services.<br><br><b>Changes included in this update:</b><br>${changeSummary}<br><br>The revised Terms of Service will take effect on ${effectiveDateStr}. Please review the revised terms carefully, including provisions concerning permitted use, account responsibilities, fees, intellectual property, limitations of liability, dispute resolution, and termination.`;
        ctaLabel = "Review the updated Terms of Service";
        break;
      case "security":
        eyebrow = "Information Security Policy update";
        summary = `Classgrid Technologies has updated its Information Security Policy describing the technical, organizational, and administrative measures used to protect information and maintain the security of the Services.<br><br><b>Changes included in this update:</b><br>${changeSummary}<br><br>The revised policy is effective ${effectiveDateStr}. This notice does not disclose confidential security information, operational vulnerabilities, credentials, or details that could increase security risk.`;
        ctaLabel = "Review the updated Security Policy";
        break;
      case "cookies":
        eyebrow = "Changes to our Cookies Policy";
        summary = `We have updated our Cookies Policy to explain how Classgrid Technologies and approved service providers use cookies and similar technologies on the Services.<br><br><b>Changes included in this update:</b><br>${changeSummary}<br><br>The revised Cookies Policy identifies the categories of technologies used, their purposes, retention periods, providers, and available controls. It takes effect on ${effectiveDateStr}. Where consent is required, non-essential cookies will be used only after the applicable consent is obtained or as otherwise permitted by law.`;
        ctaLabel = "Review the updated Cookies Policy";
        break;
      case "disclaimer":
        eyebrow = "Notice of changes to our Disclaimer";
        summary = `Classgrid Technologies has updated its Disclaimer concerning the information, materials, content, and services made available through the platform.<br><br><b>Changes included in this update:</b><br>${changeSummary}<br><br>The revised Disclaimer is effective ${effectiveDateStr}. Please read the complete Disclaimer because this notice is only a summary of the principal changes. The Disclaimer does not exclude or limit any liability, warranty, or right that cannot lawfully be excluded or limited.`;
        ctaLabel = "Review the updated Disclaimer";
        break;
      default:
        eyebrow = "Important Legal Update";
        summary = `We have updated our legal policies.<br><br><b>Changes included in this update:</b><br>${changeSummary}<br><br>Click below to review the changes.`;
        ctaLabel = "Review Policy";
    }
  } else {
    summary = post.resolvedSummary || "We just published a new update. Click below to read the full post.";
    ctaLabel = "Read Blog";
    eyebrow = "";
  }

  const headerTitle = isLegalPage ? "Classgrid Legal Notice" : "New from Classgrid";

  return `<!DOCTYPE html>
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
<h1 style="color:#111111;margin:0;font-size:22px;">${escapeHtml(headerTitle)}</h1>
${eyebrow ? `<p style="color:#6b7280;margin-top:8px;font-size:13px;">${escapeHtml(eyebrow)}</p>` : ""}
</td>
</tr>
<tr>
<td style="padding:30px;color:#374151;font-size:14px;line-height:1.7;">
${coverImageHtml}
<h2 style="color:#111111;font-size:20px;margin:0 0 8px;line-height:1.3;">${escapeHtml(post.resolvedTitle)}</h2>
${metaLine && !isLegalPage ? `<p style="color:#6b7280;font-size:12px;margin:0 0 20px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">${escapeHtml(metaLine)}</p>` : ""}
<p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 25px;">${isLegalPage ? summary : escapeHtml(summary)}</p>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(itemUrl)}" style="background:#34d399;color:#000;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block;">${escapeHtml(ctaLabel)}</a>
</div>

${isLegalPage ? "" : renderRecentBlogs(recentBlogs, siteUrl)}
${isLegalPage ? "" : renderRecentChangelogs(recentChangelogs, siteUrl)}

${isLegalPage ? "" : `
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #eaeaea;text-align:center;">
  <p style="color:#111111;font-size:14px;font-weight:600;margin-bottom:16px;">Follow us for more updates</p>
  <div style="display:inline-block;">
    <a href="https://www.instagram.com/classgridedu/" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="24" height="24" style="opacity:0.8;">
    </a>
    <a href="https://www.facebook.com/profile.php?id=61588646851017" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width="24" height="24" style="opacity:0.8;">
    </a>
    <a href="https://www.youtube.com/@classgrid-y7f" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" width="24" height="24" style="opacity:0.8;">
    </a>
  </div>
</div>
`}


</td>
</tr>
<tr>
<td style="padding:20px;text-align:center;border-top:1px solid #eaeaea;color:#9ca3af;font-size:12px;">
<p style="margin-bottom:8px;color:#9ca3af;font-size:12px;">You received this because you subscribed to Classgrid Updates.</p>
<p style="margin-bottom:12px;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#6b7280;text-decoration:underline;font-size:11px;">Unsubscribe from these emails</a></p>
&copy; ${currentYear} Classgrid. All rights reserved.
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ─── Cron Processing Logic ───────────────────────────────────────────────────
async function processQueueItem(item: QueueItem, alreadySent: number = 0): Promise<{ sent: number; failed: number; done: boolean; totalProcessed?: number }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
  const senderName = "Classgrid";
  // Brevo sends from noreply@classgrid.in, Resend sends from notification@updates.classgrid.in
  const brevoSenderEmail = "noreply@classgrid.in";
  const resendSenderEmail = "notification@updates.classgrid.in";
  const supportEmail = "support@classgrid.in";

  // 1. Fetch the full document from Sanity
  const [publishedDocument, recentBlogs, recentChangelogs] = await Promise.all([
    item.document_type === "post"
      ? client.fetch(
          `*[_type == "post" && _id == $documentId][0]{
            _id, _type, title, "slug": slug.current, excerpt, publishedAt, coverImage, author, "authorNames": authors[].name
          }`,
          { documentId: item.document_id }
        )
      : item.document_type === "changelogEntry"
      ? client.fetch(
          `*[_type == "changelogEntry" && _id == $documentId][0]{
            _id, _type, title, "slug": slug.current, summary, releaseDate, updateType, versionLabel, image
          }`,
          { documentId: item.document_id }
        )
      : client.fetch(
          `*[_type == "legalPage" && _id == $documentId][0]{
            _id, _type, title, "slug": slug.current, summary, _updatedAt
          }`,
          { documentId: item.document_id }
        ),
    client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...4]{
      _id, title, "slug": slug.current, excerpt, publishedAt, coverImage
    }`),
    client.fetch(`*[_type == "changelogEntry"] | order(releaseDate desc)[0...4]{
      _id, title, "slug": slug.current, summary, releaseDate, updateType, image
    }`),
  ]);

  if (!publishedDocument?.slug) {
    throw new Error(`Document not found in Sanity: ${item.document_id}`);
  }

  // 2. Resolve the main post
  let resolvedPost: any = { ...publishedDocument };
  if (item.document_type === "post") {
    resolvedPost.resolvedTitle = getLocalizedString(publishedDocument.title, "Blog Post");
    resolvedPost.resolvedSummary = truncateText(getLocalizedString(publishedDocument.excerpt, "New from Classgrid."), 220);
    resolvedPost.coverImage = resolveImageUrl(publishedDocument.coverImage, 600);
  } else if (item.document_type === "changelogEntry") {
    resolvedPost.resolvedTitle = getLocalizedString(publishedDocument.title, "Product Update");
    resolvedPost.resolvedSummary = truncateText(getLocalizedString(publishedDocument.summary, "New from Classgrid."), 220);
    resolvedPost.coverImage = resolveImageUrl(publishedDocument.image, 600);
  } else if (item.document_type === "legalPage") {
    resolvedPost.resolvedTitle = getLocalizedString(publishedDocument.title, "Legal Update");
    resolvedPost.resolvedSummary = getLocalizedString(publishedDocument.summary, "Important updates to our legal terms and policies.");
    resolvedPost.legalSubject = ""; // Set by buildNotificationEmailHtml but we need it here for the Subject line of the email.
  }

  // 3. Resolve recent items (exclude current)
  const blogsWithImages = ((recentBlogs as any[]) || [])
    .filter((b: any) => !(item.document_type === "post" && b._id === resolvedPost._id))
    .map((b: any) => ({
      ...b,
      resolvedTitle: getLocalizedString(b.title, "Blog Post"),
      resolvedExcerpt: truncateText(getLocalizedString(b.excerpt, "Read the latest insight from Classgrid.")),
      imageUrl: resolveImageUrl(b.coverImage, 560),
    }))
    .filter((b) => b.slug && b.resolvedTitle)
    .slice(0, 3);

  const changelogsWithImages = ((recentChangelogs as any[]) || [])
    .filter((c: any) => !(item.document_type === "changelogEntry" && c._id === resolvedPost._id))
    .map((c: any) => ({
      ...c,
      resolvedTitle: getLocalizedString(c.title, "Product Update"),
      resolvedSummary: truncateText(getLocalizedString(c.summary, "Explore the latest Classgrid release update.")),
      imageUrl: resolveImageUrl(c.image, 560),
    }))
    .filter((c) => c.slug && c.resolvedTitle)
    .slice(0, 3);

  // 4. Fetch audiences
  let targetEmails: { email: string }[] = [];
  
  // Fetch active subscribers
  const { data: subscribers, error: subError } = await supabaseAdmin
    .from("blog_subscribers")
    .select("email")
    .eq("is_active", true);

  if (subscribers) {
    targetEmails.push(...subscribers);
  }

  // Fetch admin users from MongoDB for ALL updates (Blog, Changelog, and Legal)
  try {
    await connectMongo();
    if (mongoose.connection.db) {
      const usersCollection = mongoose.connection.db.collection('users');
      // Fetch ALL users regardless of role
      const allUsers = await usersCollection.find(
        {},
        { projection: { email: 1 } }
      ).toArray();
      
      targetEmails.push(...allUsers.map(u => ({ email: u.email })));
    }
  } catch (dbErr) {
    console.error("Failed to fetch admins from MongoDB:", dbErr);
  }

  // Fallback: Always ensure the core founder team receives these notifications,
  // even if MongoDB Atlas blocks the connection due to IP whitelisting.
  targetEmails.push({ email: "support@classgrid.in" });

  // Deduplicate emails
  const uniqueEmails = Array.from(
    new Map(
      targetEmails
        .filter(u => u.email)
        .map(u => [u.email.toLowerCase(), u])
    ).values()
  );

  if (uniqueEmails.length === 0) {
    return { sent: 0, failed: 0, done: true };
  }

  // 5. Build subject and send to a BATCH of subscribers
  // We only send BATCH_SIZE emails per cron invocation to stay under Vercel timeouts.
  // 14 emails/sec * 6.5 seconds = ~90 emails safely per Vercel run.
  const BATCH_SIZE = item.document_type === "legalPage" ? 90 : 25;
  const startIndex = alreadySent;
  const batch = uniqueEmails.slice(startIndex, startIndex + BATCH_SIZE);

  if (batch.length === 0) {
    // All subscribers already emailed
    return { sent: 0, failed: 0, done: true };
  }

  let subject = item.document_type === "changelogEntry"
    ? `Product Update: ${resolvedPost.resolvedTitle}`
    : `New Post: ${resolvedPost.resolvedTitle}`;

  // If it's a legal page, we generate the specific subject here again so it perfectly matches the HTML.
  if (item.document_type === "legalPage") {
    const effectiveDateStr = resolvedPost._updatedAt ? formatDate(resolvedPost._updatedAt) : "immediately";
    switch (item.slug) {
      case "privacy": subject = `Important update to our Privacy Policy — effective ${effectiveDateStr}`; break;
      case "terms": subject = `Notice of updates to our Terms of Service — effective ${effectiveDateStr}`; break;
      case "security": subject = "Update to our Information Security Policy"; break;
      case "cookies": subject = `Update to our Cookies Policy — effective ${effectiveDateStr}`; break;
      case "disclaimer": subject = "Update to our Disclaimer"; break;
      default: subject = "Important Legal Update";
    }
  }

  let sentCount = 0;
  let failCount = 0;

  // Process the batch in parallel chunks of 7 (for legal) to strictly obey the 14/sec SES limit
  const CONCURRENCY_LIMIT = item.document_type === "legalPage" ? 7 : 10;
  for (let i = 0; i < batch.length; i += CONCURRENCY_LIMIT) {
    const chunk = batch.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(
      chunk.map(async (sub) => {
        try {
          const hash = generateUnsubscribeHash(sub.email);
          const unsubscribeUrl = `${siteUrl}/api/blog/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${hash}`;

          const mailOptions = {
            replyTo: supportEmail,
            to: sub.email,
            subject,
            text: `${resolvedPost.resolvedTitle}\n${resolvedPost.resolvedSummary}\n\nRead: ${siteUrl}/${item.document_type === "changelogEntry" ? "changelog" : "blog"}/${resolvedPost.slug}`,
            html: buildNotificationEmailHtml(resolvedPost, unsubscribeUrl, blogsWithImages, changelogsWithImages),
          };

          if (item.document_type === "legalPage") {
            // Legal Pages MUST go through AWS SES
            await awsSesTransporter.sendMail({
              ...mailOptions,
              from: `"Classgrid Legal" <legal@classgrid.in>`,
            });
            sentCount++;
            console.log(`📨 Sent legal update to ${sub.email} via AWS SES`);
          } else {
            // Blog/Changelog Promotional emails use Brevo/Resend
            if (!useResendFallback) {
              try {
                await brevoTransporter.sendMail({
                  ...mailOptions,
                  from: `"${senderName}" <${brevoSenderEmail}>`,
                });
                sentCount++;
                return;
              } catch (brevoErr: any) {
                const errMsg = brevoErr?.message || "";
                if (errMsg.includes("421") || errMsg.includes("429") || errMsg.includes("limit") || errMsg.includes("Too many")) {
                  console.log(`⚡ Brevo daily limit reached. Switching to Resend fallback...`);
                  useResendFallback = true;
                } else {
                  console.error(`Failed to send to ${sub.email} via Brevo:`, errMsg);
                  failCount++;
                  return;
                }
              }
            }

            // Resend fallback
            await resendTransporter.sendMail({
              ...mailOptions,
              from: `"${senderName}" <${resendSenderEmail}>`,
            });
            sentCount++;
            console.log(`📨 Sent to ${sub.email} via Resend fallback`);
          }
        } catch (err: any) {
          console.error(`Failed to send to ${sub.email}:`, err?.message || err);
          failCount++;
        }
      })
    );

    // If sending legal updates via SES, pause for 500ms to guarantee we stay under the 14/sec limit
    if (item.document_type === "legalPage" && i + CONCURRENCY_LIMIT < batch.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const totalProcessed = startIndex + sentCount + failCount;
  const allDone = totalProcessed >= uniqueEmails.length;

  return { sent: sentCount, failed: failCount, done: allDone, totalProcessed };
}

// ─── GET handler (Cron endpoint) ─────────────────────────────────────────────
// Usage:
//   GET /api/cron/send-notifications?type=all     → process both blog + changelog
//   GET /api/cron/send-notifications?type=post    → process only blog
//   GET /api/cron/send-notifications?type=changelogEntry → process only changelog
//
// Protected by CRON_SECRET header to prevent unauthorized access.
export async function GET(req: Request) {
  // 1. Auth check (supports both header and query param for cron-job.org free tier)
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const querySecret = searchParams.get("secret");

  const isAuthorized =
    !cronSecret ||
    authHeader === `Bearer ${cronSecret}` ||
    querySecret === cronSecret;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse type filter
  const typeFilter = searchParams.get("type") || "all";

  const validTypes = ["all", "post", "changelogEntry", "legalPage"];
  if (!validTypes.includes(typeFilter)) {
    return NextResponse.json({ error: `Invalid type. Use: ${validTypes.join(", ")}` }, { status: 400 });
  }

  try {
    // 3. Reset stale "processing" items (stuck for > 10 min)
    await supabaseAdmin
      .from("email_notification_queue")
      .update({ status: "pending" })
      .eq("status", "processing")
      .lt("processed_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

    // 4. Fetch pending items + failed items that haven't exceeded retries
    let query = supabaseAdmin
      .from("email_notification_queue")
      .select("*")
      .or("status.eq.pending,status.eq.failed")
      .lt("retry_count", 3)
      .order("created_at", { ascending: true })
      .limit(10);

    if (typeFilter !== "all") {
      query = query.eq("document_type", typeFilter);
    }

    const { data: queueItems, error: fetchError } = await query;

    if (fetchError) {
      console.error("Queue fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch queue" }, { status: 500 });
    }

    if (!queueItems || queueItems.length === 0) {
      return NextResponse.json({ message: "No pending notifications.", processed: 0 }, { status: 200 });
    }

    // 5. Process each item
    const results: Array<{ id: string; documentType: string; slug: string; status: string; sent?: number; failed?: number; error?: string }> = [];

    for (const item of queueItems) {
      // Mark as processing
      await supabaseAdmin
        .from("email_notification_queue")
        .update({ status: "processing", processed_at: new Date().toISOString() })
        .eq("id", item.id);

      try {
        // Pass sent_count as offset so we resume from where the last cron run left off
        const alreadySent = item.sent_count || 0;
        const { sent, failed, done, totalProcessed } = await processQueueItem(item as QueueItem, alreadySent);

        if (done) {
          // All subscribers have been emailed — mark as sent
          await supabaseAdmin
            .from("email_notification_queue")
            .update({
              status: "sent",
              sent_count: (alreadySent + sent),
              failed_count: (item.failed_count || 0) + failed,
              processed_at: new Date().toISOString(),
              error_message: null,
            })
            .eq("id", item.id);

          results.push({
            id: item.id,
            documentType: item.document_type,
            slug: item.slug,
            status: "sent",
            sent: alreadySent + sent,
            failed: (item.failed_count || 0) + failed,
          });

          console.log(`✅ Completed ${item.document_type} "${item.title}" — total ${alreadySent + sent} sent`);
        } else {
          // More subscribers remain — keep as "pending" so next cron picks it up
          await supabaseAdmin
            .from("email_notification_queue")
            .update({
              status: "pending",
              sent_count: totalProcessed || (alreadySent + sent),
              failed_count: (item.failed_count || 0) + failed,
              processed_at: new Date().toISOString(),
              error_message: null,
            })
            .eq("id", item.id);

          results.push({
            id: item.id,
            documentType: item.document_type,
            slug: item.slug,
            status: "partial",
            sent: alreadySent + sent,
          });

          console.log(`⏳ Partial ${item.document_type} "${item.title}" — ${totalProcessed}/${alreadySent + sent + failed} done, resuming next cron`);
        }
      } catch (processError: any) {
        const errorMsg = processError?.message || "Unknown error";
        const newRetryCount = (item.retry_count || 0) + 1;
        const newStatus = newRetryCount >= (item.max_retries || 3) ? "exhausted" : "failed";

        await supabaseAdmin
          .from("email_notification_queue")
          .update({
            status: newStatus,
            retry_count: newRetryCount,
            error_message: errorMsg,
            processed_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        results.push({
          id: item.id,
          documentType: item.document_type,
          slug: item.slug,
          status: "failed",
          error: errorMsg,
        });

        console.error(`❌ Failed ${item.document_type} "${item.title}": ${errorMsg} (retry ${newRetryCount}/${item.max_retries || 3})`);
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} notification(s).`,
      processed: results.length,
      typeFilter,
      results,
    }, { status: 200 });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
