const text = `[ESCALATE: Sunita Shinde, a registered Classgrid platform user with email sunitasubhashsun123@gmail.com, is reporting critical technical failures in the Exam Portal and Fee Dashboard modules. She has previously faced login issues and is now experiencing complete system crashes that prevent her from accessing essential functionalities for exam management and fee processing. These disruptions are severely impacting her workflow and require immediate backend investigation. The issues include the Exam Portal failing to load and the Fee Dashboard crashing instantly upon opening. She has attempted basic troubleshooting steps like clearing her browser cache and updating her browser but continues to face the same problems. Urgent attention is required to resolve these failures and restore full functionality for her institution's operations.

SUBJECT: Urgent Technical Failure - Exam Portal and Fee Dashboard Crash | CATEGORY: technical | PRIORITY: high | DRAFT: Dear Sunita,

Thank you for bringing these critical issues to our attention. I’ve escalated your request to our technical team, who will investigate the Exam Portal and Fee Dashboard failures immediately. They will prioritize your request and provide updates as soon as they have more information.

In the meantime, please continue with the basic troubleshooting steps you’ve already tried, such as clearing your browser cache and ensuring you’re using a supported browser.

We will ensure that your account is monitored closely, and our specialists will reach out to you directly with a resolution timeline and any further steps you may need to take.

Best regards,
[ADMIN_NAME]
Classgrid Support Team]`;

const ESCALATE_SUMMARY_GROUP = `((?:(?!\\s*\\|?\\s*(?:SUBJECT|CATEGORY|PRIORITY|DRAFT):)[\\s\\S])+?)`;
const ESCALATE_RE = new RegExp(
  `\\[ESCALATE:\\s*${ESCALATE_SUMMARY_GROUP}(?:\\s*\\|?\\s*SUBJECT:\\s*([\\s\\S]+?))?(?:\\s*\\|?\\s*CATEGORY:\\s*([\\s\\S]+?))?(?:\\s*\\|?\\s*PRIORITY:\\s*([\\s\\S]+?))?(?:\\s*\\|?\\s*DRAFT:\\s*([\\s\\S]+))?\\]`, "i"
);

console.log("Matches:", ESCALATE_RE.test(text));
if(ESCALATE_RE.test(text)) {
    const match = text.match(ESCALATE_RE);
    console.log("Summary:", match[1]);
    console.log("Subject:", match[2]);
    console.log("Category:", match[3]);
    console.log("Priority:", match[4]);
    console.log("Draft:", match[5]);
}
