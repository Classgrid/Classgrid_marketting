import { defineField, defineType } from 'sanity'

export const faqItemType = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'displayPages',
      title: 'Display on Pages',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Home Page', value: 'home' },
          { title: 'Help Center', value: 'help-center' },
          { title: 'Comparison Pages', value: 'compare' },
          { title: 'Pricing Page', value: 'pricing' },
          { title: 'Features Page', value: 'features' },
          { title: 'Institution Pages', value: 'institution' },
        ],
      },
    }),
    defineField({
      name: 'homeColumn',
      title: 'Home Page Column',
      description: 'For home page FAQs only — which column to display in.',
      type: 'string',
      options: {
        list: [
          { title: 'Left Column', value: 'left' },
          { title: 'Right Column', value: 'right' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first within each column.',
      type: 'number',
    }),
  ],
})
