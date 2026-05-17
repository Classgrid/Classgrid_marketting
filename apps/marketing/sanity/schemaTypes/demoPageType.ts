import { defineField, defineType } from 'sanity'

export const demoPageType = defineType({
  name: 'demoPage',
  title: 'Demo Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'See Classgrid in Action. It\'s Your Turn.',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
      initialValue: 'Fill out the form below to request a guided Classgrid demo consultation. The Classgrid team will review your details and connect to schedule a walkthrough.',
    }),
    defineField({
      name: 'benefits',
      title: 'Key Benefits (Bullets)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Why they should take the demo',
    }),
    defineField({
      name: 'formFields',
      title: 'Form Fields to Collect',
      type: 'array',
      of: [
        defineField({
          name: 'field',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' }),
            defineField({ name: 'type', title: 'Type', type: 'string', initialValue: 'text' }),
            defineField({ name: 'required', title: 'Required?', type: 'boolean', initialValue: true }),
          ],
        }),
      ],
      initialValue: [
        { label: 'Institution Name', placeholder: 'e.g., Harvard University', type: 'text', required: true },
        { label: 'Institution Type', placeholder: 'College / School / Coaching', type: 'select', required: true },
        { label: 'Administrator Name', placeholder: 'Your name', type: 'text', required: true },
        { label: 'Email', placeholder: 'admin@example.com', type: 'email', required: true },
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Request Demo',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'text',
      rows: 2,
      initialValue: 'Your demo request has been received. The Classgrid team will review it and connect to schedule the next discussion.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'demo' }),
      ],
    }),
  ],
})
