import { defineField, defineType } from 'sanity'

export const classgridTalkType = defineType({
  name: 'classgrid_talk',
  title: 'Classgrid Talk (Testimonial)',
  type: 'document',
  fields: [
    defineField({ 
      name: 'name', 
      title: 'Person Name', 
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ 
      name: 'role', 
      title: 'Role', 
      type: 'string',
      description: 'e.g., Principal, Academic Coordinator',
    }),
    defineField({ 
      name: 'college', 
      title: 'College / Organization Name', 
      type: 'string' 
    }),
    defineField({
      name: 'quote',
      title: 'Review (Quote)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text: Use bold, italics, bullet points, etc.',
    }),
    defineField({
      name: 'avatar',
      title: 'Passport Size Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Brief description of image (e.g. "Photo of John Doe")' })],
    }),
    defineField({
      name: 'institutionLogo',
      title: 'Institution Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Brief description (e.g. "Stanford University Logo")' })],
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating (1-5)',
      type: 'number',
      validation: (rule) => rule.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first in the carousel',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'college',
      media: 'avatar',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
