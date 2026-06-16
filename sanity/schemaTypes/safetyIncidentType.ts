import { defineField, defineType } from "sanity";

export const safetyIncidentType = defineType({
  name: "safetyIncident",
  title: "Safety Incident",
  type: "document",
  fields: [
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
      description: "The email address of the user who triggered the safety filter.",
      readOnly: true,
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "ipAddress",
      title: "IP Address",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "device",
      title: "Device Info",
      type: "string",
      description: "User-Agent string representing the browser and operating system.",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Action Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Review", value: "pending" },
          { title: "Warning Sent", value: "warned" },
          { title: "Banned", value: "banned" },
          { title: "Ignored/Dismissed", value: "ignored" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "flaggedMessages",
      title: "Flagged Messages (Violations)",
      type: "array",
      description: "A chronological list of all flagged messages sent by this user/IP.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "message",
              title: "Exact Message Sent",
              type: "text",
              readOnly: true,
            },
            {
              name: "timestamp",
              title: "Time Received",
              type: "datetime",
              readOnly: true,
            },
          ],
          preview: {
            select: {
              title: "message",
              subtitle: "timestamp",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "userEmail",
      subtitle: "status",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Anonymous User (IP tracked)",
        subtitle: `Status: ${subtitle ? subtitle.toUpperCase() : "PENDING"}`,
      };
    },
  },
});
