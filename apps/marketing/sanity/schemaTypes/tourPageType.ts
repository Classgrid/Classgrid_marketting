import { defineField, defineType } from 'sanity'

export const tourStepType = defineType({
  name: 'tourStep',
  title: 'Tour Step',
  type: 'object',
  fields: [
    defineField({ name: 'stepNumber', title: 'Step Number', type: 'number' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', title: 'Screenshot/Image', type: 'image', options: { hotspot: true } }),
  ],
})

export const tourPageType = defineType({
  name: 'tourPage',
  title: 'How It Works / Product Tour',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'From Zero to Digital Campus in 5 Minutes',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'steps',
      title: 'Tour Steps',
      type: 'array',
      of: [{ type: 'tourStep' }],
      description: '3-5 step walkthrough of the platform',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Introduction Video URL',
      type: 'url',
      description: 'YouTube or Vimeo embed URL',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'tour' }),
      ],
    }),
  ],
})
