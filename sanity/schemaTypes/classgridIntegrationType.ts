import { defineField, defineType } from 'sanity'

export const classgridIntegrationType = defineType({
  name: 'classgridIntegration',
  title: 'Classgrid Integration',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Integration Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Uploaded Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload the integration logo here. Used first if present.',
    }),
    defineField({
      name: 'logoUrl',
      title: 'External Logo URL',
      type: 'url',
      description: 'Use a direct logo URL from Supabase, Wikipedia, CDN, or any public source.',
    }),
    defineField({
      name: 'image',
      title: 'Uploaded Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional larger image for this integration.',
    }),
    defineField({
      name: 'imageUrl',
      title: 'External Image URL',
      type: 'url',
      description: 'Use a direct image URL from Supabase, Wikipedia, CDN, or any public source.',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Used on the Integrations detail page',
    }),
    defineField({
      name: 'benefits',
      title: 'Key Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Used on the Integrations detail page',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first in the marquee',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      subtitle: 'logoUrl',
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle ? `External logo: ${subtitle}` : 'Uploaded logo/image supported',
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})
