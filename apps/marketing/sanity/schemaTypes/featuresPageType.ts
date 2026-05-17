import { defineField, defineType } from 'sanity'

export const featureType = defineType({
  name: 'feature',
  title: 'Feature Item',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'icon', title: 'Icon', type: 'image', options: { hotspot: true } }),
  ],
})

export const featuresPageType = defineType({
  name: 'featuresPage',
  title: 'Features Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Everything you need. Nothing you don\'t.',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'feature' }],
      description: 'List of core features',
    }),
    defineField({
      name: 'coreModules',
      title: 'Core Modules',
      type: 'array',
      of: [
        defineField({
          name: 'module',
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Module Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', title: 'Icon', type: 'image' }),
          ],
        }),
      ],
      description: '10+ ERP modules (Chat, Exams, Timetable, Fees, etc.)',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'features' }),
      ],
    }),
  ],
})
