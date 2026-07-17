type CookieSpan = { _type: "span"; text: string; marks: string[] };

const cookieSpan = (text: string, marks: string[] = []): CookieSpan => ({ _type: "span", text, marks });

const cookieBlock = (
  children: string | CookieSpan[],
  options: { style?: string; listItem?: "bullet" } = {},
) => ({
  _type: "block",
  style: options.style ?? "normal",
  ...(options.listItem ? { listItem: options.listItem } : {}),
  children: typeof children === "string" ? [cookieSpan(children)] : children,
});

const cookieHeading = (text: string) => cookieBlock(text, { style: "h3" });
const cookieBullet = (text: string) => cookieBlock(text, { listItem: "bullet" });
const cookieLabeledBullet = (label: string, text: string) =>
  cookieBlock([cookieSpan(label, ["strong"]), cookieSpan(`: ${text}`)], { listItem: "bullet" });

export const cookiePolicy = {
  title: "Cookie Policy",
  updated: "Last Updated: July 17, 2026",
  sections: [
    {
      heading: "1. WHAT ARE COOKIES?",
      content: [
        cookieBlock("Cookies are small text files stored by a website in Your browser. Classgrid also uses Local Storage and Session Storage for application state and preferences."),
        cookieBlock("Authentication may use an HttpOnly cookie named token set by the server. In some browser flows, the client may store a signed token under the token key in Local Storage as a bearer-token fallback for API requests. A signed token is an authentication credential, not a link or URL, and it must not be placed in a URL."),
        cookieHeading("Storage technologies used"),
        cookieLabeledBullet("Cookies", "Small text files stored in Your browser."),
        cookieLabeledBullet("Local Storage", "Browser storage that persists until it is cleared."),
        cookieLabeledBullet("Session Storage", "Browser storage that is cleared when the browser tab is closed."),
      ],
    },
    {
      heading: "2. HOW WE USE COOKIES AND SIMILAR TECHNOLOGIES",
      content: [
        cookieBlock("We use cookies and similar technologies only to provide authentication, security, tenant experience, and user-interface functionality."),
        cookieHeading("2.1 Strictly Necessary"),
        cookieLabeledBullet("token", "The server sets the authentication cookie named token. It is HttpOnly, Secure in production, and protected by SameSite. Its default lifetime is 24 hours on desktop, 7 days when Remember Me is selected, and up to 365 days for mobile-app requests. The browser sends the HttpOnly cookie automatically with requests. In some browser flows, the client may store a signed token under the token key in Local Storage as a fallback for API requests."),
        cookieLabeledBullet("parent_token", "A Local Storage token used by the parent portal workflow."),
        cookieLabeledBullet("admission_token", "A Local Storage token used by the admission candidate portal workflow."),
        cookieLabeledBullet("rescue_token", "A temporary Local Storage token used for a restricted security workflow."),
        cookieLabeledBullet("client_device_fp", "An HttpOnly security cookie used for trusted-device verification after device verification. The implementation sets a one-year lifetime."),
        cookieLabeledBullet("sidebar_state", "A first-party cookie that remembers whether the dashboard sidebar is open or collapsed. The implementation sets a seven-day lifetime."),
        cookieHeading("2.2 Functional"),
        cookieLabeledBullet("org_title and org_favicon", "Organization branding preferences that may be stored in Local Storage."),
        cookieBullet("The selected theme and last selected authentication role may be stored in browser storage."),
        cookieLabeledBullet("push_banner_dismissed", "Remembers whether a notification prompt was dismissed."),
        cookieLabeledBullet("draft-[id]", "Stores an unsent chat draft until the message is sent, removed, or cleared."),
        cookieLabeledBullet("reset_success_[token]", "A short-lived Local Storage entry used by the relevant password-reset workflow."),
        cookieBullet("Other temporary authenticated workflows may use short-lived browser-storage entries."),
        cookieHeading("2.3 Performance and Analytics"),
        cookieBlock("The reviewed platform runtime does not set third-party analytics or advertising cookies. Server-side operational logs and analytics are not browser cookies."),
        cookieHeading("2.4 What We Do Not Use"),
        cookieBullet("Advertising cookies or behavioral retargeting cookies."),
        cookieBullet("Social-media tracking pixels in the reviewed platform runtime."),
        cookieBullet("Cross-site advertising or browsing-history tracking."),
        cookieBullet("A limited trusted-device security cookie may be used for authentication protection. This Policy does not claim that no device-security metadata is ever processed."),
      ],
    },
    {
      heading: "3. COOKIES ON TENANT WEBSITES",
      content: [
        cookieBlock("Tenant websites may use first-party cookies or browser storage required by the deployed website template, such as session handling, branding, accessibility, or basic preferences. The exact storage keys can vary by tenant configuration and deployment."),
        cookieBlock("The reviewed platform repository does not implement universal fixed keys named tenant_theme or visitor_session. They are not described as universal Classgrid cookies in this Policy."),
        cookieBlock("A Tenant Organization may independently add an external service or embed. Those third-party services may set their own cookies, and their privacy and cookie policies apply to that activity."),
      ],
    },
    {
      heading: "4. COOKIES ON THE MOBILE APP",
      content: [
        cookieBlock("A native mobile application does not use browser cookies in the same way as a web browser. Where a native client is used, authentication and preferences are managed by that application's storage implementation. This browser Cookie Policy does not replace the mobile application's own privacy disclosures."),
      ],
    },
    {
      heading: "5. MANAGING YOUR COOKIE PREFERENCES",
      content: [
        cookieHeading("5.1 Browser Settings"),
        cookieBlock("You can view, delete, or block first-party cookies through Your browser settings. Blocking the authentication cookie may prevent You from signing in or using protected features."),
        cookieHeading("5.2 Impact of Disabling Storage"),
        cookieBullet("You may be unable to log in or remain authenticated."),
        cookieBullet("The dashboard may not remember the selected theme, branding, sidebar state, or dismissed prompts."),
        cookieBullet("Unsaved chat drafts may be lost when browser storage is cleared."),
        cookieHeading("5.3 Local Storage and Session Storage"),
        cookieBlock("To clear Local Storage or Session Storage, open browser Developer Tools, select Application or Storage, choose the relevant origin, and delete the stored entries. Clearing Local Storage may sign You out and remove saved preferences or drafts."),
      ],
    },
    {
      heading: "6. DATA COLLECTED THROUGH COOKIES",
      content: [
        cookieHeading("6.1 What We Collect"),
        cookieBlock("Depending on the feature and authentication flow, browser storage may process:"),
        cookieBullet("Authentication status and signed authentication-token data."),
        cookieBullet("User, role, or organization identifiers needed to authorize a request."),
        cookieBullet("Trusted-device verification metadata."),
        cookieBullet("Theme, sidebar, branding, notification, and draft preferences."),
        cookieHeading("6.2 How We Use It"),
        cookieBlock("The reviewed platform runtime does not use this browser storage for advertising, sale of personal information, or cross-site behavioral profiling."),
      ],
    },
    {
      heading: "7. CHILDREN AND COOKIES",
      content: [
        cookieBlock("Essential authentication and security storage may be used by Users, including minor students, when an institution provides access to the Platform."),
        cookieBlock("Classgrid does not use browser storage for behavioral advertising or profiling of minor students. Tenant Organizations remain responsible for obtaining required consent and providing appropriate notices for their Users."),
      ],
    },
    {
      heading: "8. THIRD-PARTY COOKIES",
      content: [
        cookieHeading("8.1 Current Third-Party Cookies"),
        cookieBlock("The core platform runtime reviewed for this Policy does not actively set third-party advertising or analytics cookies."),
        cookieHeading("8.2 Embedded Content"),
        cookieBlock("Third-party cookies may be set by content embedded or independently configured on a tenant website, such as a video player, map, analytics tool, or other external service. Classgrid does not control those third-party cookies. Please refer to the applicable third party's policy for details."),
      ],
    },
    {
      heading: "9. CHANGES TO THIS COOKIE POLICY",
      content: [
        cookieBlock("We may update this Cookie Policy when storage behavior, security controls, or applicable legal requirements change. When material changes are made, We will update the Last Updated date and provide notice through the Platform or email where appropriate."),
      ],
    },
    {
      heading: "10. CONTACT US",
      content: [
        cookieBlock("For questions about this Cookie Policy or Our use of cookies, please contact:"),
        cookieBlock([cookieSpan("Classgrid Technologies", ["strong"])]),
        cookieLabeledBullet("Email", "privacy@classgrid.in"),
        cookieLabeledBullet("Support", "support@classgrid.in"),
        cookieLabeledBullet("Phone", "+91 8623947038 / +91 8149277038"),
        {
          ...cookieBlock([cookieSpan("Website", ["strong"]), cookieSpan(": "), cookieSpan("https://classgrid.in", ["cookie-site-link"])]),
          listItem: "bullet",
          markDefs: [{ _key: "cookie-site-link", _type: "link", href: "https://classgrid.in" }],
        },
        cookieLabeledBullet("Address", "Akurdi Railway Station Road, Sector No. 26, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044, India"),
        cookieBlock("This Cookie Policy is an electronic record within the meaning of the Information Technology Act, 2000, and the rules made thereunder."),
        cookieBlock("Copyright 2026 Classgrid Technologies. All rights reserved."),
      ],
    },
  ],
};
