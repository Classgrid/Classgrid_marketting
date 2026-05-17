import { defineField, defineType } from 'sanity'

export const isometricStackType = defineType({
  name: 'isometricStack',
  title: 'Isometric Stack Section',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker Text', type: 'string', description: 'e.g. THE CLASSGRID ERP STACK' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 3 }),
    defineField({
      name: 'phases',
      title: 'Stack Phases',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'stackPhase',
          title: 'Phase',
          fields: [
            defineField({ name: 'title', title: 'Title (use \\n for line break)', type: 'string' }),
            defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 2 }),
            defineField({
              name: 'bullets',
              title: 'Bullet Points',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
      validation: (Rule) => Rule.max(6).error('Maximum 6 phases (one per SVG layer)'),
    }),
  ],
})
