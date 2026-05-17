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
  title: 'Institution Page',
  type: 'document',
  fields: [
    defineField({
      name: 'institutionType',
      title: 'Institution Type',
      type: 'string',
      options: {
        list: ['college', 'junior-college', 'coaching', 'school'],
      },
    }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subline', title: 'Subline', type: 'text', rows: 2 }),
    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'counters',
      title: 'Counters',
      type: 'array',
      of: [{ type: 'institutionCounter' }],
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
