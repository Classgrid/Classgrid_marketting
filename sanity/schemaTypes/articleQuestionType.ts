import { defineField, defineType } from "sanity";

export const articleQuestionType = defineType({
  name: "articleQuestion",
  title: "Article Questions",
  type: "document",
  fields: [
    defineField({
      name: "articleTitle",
      title: "Article Title",
      type: "string",
      readOnly: true,
      description: "The title of the article where this question was asked.",
    }),
    defineField({
      name: "articleSlug",
      title: "Article Slug/URL",
      type: "string",
      readOnly: true,
      description: "The slug of the article.",
    }),
    defineField({
      name: "question",
      title: "The Question / Doubt",
      type: "text",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Action Taken", value: "action_taken" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "articleTitle",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, status } = selection;
      const statusEmoji = status === "new" ? "🔴" : status === "reviewed" ? "🟡" : "🟢";
      return {
        title: title ? `${statusEmoji} ${title}` : "Untitled Question",
        subtitle: subtitle ? `Article: ${subtitle}` : "Unknown Article",
      };
    },
  },
});
