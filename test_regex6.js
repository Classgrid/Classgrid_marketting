const text = `[ESCALATE: Sunita Shinde (sunitasubhashsun123@gmail.com) has reported critical technical issues with the exam portal failing to load and the fee dashboard crashing instantly. These issues are disrupting her workflow and require immediate attention from the technical team. The user is a verified platform user with account details: Username: Sunita Shinde, Email: sunitasubhashsun123@gmail.com. She is following up on a previous support request regarding login issues. The team must investigate the backend causes of these failures and provide a resolution as soon as possible.

SUBJECT: Urgent: Exam Portal and Fee Dashboard Failure - Sunita Shinde
CATEGORY: technical
PRIORITY: high
DRAFT: Hi Sunita,

Thank you for bringing these critical issues to our attention. We understand how disruptive the exam portal and fee dashboard failures are, and we are treating this as a high-priority issue.

Our technical team is currently reviewing the exam portal and fee dashboard crashes. We will investigate the root cause of these failures and provide a resolution as soon as possible. You will receive an update from our support team via email once we have taken action.

In the meantime, please avoid using the affected portals to prevent further disruption. If you encounter any additional issues, do not hesitate to reach out to us immediately.

We appreciate your patience and will ensure this is resolved promptly.

Best regards,
[ADMIN_NAME]
]`;

const ESCALATE_SUMMARY_GROUP = `((?:(?!\\s*\\|?\\s*(?:SUBJECT|CATEGORY|PRIORITY|DRAFT):)[\\s\\S])+?)`;
const ESCALATE_RE = new RegExp(
  `\\[ESCALATE:\\s*${ESCALATE_SUMMARY_GROUP}(?:\\s*\\|?\\s*SUBJECT:\\s*([\\s\\S]+?))?(?:\\s*\\|?\\s*CATEGORY:\\s*([\\s\\S]+?))?(?:\\s*\\|?\\s*PRIORITY:\\s*([\\s\\S]+?))?(?:\\s*\\|?\\s*DRAFT:\\s*([\\s\\S]+))?\\]`, "i"
);

console.log("Matches?", ESCALATE_RE.test(text));
if(ESCALATE_RE.test(text)) {
    const match = text.match(ESCALATE_RE);
    console.log("Summary:", match[1]);
    console.log("Subject:", match[2]);
    console.log("Category:", match[3]);
    console.log("Priority:", match[4]);
    console.log("Draft:", match[5]);
}
