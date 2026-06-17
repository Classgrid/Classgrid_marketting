import { defineField, defineType } from "sanity";

export const aiEscalationType = defineType({
  name: "aiEscalation",
  title: "AI Escalations",
  type: "document",
  fields: [
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
      description: "Email of the user, if logged in.",
      readOnly: true,
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      description: "Name of the user, if logged in.",
      readOnly: true,
    }),
    defineField({
      name: "ipAddress",
      title: "IP Address",
      type: "string",
      description: "IP Address of the user.",
      readOnly: true,
    }),
    defineField({
      name: "deviceInfo",
      title: "Device Info",
      type: "string",
      description: "User-Agent string of the browser.",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Review Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Review", value: "pending" },
          { title: "Reviewed - Ignored", value: "ignored" },
          { title: "Ticket Handled", value: "handled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "ticketCreated",
      title: "Auto-Ticket Created",
      type: "boolean",
      description: "Was a support ticket automatically created in the main database for this?",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "aiSummary",
      title: "AI Problem Summary",
      type: "text",
      description: "Brief summary of the issue extracted by the AI.",
      readOnly: true,
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      description: "Subject of the escalated issue.",
      readOnly: true,
    }),
    defineField({
      name: "ticketId",
      title: "Ticket ID / Error",
      type: "string",
      description: "The created ticket ID, or the error message if creation failed.",
      readOnly: true,
    }),
    defineField({
      name: "chatTranscript",
      title: "Chat Transcript",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "role", type: "string", title: "Role" },
            { name: "content", type: "text", title: "Message" },
            { name: "timestamp", type: "datetime", title: "Timestamp" },
          ],
          preview: {
            select: {
              title: "content",
              subtitle: "role",
            },
            prepare(selection: any) {
              return {
                title: selection.title ? (selection.title.length > 50 ? selection.title.substring(0, 50) + "..." : selection.title) : "Empty message",
                subtitle: selection.subtitle ? selection.subtitle.toUpperCase() : "UNKNOWN",
              };
            },
          },
        },
      ],
      description: "The chat history leading up to the escalation.",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      email: "userEmail",
      ip: "ipAddress",
      status: "status",
      ticketCreated: "ticketCreated",
    },
    prepare(selection) {
      const { email, ip, status, ticketCreated } = selection;
      const title = email || ip || "Anonymous User";
      let subtitle = "";
      if (ticketCreated) {
        subtitle = "✅ Ticket Created";
      } else if (status === "pending") {
        subtitle = "⏳ Pending Review";
      } else if (status === "ignored") {
        subtitle = "❌ Ignored";
      } else if (status === "handled") {
        subtitle = "✅ Ticket Handled";
      } else {
        subtitle = status || "Unknown";
      }
      return {
        title: `Escalation: ${title}`,
        subtitle: subtitle,
      };
    },
  },
});
