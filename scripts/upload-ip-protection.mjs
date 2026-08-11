import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

// ── ENGLISH ──────────────────────────────────────────────────────────────────
const enDoc = {
  _type: "ipProtectionPage",
  _id: "ip-protection-page-en",
  language: "en",
  content: {
    title: "Intellectual Property (IP) Protection Policy",
    subtitle: "Company: Classgrid (A Product of Classgrid, MSME Registered) • MSME Registration: UDYAM-MH-01-0308803 • Category: Services — Computer Programming Activities (NIC Code: 62011)",
    effective: "Effective Date: August 11, 2026",
    updated: "Last Updated: August 11, 2026",
    back: "Back to Classgrid",
    print: "Print",
    onThisPage: "On This Page",
    footerContact: "For any questions regarding Classgrid's intellectual property, licensing, or legal matters, please contact:",
    footerNote1: "This document is issued by Classgrid and may be updated from time to time. The latest version is always available on the Classgrid website: ",
    footerNote2: "© 2026 Classgrid. All rights reserved.",
    p1: "This document explains how Classgrid protects its intellectual property (IP) and why Classgrid, as a Software-as-a-Service (SaaS) platform, does not require a patent. This policy is intended for students, faculty, partners, investors, and anyone who wishes to understand how Classgrid's IP is safeguarded.",
    p2: "Classgrid is a cloud-based Education Operating System (Education ERP) designed for schools, colleges, coaching institutes, junior colleges, and engineering institutions. It provides a unified platform for managing academic, administrative, financial, and operational workflows.",
    p2_highlight: "Classgrid is a commercial SaaS product — not a research invention, hardware device, or algorithm that would typically require a patent.",
    p3_1: "3.1 SaaS Products Are Rarely Patented",
    p3_1_desc: "In the global software industry, Software-as-a-Service (SaaS) products are almost never patented. This is the industry standard followed by some of the world's most successful technology companies:",
    p3_1_outro: "These companies protect their IP through other legally recognized methods (see Section 4 below).",
    p3_2: "3.2 Software Patents Are Restrictive and Impractical",
    p3_2_desc: "Indian Patent Law (The Patents Act, 1970): Section 3(k) explicitly states that \"a mathematical or business method or a computer programme per se or algorithms\" are not patentable in India. Classgrid's core functionality — managing attendance, fees, exams, communication — falls under business methods implemented through software, which is excluded from patentability under Indian law.\n\nGlobal Trend: Even in the United States, the 2014 Supreme Court ruling in Alice Corp. v. CLS Bank significantly restricted software patents. Most SaaS companies globally do not pursue patents.\n\nOpen Source Dependencies: Like every modern software product, Classgrid is built using open-source technologies (Node.js, React, MongoDB, Redis, etc.). Patenting a product built on open-source components is neither practical nor ethical.",
    p3_3: "3.3 What Matters Is Execution, Not Patents",
    p3_3_desc: "In the SaaS industry, competitive advantage comes from:",
    executionList: [
      "Speed of execution and iteration",
      "Quality of user experience",
      "Depth of features and integrations",
      "Customer trust and retention",
      "Brand recognition",
    ],
    p3_3_outro: "These cannot be patented. They are protected by being better, faster, and more reliable than alternatives.",
    p5_desc: "If you are a student or faculty member and someone asks \"Is Classgrid patented?\", here is the simple answer:",
    p5_quote: "Classgrid is a SaaS (Software-as-a-Service) product, similar to Google Workspace, Zoho, or Tally. SaaS products are not patented — this is the global industry standard. Classgrid's intellectual property is protected through copyright law (automatic), trade secrets (private codebase), trademark law (brand protection), and government MSME registration. Indian Patent Law (Section 3(k) of The Patents Act, 1970) explicitly excludes computer programs and business methods from patentability.",
    statusActive: "Active",
    statusNA: "Not Applicable",
    statusNo: "No",
    legalBasis: "Legal Basis:",
    tableCompany: "Company",
    tableType: "Type",
    tablePatented: "Patented Their Core Product?",
    tableMethod: "Protection Method",
    tableStatus: "Status",
  },
  sections: [
    { id: "purpose", title: "1. Purpose of This Document", iconName: "BookOpen" },
    { id: "what-is-classgrid", title: "2. What Is Classgrid?", iconName: "Shield" },
    { id: "why-no-patent", title: "3. Why Classgrid Does Not Require a Patent", iconName: "FileText" },
    { id: "how-protected", title: "4. How Classgrid Protects Its Intellectual Property", iconName: "Lock" },
    { id: "summary-students", title: "5. Summary for Students and Faculty", iconName: "Landmark" },
    { id: "summary-investors", title: "6. Summary for Investors and Partners", iconName: "Copyright" },
    { id: "contact", title: "7. Contact", iconName: "ExternalLink" },
  ],
  industryExamples: [
    { company: "Google Workspace", type: "SaaS", patented: false },
    { company: "Slack", type: "SaaS", patented: false },
    { company: "Zoho", type: "SaaS", patented: false },
    { company: "Tally (India)", type: "Software", patented: false },
    { company: "Razorpay (YC W15)", type: "SaaS/Fintech", patented: false },
    { company: "Notion", type: "SaaS", patented: false },
    { company: "Canva", type: "SaaS", patented: false },
  ],
  protectionMethods: [
    {
      method: "4.1 Copyright Protection (Automatic)",
      status: "active",
      basis: "Indian Copyright Act, 1957 + Berne Convention",
      description: "Under the Indian Copyright Act, 1957, and the Berne Convention (international), all original source code, documentation, UI designs, and content created by Classgrid are automatically protected by copyright from the moment of creation. No registration is required, though registration can be pursued for additional legal enforcement.\n\nWhat is protected: All source code, database schemas, API designs, UI/UX designs, documentation, blog content, email templates, and marketing materials.\nDuration: Lifetime of the author + 60 years (India) / 70 years (international).",
      iconName: "Copyright",
    },
    {
      method: "4.2 Trade Secrets",
      status: "active",
      basis: "Private repositories, encrypted credentials, NDAs",
      description: "Classgrid's proprietary business logic, algorithms, database architectures, multi-tenant design patterns, and internal system configurations are protected as trade secrets. These are never publicly disclosed and are safeguarded through:\n\n• Private GitHub repositories (not open-source)\n• Environment variable encryption for all API keys and credentials\n• Role-based access control within the development team\n• Non-disclosure agreements (NDAs) with any future employees or contractors",
      iconName: "Lock",
    },
    {
      method: "4.3 Trademark Protection",
      status: "active",
      basis: "Indian Trademarks Act, 1999",
      description: "The name \"Classgrid\", the Classgrid logo, and associated brand assets are protected under trademark law. Formal trademark registration (™ → ®) can be pursued through the Indian Trademark Registry at any time.",
      iconName: "Shield",
    },
    {
      method: "4.4 MSME Registration",
      status: "active",
      basis: "UDYAM-MH-01-0308803",
      description: "Classgrid is registered as a Micro Enterprise with the Government of India under the MSME Development Act:\n\n• Udyam Registration Number: UDYAM-MH-01-0308803\n• Classification: Micro Enterprise\n• Activity: Services — Computer Programming Activities\n• NIC Code: 62011\n\nThis registration provides official government recognition of Classgrid as a legitimate business entity.",
      iconName: "Landmark",
    },
    {
      method: "4.5 Terms of Service and Legal Agreements",
      status: "active",
      basis: "classgrid.in/terms",
      description: "Classgrid's published legal documents protect both the company and its users:\n\n• Terms of Service — Governs usage of the platform\n• Privacy Policy — Governs data handling and GDPR/IT Act compliance\n• Acceptable Use Policy — Defines permitted and prohibited usage\n• Cookie Policy — Governs cookie and tracking behavior\n• Security Policy — Defines security practices and data protection measures\n\nAll legal documents are publicly available at https://classgrid.in.",
      iconName: "FileText",
    },
    {
      method: "Patent",
      status: "not-applicable",
      basis: "Section 3(k), The Patents Act, 1970",
      description: "Indian Patent Law explicitly excludes \"computer programmes per se\" and business methods from patentability. This applies to all SaaS products globally.",
      iconName: "XCircle",
    },
  ],
  investorTable: [
    { method: "Copyright", status: "✅ Automatic", basis: "Indian Copyright Act, 1957 + Berne Convention" },
    { method: "Trade Secrets", status: "✅ Active", basis: "Private repositories, encrypted credentials, NDAs" },
    { method: "Trademark", status: "✅ In use (™), formal registration planned", basis: "Indian Trademarks Act, 1999" },
    { method: "MSME Registration", status: "✅ Registered", basis: "UDYAM-MH-01-0308803" },
    { method: "Patent", status: "❌ Not applicable", basis: "Section 3(k), The Patents Act, 1970" },
    { method: "Terms of Service", status: "✅ Published", basis: "classgrid.in/terms" },
    { method: "Privacy Policy", status: "✅ Published", basis: "classgrid.in/privacy" },
  ],
};

// ── HINDI ─────────────────────────────────────────────────────────────────────
const hiDoc = {
  _type: "ipProtectionPage",
  _id: "ip-protection-page-hi",
  language: "hi",
  content: {
    title: "बौद्धिक संपदा (IP) संरक्षण नीति",
    subtitle: "कंपनी: Classgrid (Classgrid का एक उत्पाद, MSME पंजीकृत) • MSME पंजीकरण: UDYAM-MH-01-0308803 • श्रेणी: Services — Computer Programming Activities (NIC Code: 62011)",
    effective: "प्रभावी तिथि: 11 अगस्त 2026",
    updated: "अंतिम अपडेट: 11 अगस्त 2026",
    back: "Classgrid पर वापस जाएँ",
    print: "प्रिंट करें",
    onThisPage: "इस पृष्ठ पर",
    footerContact: "Classgrid की बौद्धिक संपदा, Licensing या कानूनी मामलों से संबंधित किसी भी प्रश्न के लिए कृपया संपर्क करें:",
    footerNote1: "यह दस्तावेज़ Classgrid द्वारा जारी किया गया है और समय-समय पर अपडेट किया जा सकता है। इस दस्तावेज़ का नवीनतम संस्करण हमेशा Classgrid वेबसाइट पर उपलब्ध रहेगा: ",
    footerNote2: "© 2026 Classgrid. सर्वाधिकार सुरक्षित।",
    p1: "यह दस्तावेज़ समझाता है कि Classgrid अपनी बौद्धिक संपदा (Intellectual Property — IP) की सुरक्षा कैसे करता है और Software-as-a-Service (SaaS) प्लेटफ़ॉर्म के रूप में Classgrid को पेटेंट की आवश्यकता क्यों नहीं है। यह नीति छात्रों, शिक्षकों, भागीदारों, निवेशकों और उन सभी लोगों के लिए बनाई गई है जो यह समझना चाहते हैं कि Classgrid की बौद्धिक संपदा को किस प्रकार सुरक्षित रखा जाता है।",
    p2: "Classgrid एक क्लाउड-आधारित Education Operating System (Education ERP) है, जिसे स्कूलों, कॉलेजों, कोचिंग संस्थानों, जूनियर कॉलेजों और इंजीनियरिंग संस्थानों के लिए डिज़ाइन किया गया है। यह शैक्षणिक, प्रशासनिक, वित्तीय और संचालन संबंधी कार्यप्रवाहों को प्रबंधित करने के लिए एक एकीकृत प्लेटफ़ॉर्म प्रदान करता है।",
    p2_highlight: "Classgrid एक व्यावसायिक SaaS उत्पाद है — यह कोई शोध-आधारित आविष्कार, हार्डवेयर डिवाइस या ऐसा स्वतंत्र एल्गोरिदम नहीं है जिसके लिए सामान्यतः पेटेंट की आवश्यकता होती है।",
    p3_1: "3.1 SaaS उत्पादों को सामान्यतः पेटेंट नहीं कराया जाता",
    p3_1_desc: "वैश्विक सॉफ्टवेयर उद्योग में Software-as-a-Service (SaaS) उत्पादों के मुख्य उत्पाद को पेटेंट कराना सामान्य प्रथा नहीं है। दुनिया की कई सफल तकनीकी कंपनियाँ भी इसी प्रकार की रणनीति अपनाती हैं:",
    p3_1_outro: "ये कंपनियाँ अपनी बौद्धिक संपदा को अन्य कानूनी रूप से मान्यता प्राप्त तरीकों से सुरक्षित रखती हैं (नीचे धारा 4 देखें)।",
    p3_2: "3.2 सॉफ्टवेयर पेटेंट प्रतिबंधात्मक और अव्यावहारिक हैं",
    p3_2_desc: "भारतीय पेटेंट कानून (The Patents Act, 1970): धारा 3(k) के अनुसार 'a mathematical or business method or a computer programme per se or algorithms' भारत में पेटेंट योग्य नहीं हैं। Classgrid की मुख्य कार्यक्षमताएँ — जैसे उपस्थिति प्रबंधन, फीस प्रबंधन, परीक्षा प्रबंधन और संचार — सॉफ्टवेयर के माध्यम से लागू किए गए व्यावसायिक प्रबंधन कार्य हैं।\n\nवैश्विक प्रवृत्ति: संयुक्त राज्य अमेरिका में भी, Alice Corp. v. CLS Bank में 2014 के सुप्रीम कोर्ट के फैसले ने सॉफ्टवेयर पेटेंट को काफी प्रतिबंधित कर दिया। वैश्विक स्तर पर अधिकांश SaaS कंपनियाँ पेटेंट नहीं कराती हैं।\n\nOpen Source Dependencies: अन्य आधुनिक सॉफ्टवेयर उत्पादों की तरह Classgrid भी Node.js, React, MongoDB, Redis आदि जैसी ओपन-सोर्स तकनीकों का उपयोग करता है। ऐसे कई ओपन-सोर्स घटकों पर आधारित संपूर्ण उत्पाद को पेटेंट कराना व्यावहारिक या उचित नहीं होता।",
    p3_3: "3.4 पेटेंट नहीं, कार्यान्वयन (Execution) मायने रखता है",
    p3_3_desc: "SaaS उद्योग में, प्रतिस्पर्धात्मक लाभ निम्न से आता है:",
    executionList: [
      "तेजी से कार्यान्वयन (Execution) और पुनरावृत्ति (Iteration)",
      "उपयोगकर्ता अनुभव (User Experience) की गुणवत्ता",
      "सुविधाओं (Features) और एकीकरण (Integrations) की गहराई",
      "ग्राहक विश्वास और अवधारण (Retention)",
      "ब्रांड मान्यता",
    ],
    p3_3_outro: "इन्हें पेटेंट नहीं कराया जा सकता। इन्हें विकल्पों की तुलना में बेहतर, तेज़ और अधिक विश्वसनीय होने के द्वारा सुरक्षित किया जाता है।",
    p5_desc: "यदि कोई छात्र या शिक्षक आपसे पूछता है: 'क्या Classgrid पेटेंट कराया गया है?' तो इसका सरल उत्तर है:",
    p5_quote: "Classgrid, Google Workspace, Zoho या Tally की तरह एक SaaS (Software-as-a-Service) उत्पाद है। SaaS उत्पादों की सुरक्षा के लिए पेटेंट एकमात्र या सामान्य तरीका नहीं है। Classgrid की बौद्धिक संपदा कॉपीराइट कानून (स्वचालित), Trade Secrets (निजी Codebase), Trademark Law (ब्रांड सुरक्षा) और Government MSME Registration के माध्यम से संरक्षित की जाती है। भारतीय पेटेंट कानून The Patents Act, 1970 की Section 3(k) में computer programmes per se, business methods और algorithms की पेटेंट योग्यता पर स्पष्ट सीमाएँ निर्धारित की गई हैं।",
    statusActive: "सक्रिय",
    statusNA: "लागू नहीं",
    statusNo: "नहीं",
    legalBasis: "कानूनी आधार:",
    tableCompany: "कंपनी",
    tableType: "प्रकार",
    tablePatented: "क्या मुख्य उत्पाद पेटेंट किया गया है?",
    tableMethod: "संरक्षण का तरीका",
    tableStatus: "स्थिति",
  },
  sections: [
    { id: "purpose", title: "1. इस दस्तावेज़ का उद्देश्य", iconName: "BookOpen" },
    { id: "what-is-classgrid", title: "2. Classgrid क्या है?", iconName: "Shield" },
    { id: "why-no-patent", title: "3. Classgrid को पेटेंट की आवश्यकता क्यों नहीं है", iconName: "FileText" },
    { id: "how-protected", title: "4. Classgrid अपनी बौद्धिक संपदा की सुरक्षा कैसे करता है", iconName: "Lock" },
    { id: "summary-students", title: "5. छात्रों और शिक्षकों के लिए सारांश", iconName: "Landmark" },
    { id: "summary-investors", title: "6. निवेशकों और भागीदारों के लिए सारांश", iconName: "Copyright" },
    { id: "contact", title: "7. संपर्क", iconName: "ExternalLink" },
  ],
  industryExamples: [
    { company: "Google Workspace", type: "SaaS", patented: false },
    { company: "Slack", type: "SaaS", patented: false },
    { company: "Zoho", type: "SaaS", patented: false },
    { company: "Tally (India)", type: "Software", patented: false },
    { company: "Razorpay (YC W15)", type: "SaaS/Fintech", patented: false },
    { company: "Notion", type: "SaaS", patented: false },
    { company: "Canva", type: "SaaS", patented: false },
  ],
  protectionMethods: [
    {
      method: "4.1 कॉपीराइट संरक्षण (स्वचालित)",
      status: "active",
      basis: "Indian Copyright Act, 1957 + Berne Convention",
      description: "Indian Copyright Act, 1957 और Berne Convention के तहत, सभी मूल Source Code, Documentation, UI Designs और Content उनके निर्माण के समय से ही स्वचालित रूप से कॉपीराइट द्वारा संरक्षित होते हैं।\n\nजो संरक्षित है: सभी Source Code, Database Schemas, API Designs, UI/UX Designs, Documentation, Blog Content, Email Templates, और Marketing Materials।\nअवधि: लेखक का जीवनकाल + 60 वर्ष (भारत) / 70 वर्ष (अंतर्राष्ट्रीय)।",
      iconName: "Copyright",
    },
    {
      method: "4.2 व्यापार रहस्य (Trade Secrets)",
      status: "active",
      basis: "Private repositories, सुरक्षित Credentials, NDAs",
      description: "Classgrid का स्वामित्व वाला Business Logic, Algorithms, Database Architectures, Multi-Tenant Design Patterns और आंतरिक System Configurations Trade Secrets के रूप में संरक्षित हैं। इन्हें कभी भी सार्वजनिक रूप से प्रकट नहीं किया जाता है और इनके माध्यम से सुरक्षित रखा जाता है:\n\n• निजी GitHub Repositories (ओपन-सोर्स नहीं)\n• सभी API keys और credentials के लिए Environment Variable Encryption\n• विकास दल (Development team) के भीतर Role-Based Access Control\n• किसी भी भविष्य के कर्मचारियों या ठेकेदारों के साथ Non-Disclosure Agreements (NDAs)",
      iconName: "Lock",
    },
    {
      method: "4.3 ट्रेडमार्क संरक्षण",
      status: "active",
      basis: "Indian Trademarks Act, 1999",
      description: '"Classgrid" नाम, Classgrid Logo और उससे जुड़े Brand Assets ट्रेडमार्क कानून के अंतर्गत संरक्षित हैं। औपचारिक ट्रेडमार्क पंजीकरण (™ → ®) भारतीय ट्रेडमार्क रजिस्ट्री के माध्यम से किसी भी समय किया जा सकता है।',
      iconName: "Shield",
    },
    {
      method: "4.4 MSME पंजीकरण",
      status: "active",
      basis: "UDYAM-MH-01-0308803",
      description: "Classgrid भारत सरकार के अंतर्गत Micro Enterprise के रूप में MSME Development Act के तहत पंजीकृत है:\n\n• Udyam Registration Number: UDYAM-MH-01-0308803\n• Classification: Micro Enterprise\n• Activity: Services — Computer Programming Activities\n• NIC Code: 62011\n\nयह पंजीकरण Classgrid को एक वैध व्यावसायिक इकाई के रूप में आधिकारिक सरकारी मान्यता प्रदान करता है।",
      iconName: "Landmark",
    },
    {
      method: "4.5 सेवा की शर्तें और कानूनी समझौते (Terms of Service)",
      status: "active",
      basis: "classgrid.in/terms",
      description: "Classgrid के प्रकाशित कानूनी दस्तावेज़ कंपनी और उसके उपयोगकर्ताओं दोनों की रक्षा करते हैं:\n\n• Terms of Service — प्लेटफ़ॉर्म के उपयोग को नियंत्रित करता है\n• Privacy Policy — डेटा हैंडलिंग और GDPR/IT Act अनुपालन को नियंत्रित करता है\n• Acceptable Use Policy — अनुमत और निषिद्ध उपयोग को परिभाषित करता है\n• Cookie Policy — कुकी और ट्रैकिंग व्यवहार को नियंत्रित करता है\n• Security Policy — सुरक्षा प्रथाओं और डेटा संरक्षण उपायों को परिभाषित करता है\n\nसभी कानूनी दस्तावेज़ https://classgrid.in पर सार्वजनिक रूप से उपलब्ध हैं।",
      iconName: "FileText",
    },
    {
      method: "पेटेंट",
      status: "not-applicable",
      basis: "Section 3(k), The Patents Act, 1970",
      description: "भारतीय पेटेंट कानून The Patents Act, 1970 की Section 3(k) में computer programmes per se, business methods और algorithms की पेटेंट योग्यता पर स्पष्ट सीमाएँ निर्धारित की गई हैं। यह विश्व स्तर पर सभी SaaS उत्पादों पर लागू होता है।",
      iconName: "XCircle",
    },
  ],
  investorTable: [
    { method: "कॉपीराइट", status: "✅ स्वचालित", basis: "Indian Copyright Act, 1957 + Berne Convention" },
    { method: "व्यापार रहस्य (Trade Secrets)", status: "✅ सक्रिय", basis: "Private repositories, सुरक्षित Credentials, NDAs" },
    { method: "ट्रेडमार्क", status: "✅ सक्रिय (™)", basis: "Indian Trademarks Act, 1999" },
    { method: "MSME पंजीकरण", status: "✅ पंजीकृत", basis: "UDYAM-MH-01-0308803" },
    { method: "पेटेंट", status: "❌ लागू नहीं", basis: "Section 3(k), The Patents Act, 1970" },
    { method: "Terms of Service", status: "✅ प्रकाशित", basis: "classgrid.in/terms" },
    { method: "Privacy Policy", status: "✅ प्रकाशित", basis: "classgrid.in/privacy" },
  ],
};

// ── MARATHI ───────────────────────────────────────────────────────────────────
const mrDoc = {
  _type: "ipProtectionPage",
  _id: "ip-protection-page-mr",
  language: "mr",
  content: {
    title: "बौद्धिक संपदा (IP) संरक्षण धोरण",
    subtitle: "कंपनी: Classgrid (Classgrid चे उत्पादन, MSME नोंदणीकृत) • MSME नोंदणी: UDYAM-MH-01-0308803 • श्रेणी: Services — Computer Programming Activities (NIC Code: 62011)",
    effective: "प्रभावी दिनांक: 11 ऑगस्ट 2026",
    updated: "शेवटचे अद्यतन: 11 ऑगस्ट 2026",
    back: "Classgrid वर परत जा",
    print: "प्रिंट करा",
    onThisPage: "या पृष्ठावर",
    footerContact: "Classgrid च्या बौद्धिक संपदा, Licensing किंवा कायदेशीर बाबींशी संबंधित कोणत्याही प्रश्नांसाठी कृपया संपर्क साधा:",
    footerNote1: "हा दस्तऐवज Classgrid द्वारे जारी करण्यात आला आहे आणि वेळोवेळी अद्यतनित केला जाऊ शकतो. या दस्तऐवजाची सर्वात नवीन आवृत्ती नेहमी Classgrid वेबसाइटवर उपलब्ध असेल: ",
    footerNote2: "© 2026 Classgrid. सर्व हक्क राखीव.",
    p1: "हा दस्तऐवज Classgrid आपली बौद्धिक संपदा (Intellectual Property — IP) कशी संरक्षित करते आणि Software-as-a-Service (SaaS) प्लॅटफॉर्म म्हणून Classgrid ला पेटंटची आवश्यकता का नाही, हे स्पष्ट करतो. हे धोरण विद्यार्थी, प्राध्यापक, भागीदार, गुंतवणूकदार आणि Classgrid ची बौद्धिक संपदा कशी सुरक्षित ठेवली जाते हे समजून घेऊ इच्छिणाऱ्या प्रत्येकासाठी तयार करण्यात आले आहे.",
    p2: "Classgrid ही शाळा, महाविद्यालये, कोचिंग संस्था, कनिष्ठ महाविद्यालये आणि अभियांत्रिकी संस्थांसाठी तयार करण्यात आलेली क्लाउड-आधारित Education Operating System (Education ERP) प्रणाली आहे. ही प्रणाली शैक्षणिक, प्रशासकीय, आर्थिक आणि दैनंदिन कार्यप्रवाहांचे व्यवस्थापन करण्यासाठी एक एकत्रित प्लॅटफॉर्म उपलब्ध करून देते.",
    p2_highlight: "Classgrid हे एक व्यावसायिक SaaS उत्पादन आहे — ते संशोधनावर आधारित शोध, हार्डवेअर उपकरण किंवा सामान्यतः पेटंटची आवश्यकता असलेला स्वतंत्र अल्गोरिदम नाही.",
    p3_1: "3.1 SaaS उत्पादनांना सामान्यतः पेटंट केले जात नाही",
    p3_1_desc: "जागतिक सॉफ्टवेअर उद्योगात Software-as-a-Service (SaaS) उत्पादनांच्या मुख्य उत्पादनाला पेटंट करणे सामान्य पद्धत नाही. जगातील अनेक यशस्वी तंत्रज्ञान कंपनिया अशाच प्रकारची पद्धत वापरतात:",
    p3_1_outro: "या कंपन्या त्यांची बौद्धिक संपदा इतर कायदेशीररित्या मान्यताप्राप्त पद्धतींद्वारे संरक्षित करतात (खालील विभाग ४ पहा).",
    p3_2: "3.2 सॉफ्टवेअर पेटंट प्रतिबंधात्मक आणि अव्यवहार्य आहेत",
    p3_2_desc: "भारतीय पेटेंट कायदा (The Patents Act, 1970): कलम 3(k) नुसार 'a mathematical or business method or a computer programme per se or algorithms' भारतात पेटंटसाठी पात्र नाहीत. Classgrid ची मुख्य कार्ये — जसे की उपस्थिती व्यवस्थापन, फी व्यवस्थापन, परीक्षा व्यवस्थापन आणि संवाद व्यवस्था — ही सॉफ्टवेअरद्वारे कार्यान्वित केलेली व्यावसायिक व्यवस्थापन पद्धती आहेत.\n\nजागतिक प्रवृत्ती: अगदी अमेरिकेतही, Alice Corp. v. CLS Bank मधील २०१४ च्या सर्वोच्च न्यायालयाच्या निर्णयाने सॉफ्टवेअर पेटंटवर लक्षणीय निर्बंध आणले. जागतिक स्तरावर बहुतांश SaaS कंपन्या पेटंट घेत नाहीत.\n\nOpen Source Dependencies: इतर आधुनिक सॉफ्टवेअर उत्पादनांप्रमाणे Classgrid देखील Node.js, React, MongoDB, Redis इत्यादी ओपन-सोर्स तंत्रज्ञानांचा वापर करते. अशा अनेक ओपन-सोर्स घटकोंवर आधारित संपूर्ण उत्पादनाला पेटंट करणे व्यावहारिक किंवा योग्य ठरत नाही.",
    p3_3: "3.4 पेटंट नाही, तर अंमलबजावणी (Execution) महत्त्वाची आहे",
    p3_3_desc: "SaaS उद्योगात, स्पर्धात्मक फायदा यातून मिळतो:",
    executionList: [
      "अंमलबजावणीचा वेग (Speed of execution) आणि पुनरावृत्ती (iteration)",
      "वापरकर्त्याच्या अनुभवाची गुणवत्ता (Quality of user experience)",
      "वैशिष्ट्ये आणि इंटिग्रेशनची खोली",
      "ग्राहकांचा विश्वास आणि टिकवून ठेवणे (Retention)",
      "ब्रँड मान्यता",
    ],
    p3_3_outro: "यांचे पेटंट घेता येत नाही. हे पर्यायांपेक्षा अधिक चांगले, वेगवान आणि अधिक विश्वसनीय बनवून संरक्षित केले जातात.",
    p5_desc: "जर कोणी विद्यार्थी किंवा प्राध्यापक तुम्हाला विचारले: 'Classgrid पेटंट केलेले आहे का?' तर त्याचे सोपे उत्तर असे आहे:",
    p5_quote: "Classgrid हे Google Workspace, Zoho किंवा Tally प्रमाणे एक SaaS (Software-as-a-Service) उत्पादन आहे. SaaS उत्पादनांच्या संरक्षणासाठी पेटंट हा एकमेव किंवा सामान्य मार्ग नसतो. Classgrid ची बौद्धिक संपदा कॉपीराइट कायदा (स्वयंचलित), Trade Secrets (खाजगी Codebase), Trademark Law (ब्रँड संरक्षण) आणि Government MSME Registration यांच्या माध्यमातून संरक्षित केली जाते. भारतीय पेटंट कायद्यातील The Patents Act, 1970 च्या Section 3(k) मध्ये computer programmes per se, business methods आणि algorithms यांच्या पेटंटयोग्यतेवर स्पष्ट मर्यादा घालण्यात आल्या आहेत.",
    statusActive: "सक्रिय",
    statusNA: "लागू नाही",
    statusNo: "नाही",
    legalBasis: "कायदेशीर आधार:",
    tableCompany: "कंपनी",
    tableType: "प्रकार",
    tablePatented: "मुख्य उत्पादन पेटंट केले आहे का?",
    tableMethod: "संरक्षण पद्धत",
    tableStatus: "स्थिती",
  },
  sections: [
    { id: "purpose", title: "1. या दस्तऐवजाचा उद्देश", iconName: "BookOpen" },
    { id: "what-is-classgrid", title: "2. Classgrid म्हणजे काय?", iconName: "Shield" },
    { id: "why-no-patent", title: "3. Classgrid ला पेटंटची आवश्यकता का नाही", iconName: "FileText" },
    { id: "how-protected", title: "4. Classgrid आपली बौद्धिक संपदा कशी संरक्षित करते", iconName: "Lock" },
    { id: "summary-students", title: "5. विद्यार्थी आणि प्राध्यापकांसाठी सारांश", iconName: "Landmark" },
    { id: "summary-investors", title: "6. गुंतवणूकदार आणि भागीदारांसाठी सारांश", iconName: "Copyright" },
    { id: "contact", title: "7. संपर्क", iconName: "ExternalLink" },
  ],
  industryExamples: [
    { company: "Google Workspace", type: "SaaS", patented: false },
    { company: "Slack", type: "SaaS", patented: false },
    { company: "Zoho", type: "SaaS", patented: false },
    { company: "Tally (India)", type: "Software", patented: false },
    { company: "Razorpay (YC W15)", type: "SaaS/Fintech", patented: false },
    { company: "Notion", type: "SaaS", patented: false },
    { company: "Canva", type: "SaaS", patented: false },
  ],
  protectionMethods: [
    {
      method: "4.1 कॉपीराइट संरक्षण (स्वयंचलित)",
      status: "active",
      basis: "Indian Copyright Act, 1957 + Berne Convention",
      description: "Indian Copyright Act, 1957 आणि Berne Convention (आंतरराष्ट्रीय) अंतर्गत, सर्व मूळ Source Code, Documentation, UI Designs आणि Content हे तयार झाल्याच्या क्षणापासून स्वयंचलितपणे कॉपीराइटद्वारे संरक्षित असतात. अतिरिक्त कायदेशीर अंमलबजावणीसाठी नोंदणी केली जाऊ शकते, परंतु ती बंधनकारक नाही.\n\nकाय संरक्षित आहे: सर्व Source Code, Database Schemas, API Designs, UI/UX Designs, Documentation, Blog Content, Email Templates, आणि Marketing Materials.\nकालावधी: लेखकाचे जीवनमान + ६० वर्षे (भारत) / ७० वर्षे (आंतरराष्ट्रीय).",
      iconName: "Copyright",
    },
    {
      method: "4.2 व्यापार गुपिते (Trade Secrets)",
      status: "active",
      basis: "Private repositories, सुरक्षित Credentials, NDAs",
      description: "Classgrid चे मालकी हक्क असलेले Business Logic, Algorithms, Database Architectures, Multi-Tenant Design Patterns आणि अंतर्गत System Configurations हे Trade Secrets म्हणून संरक्षित केले जातात. हे कधीही सार्वजनिकरित्या उघड केले जात नाहीत आणि याद्वारे संरक्षित केले जातात:\n\n• खाजगी GitHub Repositories (ओपन-सोर्स नाही)\n• सर्व API keys आणि credentials साठी Environment Variable Encryption\n• विकास संघाच्या (Development team) आत Role-Based Access Control\n• भविष्यातील कोणत्याही कर्मचारी किंवा कंत्राटदारांसोबत Non-Disclosure Agreements (NDAs)",
      iconName: "Lock",
    },
    {
      method: "4.3 ट्रेडमार्क संरक्षण",
      status: "active",
      basis: "Indian Trademarks Act, 1999",
      description: '"Classgrid" हे नाव, Classgrid Logo आणि त्याच्याशी संबंधित Brand Assets हे ट्रेडमार्क कायद्यांतर्गत संरक्षित केले जाऊ शकतात. औपचारिक ट्रेडमार्क नोंदणी (™ → ®) भारतीय ट्रेडमार्क रजिस्ट्रीच्या माध्यमातून कोणत्याही वेळी केली जाऊ शकते.',
      iconName: "Shield",
    },
    {
      method: "4.4 MSME नोंदणी",
      status: "active",
      basis: "UDYAM-MH-01-0308803",
      description: "Classgrid ची भारत सरकारकडे MSME Development Act अंतर्गत Micro Enterprise म्हणून नोंदणी करण्यात आली आहे:\n\n• Udyam Registration Number: UDYAM-MH-01-0308803\n• Classification: Micro Enterprise\n• Activity: Services — Computer Programming Activities\n• NIC Code: 62011\n\nही नोंदणी Classgrid ला एक कायदेशीर व्यावसायिक संस्था म्हणून अधिकृत सरकारी मान्यता प्रदान करते.",
      iconName: "Landmark",
    },
    {
      method: "4.5 सेवा अटी आणि कायदेशीर करार (Terms of Service)",
      status: "active",
      basis: "classgrid.in/terms",
      description: "Classgrid चे प्रकाशित केलेले कायदेशीर दस्तऐवज कंपनी आणि तिचे वापरकर्ते दोघांचेही संरक्षण करतात:\n\n• Terms of Service — प्लॅटफॉर्मच्या वापराचे नियमन करते\n• Privacy Policy — डेटा हाताळणी आणि GDPR/IT Act अनुपालनाचे नियमन करते\n• Acceptable Use Policy — अनुमत आणि निषिद्ध वापराची व्याख्या करते\n• Cookie Policy — कुकी आणि ट्रॅकिंग वर्तनाचे नियमन करते\n• Security Policy — सुरक्षा पद्धती आणि डेटा संरक्षण उपायांची व्याख्या करते\n\nसर्व कायदेशीर दस्तऐवज https://classgrid.in वर सार्वजनिकरीत्या उपलब्ध आहेत.",
      iconName: "FileText",
    },
    {
      method: "पेटंट",
      status: "not-applicable",
      basis: "Section 3(k), The Patents Act, 1970",
      description: "भारतीय पेटंट कायद्यातील The Patents Act, 1970 च्या Section 3(k) मध्ये computer programmes per se, business methods आणि algorithms यांच्या पेटंटयोग्यतेवर स्पष्ट मर्यादा घालण्यात आल्या आहेत. हे जागतिक स्तरावर सर्व SaaS उत्पादनांना लागू होते.",
      iconName: "XCircle",
    },
  ],
  investorTable: [
    { method: "कॉपीराइट", status: "✅ स्वयंचलित", basis: "Indian Copyright Act, 1957 + Berne Convention" },
    { method: "व्यापार गुपिते (Trade Secrets)", status: "✅ सक्रिय", basis: "Private repositories, सुरक्षित Credentials, NDAs" },
    { method: "ट्रेडमार्क", status: "✅ वापरात (™)", basis: "Indian Trademarks Act, 1999" },
    { method: "MSME नोंदणी", status: "✅ नोंदणीकृत", basis: "UDYAM-MH-01-0308803" },
    { method: "पेटंट", status: "❌ लागू नाही", basis: "Section 3(k), The Patents Act, 1970" },
    { method: "Terms of Service", status: "✅ प्रकाशित", basis: "classgrid.in/terms" },
    { method: "Privacy Policy", status: "✅ प्रकाशित", basis: "classgrid.in/privacy" },
  ],
};

function addKeys(doc) {
  if (Array.isArray(doc.sections)) {
    doc.sections = doc.sections.map((item, idx) => ({ ...item, _key: `sec-${idx}` }));
  }
  if (Array.isArray(doc.industryExamples)) {
    doc.industryExamples = doc.industryExamples.map((item, idx) => ({ ...item, _key: `ind-${idx}` }));
  }
  if (Array.isArray(doc.protectionMethods)) {
    doc.protectionMethods = doc.protectionMethods.map((item, idx) => ({ ...item, _key: `pm-${idx}` }));
  }
  if (Array.isArray(doc.investorTable)) {
    doc.investorTable = doc.investorTable.map((item, idx) => ({ ...item, _key: `inv-${idx}` }));
  }
  return doc;
}

async function upload() {
  try {
    console.log("Uploading EN doc...");
    await writeClient.createOrReplace(addKeys(enDoc));

    console.log("Uploading HI doc...");
    await writeClient.createOrReplace(addKeys(hiDoc));

    console.log("Uploading MR doc...");
    await writeClient.createOrReplace(addKeys(mrDoc));

    console.log("✅ Successfully uploaded all 3 IP Protection docs to Sanity!");
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

upload();
