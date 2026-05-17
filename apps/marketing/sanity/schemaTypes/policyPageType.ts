import { defineField, defineType } from 'sanity'

export const policyPageType = defineType({
  name: 'policyPage',
  title: 'Policy Page (Privacy, Terms, Security)',
  type: 'document',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Policy Type',
      type: 'string',
      options: {
        list: ['privacy', 'terms', 'security', 'cookie'],
      },
      description: 'Which policy page is this?',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
      description: 'Full policy content with legal text',
    }),
    defineField({
      name: 'sections',
      title: 'Sections (for ToC)',
      type: 'array',
      of: [
        defineField({
          name: 'section',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Section Title', type: 'string' }),
            defineField({ name: 'anchor', title: 'Anchor ID', type: 'string' }),
          ],
        }),
      ],
      description: 'Auto-generated Table of Contents',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string' }),
      ],
    }),
  ],
  initialValue: {
    lastUpdated: new Date().toISOString(),
  },
})
