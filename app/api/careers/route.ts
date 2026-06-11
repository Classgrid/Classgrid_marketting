import { NextRequest, NextResponse } from "next/server";
import { getSmtpTransporter, getNoReplyAddress, sanitizeMailerError } from "@/lib/smtp-mailer";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, gender, email, phone, country, state, district, taluka, cityVillage, degree, yearOfStudy, college, branch, cgpa, currentOccupation, experience, availability, workType, role, techStack, skills, whyJoin, age18, twitter, github, linkedin, portfolio, codingProfile, openSource, asyncRemote, resumeUrl, termsConsent } = body;

    if (!email?.trim() || !firstName?.trim() || !lastName?.trim() || !role?.trim() || !phone?.trim() || !degree?.trim() || !yearOfStudy?.trim() || !termsConsent) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing or terms not accepted." },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const sanitizedName = escapeHtml(`${firstName.trim()} ${lastName.trim()}`);
    const sanitizedEmail = escapeHtml(email.trim().toLowerCase());
    const sanitizedPhone = escapeHtml(phone.trim());
    const sanitizedGender = escapeHtml(gender?.trim() || "Not provided");
    const sanitizedState = escapeHtml(state?.trim() || "Not provided");
    const sanitizedDistrict = escapeHtml(district?.trim() || "Not provided");
    const sanitizedTaluka = escapeHtml(taluka?.trim() || "Not provided");
    const sanitizedCityVillage = escapeHtml(cityVillage?.trim() || "Not provided");
    const sanitizedRole = escapeHtml(role.trim());
    const sanitizedDegree = escapeHtml(degree.trim());
    const sanitizedYearOfStudy = escapeHtml(yearOfStudy.trim());
    const sanitizedCollege = escapeHtml(college?.trim() || "Not provided");
    const sanitizedBranch = escapeHtml(branch?.trim() || "Not provided");
    const sanitizedCgpa = escapeHtml(cgpa?.trim() || "Not provided");
    const sanitizedCurrentOccupation = escapeHtml(currentOccupation?.trim() || "Not provided");
    const sanitizedExperience = escapeHtml(experience?.trim() || "Not provided");
    const sanitizedAvailability = escapeHtml(availability?.trim() || "Not provided");
    const sanitizedWorkType = escapeHtml(workType || "Not specified");
    const sanitizedGender = escapeHtml(gender || "Not specified");
    const sanitizedSkills = escapeHtml(skills || "Not provided");
    
    // New fields
    const sanitizedAge = escapeHtml(age18?.trim() || "Not provided");
    const sanitizedTwitter = escapeHtml(twitter?.trim() || "Not provided");
    const sanitizedGithub = escapeHtml(github?.trim() || "Not provided");
    const sanitizedLinkedin = escapeHtml(linkedin?.trim() || "Not provided");
    const sanitizedPortfolio = escapeHtml(portfolio?.trim() || "Not provided");
    const sanitizedCodingProfile = escapeHtml(codingProfile?.trim() || "Not provided");
    
    // Text areas & Arrays
    const techStackItems = (techStack || "").trim().split(",").map((s: string) => s.trim()).filter(Boolean);
    const techStackHtml = techStackItems.length > 0
      ? techStackItems.map((item: string) =>
          `<span style="display:inline-block;background:#10b981;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px;margin:3px 4px 3px 0;">${escapeHtml(item)}</span>`
        ).join("")
      : `<span style="color:#666;font-style:italic;">None selected</span>`;
    const sanitizedWhyJoin = escapeHtml((whyJoin || "").trim() || "Not provided").replace(/\n/g, "<br/>");
    const sanitizedOpenSource = escapeHtml((openSource || "").trim() || "Not provided").replace(/\n/g, "<br/>");
    const sanitizedAsyncRemote = escapeHtml((asyncRemote || "").trim() || "Not provided").replace(/\n/g, "<br/>");

    const transporter = getSmtpTransporter();

    await transporter.sendMail({
      from: getNoReplyAddress(),
      to: "support@classgrid.in",
      replyTo: sanitizedEmail,
      subject: `🚀 New Career Application: ${sanitizedName} for ${sanitizedRole}`,
      text: `New Career Application:\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nRole: ${sanitizedRole}\nLocation: ${sanitizedState} → ${sanitizedDistrict} → ${sanitizedTaluka} → ${sanitizedCityVillage}\nEducation: ${sanitizedDegree} (${sanitizedYearOfStudy})\nTech Stack: ${techStackItems.join(", ")}`,
      html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f0f0f;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://classgrid.in/Classgrid.png" alt="Classgrid" style="height:40px;" />
  </div>
  <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;padding:32px;">
    <h2 style="color:#ffffff;margin:0 0 24px;font-size:20px;">New Job Application</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;width:130px;vertical-align:top;">Name</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;font-weight:600;">${sanitizedName} (${sanitizedGender})</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Email</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;"><a href="mailto:${sanitizedEmail}" style="color:#10b981;text-decoration:none;">${sanitizedEmail}</a></td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Phone</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedPhone}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Gender</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedGender}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Location</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${escapeHtml(country || "India")} → ${sanitizedState} → ${sanitizedDistrict} → ${sanitizedTaluka}<br/><span style="color:#10b981;">City/Village: ${sanitizedCityVillage}</span></td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Role</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;font-weight:600;">${sanitizedRole} (${sanitizedWorkType})</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Professional Info</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedCurrentOccupation} • ${sanitizedExperience} Exp • Joining: ${sanitizedAvailability}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Education</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedDegree} in ${sanitizedBranch} (${sanitizedYearOfStudy})<br/>${sanitizedCollege} • CGPA: ${sanitizedCgpa}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Over 18?</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedAge}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">LinkedIn</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedLinkedin !== "Not provided" ? `<a href="${sanitizedLinkedin}" style="color:#10b981;text-decoration:none;">${sanitizedLinkedin}</a>` : "Not provided"}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">GitHub</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedGithub !== "Not provided" ? `<a href="${sanitizedGithub}" style="color:#10b981;text-decoration:none;">${sanitizedGithub}</a>` : "Not provided"}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Twitter / X</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedTwitter !== "Not provided" ? `<a href="${sanitizedTwitter}" style="color:#10b981;text-decoration:none;">${sanitizedTwitter}</a>` : "Not provided"}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Portfolio</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedPortfolio !== "Not provided" ? `<a href="${sanitizedPortfolio}" style="color:#10b981;text-decoration:none;">${sanitizedPortfolio}</a>` : "Not provided"}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Coding Profile</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${sanitizedCodingProfile !== "Not provided" ? `<a href="${sanitizedCodingProfile}" style="color:#10b981;text-decoration:none;">${sanitizedCodingProfile}</a>` : "Not provided"}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Resume</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">${resumeUrl ? `<a href="${resumeUrl}" style="color:#10b981;text-decoration:none;font-weight:bold;">📥 Download Resume</a>` : "No resume attached"}</td>
      </tr>
    </table>
    
    <div style="margin-top:24px;padding:20px;background:#111;border:1px solid #2a2a2a;border-radius:12px;">
      <p style="color:#888;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Tech Stack (${techStackItems.length} selected)</p>
      <div style="margin:0;line-height:2;">${techStackHtml}</div>
    </div>

    <div style="margin-top:16px;padding:20px;background:#111;border:1px solid #2a2a2a;border-radius:12px;">
      <p style="color:#888;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Additional Skills</p>
      <div style="color:#e0e0e0;font-size:14px;line-height:1.8;margin:0;word-wrap:break-word;word-break:break-word;overflow-wrap:break-word;">${sanitizedSkills}</div>
    </div>

    <div style="margin-top:16px;padding:20px;background:#111;border:1px solid #2a2a2a;border-radius:12px;">
      <p style="color:#888;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Why Join Classgrid?</p>
      <div style="color:#e0e0e0;font-size:14px;line-height:1.8;margin:0;word-wrap:break-word;word-break:break-word;overflow-wrap:break-word;">${sanitizedWhyJoin}</div>
    </div>

    <div style="margin-top:16px;padding:20px;background:#111;border:1px solid #2a2a2a;border-radius:12px;">
      <p style="color:#888;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Open Source Contributions</p>
      <div style="color:#e0e0e0;font-size:14px;line-height:1.8;margin:0;word-wrap:break-word;word-break:break-word;overflow-wrap:break-word;">${sanitizedOpenSource}</div>
    </div>

    <div style="margin-top:16px;padding:20px;background:#111;border:1px solid #2a2a2a;border-radius:12px;">
      <p style="color:#888;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Async / Remote Experience</p>
      <div style="color:#e0e0e0;font-size:14px;line-height:1.8;margin:0;word-wrap:break-word;word-break:break-word;overflow-wrap:break-word;">${sanitizedAsyncRemote}</div>
    </div>
  </div>
  <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #1a1a1a;">
    <p style="color:#555;font-size:11px;margin:0;">Submitted via <a href="https://classgrid.in/careers" style="color:#10b981;text-decoration:none;">classgrid.in/careers</a></p>
  </div>
</div>
</body></html>`,
      ...(resumeUrl && {
        attachments: [
          {
            filename: `Resume_${sanitizedName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
            href: resumeUrl,
          },
        ],
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
    });
  } catch (err: unknown) {
    const sanitized = sanitizeMailerError(err);
    console.error("[Careers] Form submission error:", sanitized.message);
    return NextResponse.json(
      { success: false, message: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
