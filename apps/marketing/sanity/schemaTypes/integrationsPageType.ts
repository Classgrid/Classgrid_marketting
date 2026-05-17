import { defineField, defineType } from 'sanity'

export const integrationItemType = defineType({
  name: 'integrationItem',
  title: 'Integration Item',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Integration Name', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'benefits', title: 'Key Benefits', type: 'array', of: [{ type: 'string' }] }),
  ],
})

export const integrationsPageType = defineType({
  name: 'integrationsPage',
  title: 'Integrations Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'We play nice with your current workflow',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
      initialValue: 'Seamless integration with tools you already use',
    }),
    defineField({
      name: 'integrations',
      title: 'Integrations',
      type: 'array',
      of: [{ type: 'integrationItem' }],
      description: 'Zoom, Google Meet, Razorpay, Google Drive, Firebase, Supabase, Vercel, etc.',
    }),
    defineField({
      name: 'apiDocumentation',
      title: 'API Documentation URL',
      type: 'url',
    }),
    defineField({
      name: 'customIntegrationCta',
      title: 'Custom Integration CTA',
      type: 'string',
      initialValue: 'Need a custom integration? Contact our team.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'integrations' }),
      ],
    }),
  ],
})
