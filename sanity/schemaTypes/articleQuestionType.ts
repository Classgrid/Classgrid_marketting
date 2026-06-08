import { defineField, defineType } from "sanity";
import React from "react";

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
      components: {
        field: (props: any) => {
          const slug = props.value;
          const fullUrl = slug ? `https://classgrid.in/help-center/article/${slug}` : null;
          return React.createElement(
            'div',
            { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
            props.renderDefault(props),
            fullUrl
              ? React.createElement(
                  'div',
                  { style: { padding: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' } },
                  React.createElement(
                    'a',
                    {
                      href: fullUrl,
                      target: '_blank',
                      rel: 'noreferrer',
                      style: { color: '#10b981', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }
                    },
                    `View Live Article: ${fullUrl} ↗`
                  )
                )
              : null
          );
        }
      }
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
