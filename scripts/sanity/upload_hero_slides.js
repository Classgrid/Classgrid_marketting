const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a4wk6kp5',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2026-04-20',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function uploadHeroSlides() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("❌ Missing SANITY_API_WRITE_TOKEN. Please ensure it's in your .env.local file.");
    process.exit(1);
  }

  console.log("🚀 Starting upload to Sanity...");

  const slides = [
    {
      _key: "slide-1",
      _type: "homeShowcaseSlide",
      label: "Overview",
      headline: "All-in-One ERP for Schools, Colleges & Coaching Institutes",
      body: "ClassGrid is a comprehensive education management platform designed to simplify and streamline the operations of schools, colleges, and coaching institutes. From admissions and student lifecycle management to fee collection, attendance tracking, academic planning, and communication, ClassGrid brings every critical function into a single unified system.\n\nOur platform helps institutions eliminate manual processes, reduce operational errors, and improve overall efficiency through automation and real-time insights.",
      subtitle: "With a user-friendly interface and scalable architecture, ClassGrid adapts to the unique needs of institutions of all sizes, ensuring seamless coordination between administrators, teachers, students, and parents."
    },
    {
      _key: "slide-2",
      _type: "homeShowcaseSlide",
      label: "Automation",
      headline: "Focus: Automation & Efficiency",
      body: "ClassGrid transforms the way educational institutions handle daily operations by automating repetitive tasks and centralizing critical workflows. From managing admissions and generating reports to tracking attendance and processing fee payments, every function is streamlined into a single platform.\n\nThis reduces administrative burden, minimizes human errors, and allows staff to focus more on delivering quality education instead of handling manual processes.",
      subtitle: "This reduces administrative burden, minimizes human errors, and allows staff to focus more on delivering quality education instead of handling manual processes."
    },
    {
      _key: "slide-3",
      _type: "homeShowcaseSlide",
      label: "Analytics",
      headline: "Powerful Analytics and Real-Time Reporting",
      body: "With powerful analytics and real-time reporting, ClassGrid gives institutions complete visibility into their operations. Administrators can monitor financial performance, track student progress, and analyze key metrics from a unified dashboard.\n\nThese insights enable faster, data-driven decision-making, helping institutions improve performance, identify gaps, and plan more effectively for the future.",
      subtitle: "These insights enable faster, data-driven decision-making, helping institutions improve performance, identify gaps, and plan more effectively for the future."
    },
    {
      _key: "slide-4",
      _type: "homeShowcaseSlide",
      label: "Communication",
      headline: "Focus: Communication & Collaboration",
      body: "Effective communication is at the core of every successful institution, and ClassGrid ensures seamless interaction between administrators, teachers, students, and parents.\n\nThrough integrated messaging, notifications, and updates, everyone stays informed and connected. This improves transparency, strengthens engagement, and creates a more collaborative educational environment.",
      subtitle: "Through integrated messaging, notifications, and updates, everyone stays informed and connected. This improves transparency, strengthens engagement, and creates a more collaborative educational environment."
    },
    {
      _key: "slide-5",
      _type: "homeShowcaseSlide",
      label: "Scalability",
      headline: "Focus: Scalability & Flexibility",
      body: "Designed to grow with your institution, ClassGrid offers a flexible and scalable architecture that adapts to your evolving needs. Whether you are managing a small coaching institute or a large multi-campus university, the platform provides the tools and customization required to support your operations.\n\nIts modern design and intuitive interface ensure quick adoption and a smooth user experience across all users.",
      subtitle: "Its modern design and intuitive interface ensure quick adoption and a smooth user experience across all users."
    }
  ];

  try {
    // We update the singleton 'homePage' document. If it doesn't exist, this might fail,
    // so we use createIfNotExists first.
    const homePageId = 'homePage'; 
    
    // Ensure the document exists
    await client.createIfNotExists({
      _id: homePageId,
      _type: 'homePage',
      brandName: 'Classgrid',
      headline: 'Empowering Schools, Colleges, and Coaching Institutes',
    });

    console.log("📝 Patching the homepage document with the new slider content...");

    // Patch the showcaseSlides array
    await client
      .patch(homePageId)
      .set({ showcaseSlides: slides })
      .commit();

    console.log("✅ Successfully uploaded Hero Slides to Sanity!");
    console.log("➡️ You can now open Sanity Studio to attach the images to each slide.");
  } catch (error) {
    console.error("❌ Error uploading to Sanity:", error.message);
  }
}

uploadHeroSlides();
