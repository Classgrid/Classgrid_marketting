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
    defineField({
      name: 'hi',
      title: 'Hindi',
      type: 'richBody',
    }),
    defineField({
      name: 'mr',
      title: 'Marathi',
      type: 'richBody',
    }),
  ],
})
