import { defineField, defineType } from 'sanity'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Let\'s build the future of your campus',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'contacts',
      title: 'Contact Information',
      type: 'array',
      of: [
        defineField({
          name: 'contactItem',
          type: 'object',
          fields: [
            defineField({ name: 'department', title: 'Department', type: 'string' }),
            defineField({ name: 'email', title: 'Email', type: 'string' }),
            defineField({ name: 'phone', title: 'Phone', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
        }),
      ],
      initialValue: [
        { department: 'Primary Contact', email: 'nikhil.shinde@classgrid.in', phone: '+91 8623947038', description: 'Sales, onboarding, and general communication.' },
        { department: 'Technical Support', email: 'support@classgrid.in', phone: '+91 8149277038', description: 'Platform support and operational assistance.' },
      ],
    }),
    defineField({
      name: 'officeLocations',
      title: 'Office Locations',
      type: 'array',
      of: [
        defineField({
          name: 'location',
          type: 'object',
          fields: [
            defineField({ name: 'city', title: 'City', type: 'string' }),
            defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
            defineField({ name: 'phone', title: 'Phone', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'formFields',
      title: 'Contact Form Fields',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Full Name', 'Email', 'Organization', 'Message'],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'contact' }),
      ],
    }),
  ],
})
