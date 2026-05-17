import { defineField, defineType } from 'sanity'

export const institutionCounterType = defineType({
  name: 'institutionCounter',
  title: 'Institution Counter',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'value', title: 'Value', type: 'number' }),
    defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
  ],
})

export const institutionPageType = defineType({
  name: 'institutionPage',
  title: 'Institutions (Legacy)',
  type: 'document',
  fields: [
    defineField({
      name: 'institutionType',
      title: 'Institution Type',
      type: 'string',
      options: {
        list: ['college', 'junior-college', 'coaching', 'school', 'engineering'],
      },
    }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'subline', title: 'Subline', type: 'text', rows: 2 }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'feature', title: 'Feature', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'icon', title: 'Icon', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'roleExperiences',
      title: 'Role Experiences',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'roleName', title: 'Role Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'marketing',
      title: 'Marketing Highlight',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
        defineField({ name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'counters',
      title: 'Counters',
      type: 'array',
      of: [{ type: 'institutionCounter' }],
    }),
    defineField({
      name: 'body',
      title: 'Page Content Details',
      type: 'richBody',
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
})
