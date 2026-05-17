import { defineField, defineType } from 'sanity'
import { Heart } from 'lucide-react'

export const acknowledgementType = defineType({
  name: 'acknowledgement',
  title: 'Acknowledgement',
  type: 'document',
  icon: Heart,
  fields: [
    defineField({
      name: 'name',
      title: 'Name / Entity',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Contributor', value: 'contributor' },
          { title: 'Mentor', value: 'mentor' },
          { title: 'Family / Above All', value: 'family' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title (Optional)',
      type: 'string',
      description: 'e.g., "mentor" or "Respected science Educator"',
    }),
    defineField({
      name: 'message',
      title: 'Message / Description',
      type: 'text',
      description: 'The gratitude message for this person.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers show first within their category.',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : '',
      }
    },
  },
})
