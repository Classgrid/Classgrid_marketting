import { defineField, defineType } from 'sanity'

export const campaignPageType = defineType({
  name: 'campaignPage',
  title: 'Campaign Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Campaign Title',
      type: 'string',
    }),
    defineField({
      name: 'campaignId',
      title: 'Campaign ID',
      type: 'string',
      description: 'Unique identifier (used in URL: /campaigns/:id)',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Ad-focused problem statement',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'string',
      description: 'e.g., School Principals, College Directors',
    }),
    defineField({
      name: 'painPoints',
      title: 'Pain Points Addressed',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Problems your product solves',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'benefits',
      title: 'Key Benefits',
      type: 'array',
      of: [
        defineField({
          name: 'benefit',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Benefit', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Primary CTA Text',
      type: 'string',
      initialValue: 'Book Your Free Setup Call Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link/URL',
      type: 'string',
    }),
    defineField({
      name: 'socialProof',
      title: 'Social Proof',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., "Used by 1000+ schools"',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug (path: /campaigns/:slug)', type: 'string' }),
      ],
    }),
  ],
})
