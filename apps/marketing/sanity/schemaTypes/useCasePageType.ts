import { defineField, defineType } from 'sanity'

export const useCasePageType = defineType({
  name: 'useCasePage',
  title: 'Use Case Page',
  type: 'document',
  fields: [
    defineField({
      name: 'audience',
      title: 'Audience',
      type: 'string',
      description: 'coaching / college / junior-college / school / students / teachers / institutes',
      options: {
        list: ['coaching', 'college', 'junior-college', 'school', 'students', 'teachers', 'institutes'],
      },
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
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
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', title: 'Icon', type: 'image' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
        defineField({ name: 'author', title: 'Author Name', type: 'string' }),
        defineField({ name: 'role', title: 'Author Role', type: 'string' }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'See How It Works',
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
