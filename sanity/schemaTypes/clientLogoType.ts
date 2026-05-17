import { defineField, defineType } from 'sanity'

export const clientLogoType = defineType({
  name: 'clientLogo',
  title: 'Client Logo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'College / Institution Name',
      type: 'string',
      description: 'Full name e.g. "Pimpri Chinchwad College of Engineering"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'College Logo (Crest / Icon)',
      type: 'image',
      description: 'Upload the college crest or icon logo here.',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'wordmark',
      title: 'Styled Name Image (Optional)',
      type: 'image',
      description: 'Upload a PNG of the college name in their own font/style (e.g. "Bharati Vidyapeeth" in gothic). If uploaded, this replaces plain text name.',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'nameColor',
      title: 'Name Color (Optional)',
      type: 'string',
      description: 'Hex color for the college name text if they have a brand color. Example: #1a3fba for blue. Leave blank for default white.',
    }),
    defineField({
      name: 'href',
      title: 'Link (Optional)',
      type: 'string',
      description: 'Where to link when clicked. Example: /institutions/pccoe',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shows first in the marquee.',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'College Name A–Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
