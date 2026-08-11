"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Copyright,
  Lock,
  Landmark,
  BookOpen,
  FileText,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Printer,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeModeSwitcher } from "@/components/layout/ThemeModeSwitcher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Language = "en" | "hi" | "mr";

const SECTIONS = {
  en: [
    { id: "purpose", title: "Purpose", icon: BookOpen },
    { id: "what-is-classgrid", title: "What Is Classgrid?", icon: Shield },
    { id: "why-no-patent", title: "Why No Patent?", icon: FileText },
    { id: "how-protected", title: "How IP Is Protected", icon: Lock },
    { id: "summary-students", title: "For Students & Faculty", icon: Landmark },
    { id: "summary-investors", title: "For Investors & Partners", icon: Copyright },
    { id: "contact", title: "Contact", icon: ExternalLink },
  ],
  hi: [
    { id: "purpose", title: "उद्देश्य", icon: BookOpen },
    { id: "what-is-classgrid", title: "Classgrid क्या है?", icon: Shield },
    { id: "why-no-patent", title: "पेटेंट की आवश्यकता क्यों नहीं?", icon: FileText },
    { id: "how-protected", title: "बौद्धिक संपदा की सुरक्षा", icon: Lock },
    { id: "summary-students", title: "छात्रों और शिक्षकों के लिए", icon: Landmark },
    { id: "summary-investors", title: "निवेशकों और भागीदारों के लिए", icon: Copyright },
    { id: "contact", title: "संपर्क", icon: ExternalLink },
  ],
  mr: [
    { id: "purpose", title: "उद्देश्य", icon: BookOpen },
    { id: "what-is-classgrid", title: "Classgrid म्हणजे काय?", icon: Shield },
    { id: "why-no-patent", title: "पेटंटची आवश्यकता का नाही?", icon: FileText },
    { id: "how-protected", title: "बौद्धिक संपदा कशी संरक्षित करते?", icon: Lock },
    { id: "summary-students", title: "विद्यार्थी आणि प्राध्यापकांसाठी", icon: Landmark },
    { id: "summary-investors", title: "गुंतवणूकदार आणि भागीदारांसाठी", icon: Copyright },
    { id: "contact", title: "संपर्क", icon: ExternalLink },
  ],
};

const INDUSTRY_EXAMPLES = [
  { company: "Google Workspace", type: "SaaS", patented: false },
  { company: "Slack", type: "SaaS", patented: false },
  { company: "Zoho", type: "SaaS", patented: false },
  { company: "Tally (India)", type: "Software", patented: false },
  { company: "Razorpay (YC W15)", type: "SaaS/Fintech", patented: false },
  { company: "Notion", type: "SaaS", patented: false },
  { company: "Canva", type: "SaaS", patented: false },
];

const PROTECTION_METHODS = {
  en: [
    {
      method: "Copyright",
      status: "active",
      basis: "Indian Copyright Act, 1957 + Berne Convention",
      description: "All source code, database schemas, API designs, UI/UX designs, documentation, blog content, email templates, and marketing materials are automatically protected from the moment of creation.",
      icon: Copyright,
    },
    {
      method: "Trade Secrets",
      status: "active",
      basis: "Private repositories, encrypted credentials, NDAs",
      description: "Classgrid's proprietary business logic, algorithms, database architectures, multi-tenant design patterns, and internal system configurations are never publicly disclosed.",
      icon: Lock,
    },
    {
      method: "Trademark",
      status: "active",
      basis: "Indian Trademarks Act, 1999",
      description: 'The name "Classgrid", the Classgrid logo, and associated brand assets are protected under trademark law. Formal trademark registration (™ → ®) can be pursued at any time.',
      icon: Shield,
    },
    {
      method: "MSME Registration",
      status: "active",
      basis: "UDYAM-MH-01-0308803",
      description: "Classgrid is registered as a Micro Enterprise with the Government of India under the MSME Development Act. NIC Code: 62011 (Computer Programming Activities).",
      icon: Landmark,
    },
    {
      method: "4.5 Terms of Service and Legal Agreements",
      status: "active",
      basis: "classgrid.in/terms",
      description: "Classgrid's published legal documents protect both the company and its users: Terms of Service (Governs usage), Privacy Policy (GDPR/IT Act compliance), Acceptable Use Policy, Cookie Policy, Security Policy. All legal documents are publicly available at classgrid.in.",
      icon: FileText,
    },
    {
      method: "Patent",
      status: "not-applicable",
      basis: "Section 3(k), The Patents Act, 1970",
      description: 'Indian Patent Law explicitly excludes "computer programmes per se" and business methods from patentability. This applies to all SaaS products globally.',
      icon: XCircle,
    },
  ],
  hi: [
    {
      method: "कॉपीराइट संरक्षण",
      status: "active",
      basis: "Indian Copyright Act, 1957 + Berne Convention",
      description: "सभी मूल Source Code, Documentation, UI Designs और Content उनके निर्माण के समय से ही स्वचालित रूप से कॉपीराइट द्वारा संरक्षित होता है।",
      icon: Copyright,
    },
    {
      method: "व्यापार रहस्य (Trade Secrets)",
      status: "active",
      basis: "Private repositories, सुरक्षित Credentials, NDAs",
      description: "Classgrid का स्वामित्व वाला Business Logic, Algorithms, Database Architectures, Multi-Tenant Design Patterns और आंतरिक System Configurations Trade Secrets के रूप में संरक्षित हैं।",
      icon: Lock,
    },
    {
      method: "ट्रेडमार्क संरक्षण",
      status: "active",
      basis: "Indian Trademarks Act, 1999",
      description: '“Classgrid” नाम, Classgrid Logo और उससे जुड़े Brand Assets ट्रेडमार्क कानून के अंतर्गत संरक्षित किए जा सकते हैं।',
      icon: Shield,
    },
    {
      method: "MSME पंजीकरण",
      status: "active",
      basis: "UDYAM-MH-01-0308803",
      description: "Classgrid भारत सरकार के अंतर्गत Micro Enterprise के रूप में पंजीकृत है। NIC Code: 62011.",
      icon: Landmark,
    },
    {
      method: "4.5 सेवा की शर्तें और कानूनी समझौते",
      status: "active",
      basis: "classgrid.in/terms",
      description: "Classgrid के प्रकाशित कानूनी दस्तावेज़ कंपनी और उसके उपयोगकर्ताओं दोनों की रक्षा करते हैं: Terms of Service, Privacy Policy, Acceptable Use Policy, Cookie Policy, Security Policy। सभी कानूनी दस्तावेज़ classgrid.in पर सार्वजनिक रूप से उपलब्ध हैं।",
      icon: FileText,
    },
    {
      method: "पेटेंट",
      status: "not-applicable",
      basis: "Section 3(k), The Patents Act, 1970",
      description: "भारतीय पेटेंट कानून The Patents Act, 1970 की Section 3(k) में computer programmes per se, business methods और algorithms की पेटेंट योग्यता पर स्पष्ट सीमाएँ निर्धारित की गई हैं। यह विश्व स्तर पर सभी SaaS उत्पादों पर लागू होता है।",
      icon: XCircle,
    },
  ],
  mr: [
    {
      method: "कॉपीराइट संरक्षण",
      status: "active",
      basis: "Indian Copyright Act, 1957 + Berne Convention",
      description: "सर्व मूळ Source Code, Documentation, UI Designs आणि Content हे तयार झाल्याच्या क्षणापासून स्वयंचलितपणे कॉपीराइटद्वारे संरक्षित असतात.",
      icon: Copyright,
    },
    {
      method: "व्यापार गुपिते (Trade Secrets)",
      status: "active",
      basis: "Private repositories, सुरक्षित Credentials, NDAs",
      description: "Classgrid चे मालकी हक्क असलेले Business Logic, Algorithms, Database Architectures, Multi-Tenant Design Patterns आणि अंतर्गत System Configurations हे Trade Secrets म्हणून संरक्षित केले जातात.",
      icon: Lock,
    },
    {
      method: "ट्रेडमार्क संरक्षण",
      status: "active",
      basis: "Indian Trademarks Act, 1999",
      description: '“Classgrid” हे नाव, Classgrid Logo आणि त्याच्याशी संबंधित Brand Assets हे ट्रेडमार्क कायद्यांतर्गत संरक्षित केले जाऊ शकतात.',
      icon: Shield,
    },
    {
      method: "MSME नोंदणी",
      status: "active",
      basis: "UDYAM-MH-01-0308803",
      description: "Classgrid ची भारत सरकारकडे MSME Development Framework अंतर्गत Micro Enterprise म्हणून नोंदणी करण्यात आली आहे. NIC Code: 62011.",
      icon: Landmark,
    },
    {
      method: "4.5 सेवा अटी आणि कायदेशीर करार",
      status: "active",
      basis: "classgrid.in/terms",
      description: "Classgrid चे प्रकाशित केलेले कायदेशीर दस्तऐवज कंपनी आणि तिचे वापरकर्ते दोघांचेही संरक्षण करतात: Terms of Service, Privacy Policy, Acceptable Use Policy, Cookie Policy, Security Policy. सर्व कायदेशीर दस्तऐवज classgrid.in वर सार्वजनिकरीत्या उपलब्ध आहेत.",
      icon: FileText,
    },
    {
      method: "पेटंट",
      status: "not-applicable",
      basis: "Section 3(k), The Patents Act, 1970",
      description: "भारतीय पेटंट कायद्यातील The Patents Act, 1970 च्या Section 3(k) मध्ये computer programmes per se, business methods आणि algorithms यांच्या पेटंटयोग्यतेवर स्पष्ट मर्यादा घालण्यात आल्या आहेत. हे जागतिक स्तरावर सर्व SaaS उत्पादनांना लागू होते.",
      icon: XCircle,
    },
  ],
};

const STRINGS = {
  en: {
    title: "Intellectual Property Protection Policy",
    subtitle: "Classgrid — MSME Registered (UDYAM-MH-01-0308803) • NIC Code: 62011",
    effective: "Effective: August 11, 2026",
    updated: "Last Updated: August 11, 2026",
    back: "Back to Classgrid",
    print: "Print / Save as PDF",
    onThisPage: "On This Page",
    footerContact: "For any questions regarding Classgrid's intellectual property, licensing, or legal matters, please contact:",
    footerNote1: "This document is issued by Classgrid and may be updated from time to time. The latest version is always available at ",
    footerNote2: "© 2026 Classgrid. All rights reserved.",
    p1: "This document explains how Classgrid protects its intellectual property (IP) and why Classgrid, as a Software-as-a-Service (SaaS) platform, does not require a patent. This policy is intended for students, faculty, partners, investors, and anyone who wishes to understand how Classgrid's IP is safeguarded.",
    p2: "Classgrid is a cloud-based Education Operating System (Education ERP) designed for schools, colleges, coaching institutes, junior colleges, and engineering institutions. It provides a unified platform for managing academic, administrative, financial, and operational workflows.",
    p2_highlight: "Classgrid is a commercial SaaS product — not a research invention, hardware device, or algorithm that would typically require a patent.",
    p3_1: "3.1 SaaS Products Are Rarely Patented",
    p3_1_desc: "In the global software industry, SaaS products are almost never patented. This is the industry standard followed by the world's most successful technology companies:",
    p3_2: "3.2 Indian Patent Law Explicitly Excludes Software",
    p3_2_desc: "Section 3(k) of The Patents Act, 1970 (India) explicitly states that \"a mathematical or business method or a computer programme per se or algorithms\" are not patentable in India. Classgrid's core functionality — managing attendance, fees, exams, communication — falls under business methods implemented through software, which is excluded from patentability under Indian law.\n\nGlobal Trend: Even in the United States, the 2014 Supreme Court ruling in Alice Corp. v. CLS Bank significantly restricted software patents. Most SaaS companies globally do not pursue patents.",
    p3_3: "3.3 Open Source Dependencies",
    p3_3_desc: "Like every modern software product, Classgrid is built using open-source technologies (Node.js, React, MongoDB, Redis, etc.). Patenting a product built on open-source components is neither practical nor ethical. This is the global industry standard.",
    p3_4: "3.4 What Matters Is Execution, Not Patents",
    p3_4_desc: "In the SaaS industry, competitive advantage comes from:",
    executionList: [
      "Speed of execution and iteration",
      "Quality of user experience",
      "Depth of features and integrations",
      "Customer trust and retention",
      "Brand recognition"
    ],
    p3_4_outro: "These cannot be patented. They are protected by being better, faster, and more reliable than alternatives.",
    p5_desc: "If someone asks \"Is Classgrid patented?\", here is the answer:",
    p5_quote: "Classgrid is a SaaS (Software-as-a-Service) product, similar to Google Workspace, Zoho, or Tally. SaaS products are not patented — this is the global industry standard. Classgrid's intellectual property is protected through copyright law (automatic), trade secrets (private codebase), trademark law (brand protection), and government MSME registration. Indian Patent Law (Section 3(k) of The Patents Act, 1970) explicitly excludes computer programs and business methods from patentability.",
    statusActive: "Active",
    statusNA: "Not Applicable",
    statusNo: "No",
    legalBasis: "Legal Basis:",
    tableCompany: "Company",
    tableType: "Type",
    tablePatented: "Patented Core Product?",
    tableMethod: "Protection Method",
    tableStatus: "Status",
  },
  hi: {
    title: "बौद्धिक संपदा (IP) संरक्षण नीति",
    subtitle: "कंपनी: Classgrid (Classgrid का एक उत्पाद, MSME पंजीकृत) • NIC Code: 62011",
    effective: "प्रभावी तिथि: 11 अगस्त 2026",
    updated: "अंतिम अपडेट: 11 अगस्त 2026",
    back: "Classgrid पर वापस जाएँ",
    print: "प्रिंट करें / PDF सेव करें",
    onThisPage: "इस पृष्ठ पर",
    footerContact: "Classgrid की बौद्धिक संपदा, Licensing या कानूनी मामलों से संबंधित किसी भी प्रश्न के लिए कृपया संपर्क करें:",
    footerNote1: "यह दस्तावेज़ Classgrid द्वारा जारी किया गया है और समय-समय पर अपडेट किया जा सकता है। इस दस्तावेज़ का नवीनतम संस्करण हमेशा यहाँ उपलब्ध रहेगा: ",
    footerNote2: "© 2026 Classgrid. सर्वाधिकार सुरक्षित।",
    p1: "यह दस्तावेज़ समझाता है कि Classgrid अपनी बौद्धिक संपदा (Intellectual Property — IP) की सुरक्षा कैसे करता है और Software-as-a-Service (SaaS) प्लेटफ़ॉर्म के रूप में Classgrid को पेटेंट की आवश्यकता क्यों नहीं है। यह नीति छात्रों, शिक्षकों, भागीदारों, निवेशकों और उन सभी लोगों के लिए बनाई गई है जो यह समझना चाहते हैं कि Classgrid की बौद्धिक संपदा को किस प्रकार सुरक्षित रखा जाता है।",
    p2: "Classgrid एक क्लाउड-आधारित Education Operating System (Education ERP) है, जिसे स्कूलों, कॉलेजों, कोचिंग संस्थानों, जूनियर कॉलेजों और इंजीनियरिंग संस्थानों के लिए डिज़ाइन किया गया है। यह शैक्षणिक, प्रशासनिक, वित्तीय और संचालन संबंधी कार्यप्रवाहों को प्रबंधित करने के लिए एक एकीकृत प्लेटफ़ॉर्म प्रदान करता है।",
    p2_highlight: "Classgrid एक व्यावसायिक SaaS उत्पाद है — यह कोई शोध-आधारित आविष्कार, हार्डवेयर डिवाइस या ऐसा स्वतंत्र एल्गोरिदम नहीं है जिसके लिए सामान्यतः पेटेंट की आवश्यकता होती है।",
    p3_1: "3.1 SaaS उत्पादों को सामान्यतः पेटेंट नहीं कराया जाता",
    p3_1_desc: "वैश्विक सॉफ्टवेयर उद्योग में Software-as-a-Service (SaaS) उत्पादों के मुख्य उत्पाद को पेटेंट कराना सामान्य प्रथा नहीं है। दुनिया की कई सफल तकनीकी कंपनियाँ भी इसी प्रकार की रणनीति अपनाती हैं:",
    p3_2: "3.2 भारतीय पेटेंट कानून (The Patents Act, 1970)",
    p3_2_desc: "भारतीय पेटेंट कानून (The Patents Act, 1970): धारा 3(k) के अनुसार “a mathematical or business method or a computer programme per se or algorithms” भारत में पेटेंट योग्य नहीं हैं। Classgrid की मुख्य कार्यक्षमताएँ — जैसे उपस्थिति प्रबंधन, फीस प्रबंधन, परीक्षा प्रबंधन और संचार — सॉफ्टवेयर के माध्यम से लागू किए गए व्यावसायिक प्रबंधन कार्य हैं।\n\nवैश्विक प्रवृत्ति: संयुक्त राज्य अमेरिका में भी, Alice Corp. v. CLS Bank में 2014 के सुप्रीम कोर्ट के फैसले ने सॉफ्टवेयर पेटेंट को काफी प्रतिबंधित कर दिया। वैश्विक स्तर पर अधिकांश SaaS कंपनियाँ पेटेंट नहीं कराती हैं।",
    p3_3: "3.3 Open Source Dependencies",
    p3_3_desc: "अन्य आधुनिक सॉफ्टवेयर उत्पादों की तरह Classgrid भी Node.js, React, MongoDB, Redis आदि जैसी ओपन-सोर्स तकनीकों का उपयोग करता है। ऐसे कई ओपन-सोर्स घटकों पर आधारित संपूर्ण उत्पाद को पेटेंट कराना व्यावहारिक या उचित नहीं होता।",
    p3_4: "3.4 पेटेंट नहीं, कार्यान्वयन (Execution) मायने रखता है",
    p3_4_desc: "SaaS उद्योग में, प्रतिस्पर्धात्मक लाभ निम्न से आता है:",
    executionList: [
      "तेजी से कार्यान्वयन (Execution) और पुनरावृत्ति (Iteration)",
      "उपयोगकर्ता अनुभव (User Experience) की गुणवत्ता",
      "सुविधाओं (Features) और एकीकरण (Integrations) की गहराई",
      "ग्राहक विश्वास और अवधारण (Retention)",
      "ब्रांड मान्यता"
    ],
    p3_4_outro: "इन्हें पेटेंट नहीं कराया जा सकता। इन्हें विकल्पों की तुलना में बेहतर, तेज़ और अधिक विश्वसनीय होने के द्वारा सुरक्षित किया जाता है।",
    p5_desc: "यदि कोई आपसे पूछता है: “क्या Classgrid पेटेंट कराया गया है?” तो इसका सरल उत्तर है:",
    p5_quote: "Classgrid, Google Workspace, Zoho या Tally की तरह एक SaaS (Software-as-a-Service) उत्पाद है। SaaS उत्पादों की सुरक्षा के लिए पेटेंट एकमात्र या सामान्य तरीका नहीं है। Classgrid की बौद्धिक संपदा कॉपीराइट कानून, Trade Secrets यानी निजी Codebase और आंतरिक तकनीक, Trademark Law यानी ब्रांड सुरक्षा और Government MSME Registration के माध्यम से संरक्षित की जाती है। भारतीय पेटेंट कानून The Patents Act, 1970 की Section 3(k) में computer programmes per se, business methods और algorithms की पेटेंट योग्यता पर स्पष्ट सीमाएँ निर्धारित की गई हैं।",
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
  mr: {
    title: "बौद्धिक संपदा (IP) संरक्षण धोरण",
    subtitle: "कंपनी: Classgrid (Classgrid चे उत्पादन, MSME नोंदणीकृत) • NIC Code: 62011",
    effective: "प्रभावी दिनांक: 11 ऑगस्ट 2026",
    updated: "शेवटचे अद्यतन: 11 ऑगस्ट 2026",
    back: "Classgrid वर परत जा",
    print: "प्रिंट करा / PDF सेव्ह करा",
    onThisPage: "या पृष्ठावर",
    footerContact: "Classgrid च्या बौद्धिक संपदा, Licensing किंवा कायदेशीर बाबींशी संबंधित कोणत्याही प्रश्नांसाठी कृपया संपर्क साधा:",
    footerNote1: "हा दस्तऐवज Classgrid द्वारे जारी करण्यात आला आहे आणि वेळोवेळी अद्यतनित केला जाऊ शकतो. या दस्तऐवजाची सर्वात नवीन आवृत्ती नेहमी येथे उपलब्ध असेल: ",
    footerNote2: "© 2026 Classgrid. सर्व हक्क राखीव.",
    p1: "हा दस्तऐवज Classgrid आपली बौद्धिक संपदा (Intellectual Property — IP) कशी संरक्षित करते आणि Software-as-a-Service (SaaS) प्लॅटफॉर्म म्हणून Classgrid ला पेटंटची आवश्यकता का नाही, हे स्पष्ट करतो. हे धोरण विद्यार्थी, प्राध्यापक, भागीदार, गुंतवणूकदार आणि Classgrid ची बौद्धिक संपदा कशी सुरक्षित ठेवली जाते हे समजून घेऊ इच्छिणाऱ्या प्रत्येकासाठी तयार करण्यात आले आहे.",
    p2: "Classgrid ही शाळा, महाविद्यालये, कोचिंग संस्था, कनिष्ठ महाविद्यालये आणि अभियांत्रिकी संस्थांसाठी तयार करण्यात आलेली क्लाउड-आधारित Education Operating System (Education ERP) प्रणाली आहे. ही प्रणाली शैक्षणिक, प्रशासकीय, आर्थिक आणि दैनंदिन कार्यप्रवाहांचे व्यवस्थापन करण्यासाठी एक एकत्रित प्लॅटफॉर्म उपलब्ध करून देते.",
    p2_highlight: "Classgrid हे एक व्यावसायिक SaaS उत्पादन आहे — ते संशोधनावर आधारित शोध, हार्डवेअर उपकरण किंवा सामान्यतः पेटंटची आवश्यकता असलेला स्वतंत्र अल्गोरिदम नाही.",
    p3_1: "3.1 SaaS उत्पादनांना सामान्यतः पेटंट केले जात नाही",
    p3_1_desc: "जागतिक सॉफ्टवेअर उद्योगात Software-as-a-Service (SaaS) उत्पादनांच्या मुख्य उत्पादनाला पेटंट करणे सामान्य पद्धत नाही. जगातील अनेक यशस्वी तंत्रज्ञान कंपन्या अशाच प्रकारची पद्धत वापरतात:",
    p3_2: "3.2 भारतीय पेटेंट कायदा (The Patents Act, 1970)",
    p3_2_desc: "भारतीय पेटेंट कायदा (The Patents Act, 1970): कलम 3(k) नुसार “a mathematical or business method or a computer programme per se or algorithms” भारतात पेटंटसाठी पात्र नाहीत. Classgrid ची मुख्य कार्ये — जसे की उपस्थिती व्यवस्थापन, फी व्यवस्थापन, परीक्षा व्यवस्थापन आणि संवाद व्यवस्था — ही सॉफ्टवेअरद्वारे कार्यान्वित केलेली व्यावसायिक व्यवस्थापन पद्धती आहेत.\n\nजागतिक प्रवृत्ती: अगदी अमेरिकेतही, Alice Corp. v. CLS Bank मधील २०१४ च्या सर्वोच्च न्यायालयाच्या निर्णयाने सॉफ्टवेअर पेटंटवर लक्षणीय निर्बंध आणले. जागतिक स्तरावर बहुतांश SaaS कंपन्या पेटंट घेत नाहीत.",
    p3_3: "3.3 Open Source Dependencies",
    p3_3_desc: "इतर आधुनिक सॉफ्टवेअर उत्पादनांप्रमाणे Classgrid देखील Node.js, React, MongoDB, Redis इत्यादी ओपन-सोर्स तंत्रज्ञानांचा वापर करते. अशा अनेक ओपन-सोर्स घटकोंवर आधारित संपूर्ण उत्पादनाला पेटंट करणे व्यावहारिक किंवा योग्य ठरत नाही.",
    p3_4: "3.4 पेटंट नाही, तर अंमलबजावणी (Execution) महत्त्वाची आहे",
    p3_4_desc: "SaaS उद्योगात, स्पर्धात्मक फायदा यातून मिळतो:",
    executionList: [
      "अंमलबजावणीचा वेग (Speed of execution) आणि पुनरावृत्ती (iteration)",
      "वापरकर्त्याच्या अनुभवाची गुणवत्ता (Quality of user experience)",
      "वैशिष्ट्ये आणि इंटिग्रेशनची खोली",
      "ग्राहकांचा विश्वास आणि टिकवून ठेवणे (Retention)",
      "ब्रँड मान्यता"
    ],
    p3_4_outro: "यांचे पेटंट घेता येत नाही. हे पर्यायांपेक्षा अधिक चांगले, वेगवान आणि अधिक विश्वसनीय बनवून संरक्षित केले जातात.",
    p5_desc: "जर कोणी तुम्हाला विचारले: “Classgrid पेटंट केलेले आहे का?” तर त्याचे सोपे उत्तर असे आहे:",
    p5_quote: "Classgrid हे Google Workspace, Zoho किंवा Tally प्रमाणे एक SaaS (Software-as-a-Service) उत्पादन आहे. SaaS उत्पादनांच्या संरक्षणासाठी पेटंट हा एकमेव किंवा सामान्य मार्ग नसतो. Classgrid ची बौद्धिक संपदा कॉपीराइट कायदा, Trade Secrets म्हणजेच खाजगी Codebase आणि अंतर्गत तंत्रज्ञान, Trademark Law म्हणजे ब्रँड संरक्षण आणि Government MSME Registration यांच्या माध्यमातून संरक्षित केली जाते. भारतीय पेटंट कायद्यातील The Patents Act, 1970 च्या Section 3(k) मध्ये computer programmes per se, business methods आणि algorithms यांच्या पेटंटयोग्यतेवर स्पष्ट मर्यादा घालण्यात आल्या आहेत.",
    statusActive: "सक्रिय",
    statusNA: "लागू नाही",
    statusNo: "नाही",
    legalBasis: "कायदेशीर आधार:",
    tableCompany: "कंपनी",
    tableType: "प्रकार",
    tablePatented: "मुख्य उत्पादन पेटंट केले आहे का?",
    tableMethod: "संरक्षण पद्धत",
    tableStatus: "स्थिती",
  }
};

export function IPProtectionClient() {
  const [activeSection, setActiveSection] = useState("purpose");
  const [lang, setLang] = useState<Language>("en");

  const s = STRINGS[lang];
  const sections = SECTIONS[lang];
  const protectionMethods = PROTECTION_METHODS[lang];

  function scrollToSection(id: string) {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 dark:bg-[#0a0a0b] dark:text-slate-200">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#111113]/80 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{s.back}</span>
            </Link>
            <span className="hidden text-slate-300 dark:text-slate-600 sm:inline">|</span>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                IP Protection Policy
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={lang}
              onValueChange={(value) => setLang(value as Language)}
            >
              <SelectTrigger className="h-8 w-fit gap-2 rounded-lg bg-white px-3 py-1.5 font-medium dark:bg-white/5">
                <Globe className="h-4 w-4 text-slate-400" />
                <SelectValue>
                  {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : "मराठी"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:block">
              <ThemeModeSwitcher />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              {s.print}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        {/* Sidebar Table of Contents */}
        <nav className="sticky top-20 hidden h-fit w-56 shrink-0 lg:block print:hidden">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {s.onThisPage}
          </p>
          <ul className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      isActive
                        ? "bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {section.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Hero */}
          <div className="mb-12 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 dark:border-white/5 dark:from-emerald-500/5 dark:via-[#111113] dark:to-teal-500/5 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {s.title}
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {s.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300 print:hidden">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                    {s.effective}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                    {s.updated}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Purpose */}
          <section id="purpose" className="mb-12 scroll-mt-24">
            <SectionHeading icon={BookOpen} title={`1. ${sections[0].title}`} />
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p1}
            </p>
          </section>

          {/* Section 2: What Is Classgrid */}
          <section id="what-is-classgrid" className="mb-12 scroll-mt-24">
            <SectionHeading icon={Shield} title={`2. ${sections[1].title}`} />
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p2}
            </p>
            <div className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                <strong>{s.p2_highlight}</strong>
              </p>
            </div>
          </section>

          {/* Section 3: Why No Patent */}
          <section id="why-no-patent" className="mb-12 scroll-mt-24">
            <SectionHeading icon={FileText} title={`3. ${sections[2].title}`} />

            <h3 className="mb-3 mt-6 text-base font-semibold text-slate-800 dark:text-white">
              {s.p3_1}
            </h3>
            <p className="mb-4 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p3_1_desc}
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/5 dark:bg-transparent">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-white/[0.02] dark:hover:bg-white/[0.02]">
                    <TableHead className="w-[40%] font-semibold text-slate-700 dark:text-slate-300">
                      {s.tableCompany}
                    </TableHead>
                    <TableHead className="w-[30%] font-semibold text-slate-700 dark:text-slate-300">
                      {s.tableType}
                    </TableHead>
                    <TableHead className="w-[30%] text-center font-semibold text-slate-700 dark:text-slate-300">
                      {s.tablePatented}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INDUSTRY_EXAMPLES.map((item) => (
                    <TableRow key={item.company} className="dark:border-white/5">
                      <TableCell className="font-medium text-slate-800 dark:text-white">
                        {item.company}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">
                        {item.type}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10">
                          <XCircle className="mr-1 h-3 w-3" /> {s.statusNo}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <h3 className="mb-3 mt-8 text-base font-semibold text-slate-800 dark:text-white">
              {s.p3_2}
            </h3>
            <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-500/10 dark:bg-amber-500/5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                {s.p3_2_desc}
              </p>
            </div>

            <h3 className="mb-3 mt-8 text-base font-semibold text-slate-800 dark:text-white">
              {s.p3_3}
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p3_3_desc}
            </p>

            <h3 className="mb-3 mt-8 text-base font-semibold text-slate-800 dark:text-white">
              {s.p3_4}
            </h3>
            <p className="mb-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p3_4_desc}
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1.5 text-[15px] text-slate-700 dark:text-slate-200">
              {s.executionList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p3_4_outro}
            </p>
          </section>

          {/* Section 4: How Protected */}
          <section id="how-protected" className="mb-12 scroll-mt-24">
            <SectionHeading icon={Lock} title={`4. ${sections[3].title}`} />
            <div className="mt-2 space-y-4">
              {protectionMethods.map((item) => {
                const Icon = item.icon;
                const isNA = item.status === "not-applicable";
                return (
                  <Card
                    key={item.method}
                    className={`border transition-all ${
                      isNA
                        ? "border-red-200/60 bg-red-50/30 dark:border-red-500/10 dark:bg-red-500/5"
                        : "border-slate-200/80 bg-white dark:border-white/5 dark:bg-white/[0.02]"
                    }`}
                  >
                    <CardContent className="flex items-start gap-3 p-5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isNA
                            ? "bg-red-100 dark:bg-red-500/10"
                            : "bg-emerald-100 dark:bg-emerald-500/10"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            isNA
                              ? "text-red-500 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-slate-800 dark:text-white">
                            {item.method}
                          </h4>
                          {isNA ? (
                            <Badge variant="destructive" className="bg-red-100 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10">
                              <XCircle className="mr-1 h-3 w-3" /> {s.statusNA}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> {s.statusActive}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {s.legalBasis} {item.basis}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Section 5: For Students & Faculty */}
          <section id="summary-students" className="mb-12 scroll-mt-24">
            <SectionHeading
              icon={Landmark}
              title={`5. ${sections[4].title}`}
            />
            <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-500/10 dark:from-emerald-500/5 dark:to-teal-500/5">
              <p className="text-sm font-medium leading-relaxed text-emerald-900 dark:text-emerald-100">
                {s.p5_desc}
              </p>
              <blockquote className="mt-4 border-l-4 border-emerald-400 pl-4 text-[15px] leading-relaxed text-slate-700 dark:border-emerald-500 dark:text-slate-200">
                &ldquo;{s.p5_quote}&rdquo;
              </blockquote>
            </div>
          </section>

          {/* Section 6: For Investors & Partners */}
          <section id="summary-investors" className="mb-12 scroll-mt-24">
            <SectionHeading icon={Copyright} title={`6. ${sections[5].title}`} />
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/5 dark:bg-transparent">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-white/[0.02] dark:hover:bg-white/[0.02]">
                    <TableHead className="w-[30%] font-semibold text-slate-700 dark:text-slate-300">
                      {s.tableMethod}
                    </TableHead>
                    <TableHead className="w-[20%] text-center font-semibold text-slate-700 dark:text-slate-300">
                      {s.tableStatus}
                    </TableHead>
                    <TableHead className="w-[50%] font-semibold text-slate-700 dark:text-slate-300">
                      {s.legalBasis}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {protectionMethods.map((row) => {
                    const isNA = row.status === "not-applicable";
                    return (
                      <TableRow key={row.method} className="dark:border-white/5">
                        <TableCell className="font-medium text-slate-800 dark:text-white">
                          {row.method}
                        </TableCell>
                        <TableCell className="text-center text-slate-700 dark:text-slate-200">
                          {isNA ? (
                            <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10">
                              <XCircle className="mr-1 h-3 w-3" /> {s.statusNo}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> {s.statusActive}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-300">
                          {row.basis}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Section 7: Contact */}
          <section id="contact" className="mb-16 scroll-mt-24">
            <SectionHeading icon={ExternalLink} title={`7. ${sections[6].title}`} />
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.footerContact}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a 
                href="mailto:support@classgrid.in"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                <ExternalLink className="h-4 w-4" />
                support@classgrid.in
              </a>
              <Link 
                href="/"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                <Globe className="h-4 w-4" />
                classgrid.in
              </Link>
            </div>
          </section>

          {/* Footer Note */}
          <div className="border-t border-slate-200/80 pt-6 dark:border-white/5">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {s.footerNote1}
              <Link href="/ip-protection" className="text-emerald-500 hover:underline">
                classgrid.in/ip-protection
              </Link>
              .
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {s.footerNote2}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}
