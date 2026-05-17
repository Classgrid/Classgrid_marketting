import { defineField, defineType } from 'sanity'

export const useCasesLandingLinkType = defineType({
  name: 'useCasesLandingLink',
  title: 'Use Cases Landing Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'href', title: 'Href', type: 'string' }),
  ],
})

export const useCasesLandingPageType = defineType({
  name: 'useCasesLandingPage',
  title: 'Use Cases Landing Page',
  type: 'document',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2 }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'useCasesLandingLink' }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'use-cases' }),
      ],
    }),
  ],
})
