import { defineField, defineType } from 'sanity'

export const caseStudySettingsType = defineType({
  name: 'caseStudySettings',
  title: 'Case Study Page Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // Prevent creating multiple
  fields: [
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      description: 'The short description shown under "Classgrid Impact" heading. Leave empty to hide it.',
      type: 'text',
      rows: 2,
    }),
  ],
})
