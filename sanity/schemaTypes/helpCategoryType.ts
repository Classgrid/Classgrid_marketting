import { defineField, defineType } from 'sanity'

export const helpCategoryType = defineType({
  name: 'helpCategory',
  title: 'Help Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'e.g., "Getting Started" or "API Reference"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name (Lucide React)',
      description: 'e.g., Shield, BookOpen, Code2, HelpCircle, Zap, FileText',
      type: 'string',
    }),
    defineField({
      name: 'categoryType',
      title: 'Category Type',
      type: 'string',
      description: 'articles = shows filtered articles. link = navigates to a URL.',
      options: {
        list: [
          { title: 'Articles (filter help articles)', value: 'articles' },
          { title: 'External Link (navigate to URL)', value: 'link' },
        ],
        layout: 'radio',
      },
      initialValue: 'articles',
    }),
    defineField({
      name: 'externalHref',
      title: 'Link URL',
      description: 'Only for link-type. e.g. /faq, /changelog, https://docs.classgrid.in',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first',
      type: 'number',
      initialValue: 99,
    }),
  ],
})
