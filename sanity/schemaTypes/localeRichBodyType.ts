import { defineField, defineType } from 'sanity'

export const localeRichBodyType = defineType({
  name: 'localeRichBody',
  title: 'Localized Rich Body',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'richBody',
    }),
  ],
})
