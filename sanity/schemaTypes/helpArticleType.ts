import { defineField, defineType } from 'sanity'

const createHelpArticleContentOf = () => [
  { type: 'block' },
  { type: 'image', options: { hotspot: true } },
  {
    type: 'object',
    name: 'externalImage',
    title: 'External Image URL',
    fields: [
      { name: 'url', type: 'url', title: 'Image URL' },
      { name: 'alt', type: 'string', title: 'Alt Text' },
    ],
  },
]

export const helpArticleType = defineType({
  name: 'helpArticle',
  title: 'Help Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value || typeof value !== 'object' || !('en' in value) || !(value as { en?: string }).en) {
            return 'English title is required.'
          }
          return true
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'helpCategory' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub-Category (Grouping)',
      description: 'Used to group articles together on the category page. E.g., "General", "Admission Workflow", "Fees", etc. Defaults to "General" if left blank.',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'A brief description of what this article covers',
      type: 'localeText',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'array', of: createHelpArticleContentOf() }),
        defineField({ name: 'hi', title: 'Hindi', type: 'array', of: createHelpArticleContentOf() }),
        defineField({ name: 'mr', title: 'Marathi', type: 'array', of: createHelpArticleContentOf() }),
      ],
    }),
    defineField({
      name: 'markdownBody',
      title: 'Markdown Body',
      description: 'Raw markdown content for articles imported from docs. When present, this is rendered instead of Portable Text content.',
      type: 'text',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      description: 'The date this article was first published. Displayed on the article page when "Show Dates" is enabled.',
      type: 'datetime',
    }),
    defineField({
      name: 'lastUpdatedAt',
      title: 'Last Updated Date',
      description: 'The date this article was last meaningfully updated. If set, displayed alongside the published date.',
      type: 'datetime',
    }),
    defineField({
      name: 'showDates',
      title: 'Show Dates',
      description: 'Toggle to show or hide the published/updated dates on the article page.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
