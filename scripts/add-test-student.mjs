/**
 * Add tryfailnever25@gmail.com as a student to "Ambiguity Engineering College"
 * (same org as quantumchem25@gmail.com).
 */
import mongoose from "mongoose";
import crypto from "crypto";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI not set.");
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  console.log("✅ Connected to MongoDB");

  const email = "tryfailnever25@gmail.com";
  const orgId = new mongoose.Types.ObjectId("6a2d452b1c952d43497101c8"); // Ambiguity Engineering College

  // Check if user already exists
  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    console.log(`⚠️ User ${email} already exists! ID: ${existing._id}, Role: ${existing.role}`);
    await mongoose.disconnect();
    return;
  }

  // No password needed — user can login via Google OAuth or reset later
  const password = null;

  // Create the student user document matching the User schema
  const newUser = {
    name: "TryFailNever",
    email: email,
    alternateEmail: "",
    role: "student",
    additional_roles: [],
    dob: null,
    gender: null,
    admission_type: null,
    category: null,
    abc_id: null,
    anti_ragging_undertaking_no: null,
    status: "active",
    verification_status: "verified",
    organization_id: orgId,
    prn: "TFN2026001",
    branch: "Computer Engineering",
    batch: "2026-2027",
    profile_completed: true,
    subject: null,
    profilePicture: "",
    signature: "",
    phoneNumber: "",
    qualification: "",
    department: "",
    bio: "",
    address: "",
    hobby: "",
    subjectsAssigned: "",
    biometricId: null,
    payroll_config: { salary_mode: "none", hourly_rate: 0, base_monthly_salary: 0 },
    profileBanner: "",
    password: password,
    passwordExpiresAt: null,
    passwordChangedAt: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    activationToken: null,
    activationTokenExpires: null,
    activationCodeHash: null,
    activationCodeExpires: null,
    mustResetPassword: false,
    linkedProviders: ["manual"],
    authProvider: "manual",
    isEmailVerified: true,
    verificationToken: null,
    lastLoginAt: null,
    trustedDevices: [],
    pushNotifications: { global: true },
    fcmTokens: [],
    emailNotifications: {
      digestMode: "instant",
      lastDigestSentAt: null,
      global: true,
      announcements: true,
      notes: true,
      quizzes: true,
      joinApproval: true,
      emailOnPost: true,
      attendanceReportMode: "off",
    },
    is_demo: false,
    created_by: null,
    isSandbox: false,
    sandboxCreatedBy: null,
    sandboxPassword: null,
    loginAttempts: 0,
    lockUntil: null,
    resetAttempts: 0,
    resetAttemptsExpiresAt: null,
    google_access_token: null,
    google_refresh_token: null,
    google_token_expiry: null,
    zoom_access_token: null,
    zoom_refresh_token: null,
    zoom_token_expiry: null,
    webex_access_token: null,
    webex_refresh_token: null,
    webex_token_expiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);
  console.log(`✅ Student created successfully!`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: TryFail@2026`);
  console.log(`   Role: student`);
  console.log(`   Org: Ambiguity Engineering College`);
  console.log(`   MongoDB ID: ${result.insertedId}`);

  await mongoose.disconnect();
  console.log("Disconnected.");
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
