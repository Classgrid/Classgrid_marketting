import { defineField, defineType } from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'e.g., "Our Journey: Democratizing Elite EdTech"',
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Main content about the company',
    }),
    defineField({
      name: 'mission',
      title: 'Mission Statement',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'vision',
      title: 'Vision Statement',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'teamImage',
      title: 'Team Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        defineField({
          name: 'value',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'about' }),
      ],
    }),
  ],
})
