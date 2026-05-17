import { defineField, defineType } from 'sanity'

export const comparisonPageType = defineType({
  name: 'comparisonPage',
  title: 'Comparison Page (vs Competitors)',
  type: 'document',
  fields: [
    defineField({
      name: 'competitorName',
      title: 'Competitor Name',
      type: 'string',
      description: 'e.g., "Google Classroom", "Canvas", "Moodle"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      description: 'URL: /compare/[slug]',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Classgrid vs [Competitor]',
    }),
    defineField({
      name: 'intro',
      title: 'Intro Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Why Classgrid is better',
    }),
    defineField({
      name: 'comparisonTable',
      title: 'Feature Comparison',
      type: 'array',
      of: [
        defineField({
          name: 'row',
          type: 'object',
          fields: [
            defineField({ name: 'feature', title: 'Feature', type: 'string' }),
            defineField({ name: 'classgrid', title: 'Classgrid', type: 'string' }),
            defineField({ name: 'competitor', title: 'Competitor', type: 'string' }),
            defineField({ name: 'winner', title: 'Classgrid Wins?', type: 'boolean', initialValue: true }),
          ],
        }),
      ],
      description: 'Side-by-side feature comparison',
    }),
    defineField({
      name: 'uniqueAdvantages',
      title: 'Unique Advantages of Classgrid',
      type: 'array',
      of: [
        defineField({
          name: 'advantage',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', title: 'Icon', type: 'image' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'CTA Text',
      type: 'string',
      initialValue: 'See Why Classgrids Wins',
    }),
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
