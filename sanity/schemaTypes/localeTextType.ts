import { defineType, defineField } from "sanity";

export const localeTextType = defineType({
  title: "Localized Text",
  name: "localeText",
  type: "object",
  fieldsets: [
    {
      title: "Translations",
      name: "translations",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      title: "English",
      name: "en",
      type: "text",
    }),
    defineField({
      title: "Hindi (हिंदी)",
      name: "hi",
      type: "text",
      fieldset: "translations",
    }),
    defineField({
      title: "Marathi (मराठी)",
      name: "mr",
      type: "text",
      fieldset: "translations",
    }),
  ],
});
