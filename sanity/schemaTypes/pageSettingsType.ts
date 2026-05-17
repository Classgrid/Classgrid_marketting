import { defineField, defineType } from 'sanity'

export const pageSettingsType = defineType({
  name: 'pageSettings',
  title: 'Page Settings',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'kicker', title: 'Kicker', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' }),
    defineField({ name: 'primaryCtaHref', title: 'Primary CTA Href', type: 'string' }),
    defineField({ name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' }),
    defineField({ name: 'secondaryCtaHref', title: 'Secondary CTA Href', type: 'string' }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
      ],
    }),
  ],
})
