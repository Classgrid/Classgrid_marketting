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
  ],
});
