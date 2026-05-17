import { defineField, defineType } from 'sanity'

export const salesContactMetricType = defineType({
  name: 'salesContactMetric',
  title: 'Sales Contact Metric',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'value', title: 'Value', type: 'string' }),
  ],
})

export const salesContactRoleType = defineType({
  name: 'salesContactRole',
  title: 'Sales Contact Role',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'value', title: 'Value', type: 'string' }),
  ],
})

export const salesContactFormType = defineType({
  name: 'salesContactForm',
  title: 'Sales Contact Form',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'submitLabel', title: 'Submit Label', type: 'string' }),
    defineField({
      name: 'fields',
      title: 'Field Labels',
      type: 'object',
      fields: [
        defineField({ name: 'email', title: 'Email Label', type: 'string' }),
        defineField({ name: 'institution', title: 'Institution Label', type: 'string' }),
        defineField({ name: 'role', title: 'Role Label', type: 'string' }),
        defineField({ name: 'rolePlaceholder', title: 'Role Placeholder', type: 'string' }),
        defineField({
          name: 'roles',
          title: 'Role Options',
          type: 'array',
          of: [{ type: 'salesContactRole' }],
        }),
      ],
    }),
  ],
})

export const salesContactSocialProofType = defineType({
  name: 'salesContactSocialProof',
  title: 'Sales Contact Social Proof',
  type: 'object',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'string' }),
    defineField({ name: 'names', title: 'Names', type: 'array', of: [{ type: 'string' }] }),
  ],
})

export const salesContactPageType = defineType({
  name: 'salesContactPage',
  title: 'Sales Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'titleAccent', title: 'Title Accent', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [{ type: 'salesContactMetric' }],
    }),
    defineField({ name: 'form', title: 'Form', type: 'salesContactForm' }),
    defineField({
      name: 'socialProof',
      title: 'Social Proof',
      type: 'salesContactSocialProof',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'contact-sales' }),
      ],
    }),
  ],
})
