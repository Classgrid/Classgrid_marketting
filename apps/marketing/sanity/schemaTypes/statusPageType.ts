import { defineField, defineType } from 'sanity'

export const statusSystemType = defineType({
  name: 'statusSystem',
  title: 'Status System',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'System Name', type: 'string' }),
    defineField({ name: 'status', title: 'Status', type: 'string' }),
    defineField({ name: 'latency', title: 'Latency', type: 'string' }),
  ],
})

export const statusPageType = defineType({
  name: 'statusPage',
  title: 'Status Page',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2 }),
    defineField({
      name: 'systems',
      title: 'Systems',
      type: 'array',
      of: [{ type: 'statusSystem' }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'status' }),
      ],
    }),
  ],
})
