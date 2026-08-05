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
      name: 'subtitle',
      title: 'Short Name / Subtitle (Optional)',
      type: 'string',
      description: 'Optional short name to display below the main name (e.g. "PCCOE" or "Pune").',
    }),
    defineField({
      name: 'logo',
      title: 'College Logo (Crest / Icon)',
      type: 'image',
      description: 'Upload the college crest or icon logo here. (Used in Light Mode)',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'logoDark',
      title: 'Dark Mode College Logo (Optional)',
      type: 'image',
      description: 'Upload a white or light-colored version of the crest/icon for Dark Mode. If left empty, the standard logo is used.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'wordmark',
      title: 'Styled Name Image (Optional)',
      type: 'image',
      description: 'Upload a PNG of the college name in their own font/style. If uploaded, this replaces plain text name. (Used in Light Mode)',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'wordmarkDark',
      title: 'Dark Mode Styled Name Image (Optional)',
      type: 'image',
      description: 'Upload a white or light-colored version of the wordmark for Dark Mode. If left empty, the standard wordmark is used.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'nameColor',
      title: 'Name Color (Optional)',
      type: 'string',
      description: 'Hex color for the college name text if they have a brand color. Example: #1a3fba for blue. Leave blank for default white.',
    }),
    defineField({
      name: 'hideName',
      title: 'Hide College Name',
      type: 'boolean',
      description: 'If turned on, only the logo will be displayed without the college name next to it.',
      initialValue: false,
    }),
    defineField({
      name: 'hideInDarkMode',
      title: 'Hide Entirely in Dark Mode',
      type: 'boolean',
      description: 'If you do not have a white/dark-mode logo and the current one looks bad, turn this ON to completely hide this institution from the marquee when a user is in dark mode.',
      initialValue: false,
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
