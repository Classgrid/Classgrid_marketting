import { defineField, defineType } from 'sanity'

export const classgridTeamVisionType = defineType({
  name: 'classgridTeamVision',
  title: '👥 Team Vision',
  type: 'document',
  fields: [
    defineField({
      name: 'isVisible',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to show the Team Vision quotes section on the homepage.',
    }),
    defineField({
      name: 'label',
      title: 'Section Label (small tag above title)',
      type: 'string',
      placeholder: 'e.g. From Our Team',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      placeholder: 'e.g. Built With Purpose',
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
      rows: 2,
      placeholder: 'e.g. The people behind Classgrid share why they built it.',
    }),
    defineField({
      name: 'quotes',
      title: 'Team Member Quotes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'role', title: 'Role / Title', type: 'string', placeholder: 'e.g. Founder & CEO' },
            { name: 'quote', title: 'Quote', type: 'text', rows: 4 },
            {
              name: 'avatar',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', title: 'Alt text', type: 'string' }
              ]
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'role' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isVisible: 'isVisible',
    },
    prepare({ title, isVisible }) {
      return {
        title: title || 'Team Vision Section',
        subtitle: isVisible ? '✅ Visible on Homepage' : '❌ Hidden',
      }
    },
  },
})
