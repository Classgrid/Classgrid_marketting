import { defineField, defineType } from 'sanity'

export const supportPageType = defineType({
  name: 'supportPage',
  title: 'Support Center',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'We\'re here for you, 24/7',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'supportChannels',
      title: 'Support Channels',
      type: 'array',
      of: [
        defineField({
          name: 'channel',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', title: 'Icon', type: 'image' }),
            defineField({ name: 'link', title: 'Link/Contact', type: 'string' }),
          ],
        }),
      ],
      initialValue: [
        { title: 'Knowledge Base', description: 'Browse our extensive documentation', icon: null, link: '/docs' },
        { title: 'Video Tutorials', description: 'Step-by-step video guides', icon: null, link: '/videos' },
        { title: 'Live Chat', description: 'Chat with our team', icon: null, link: 'chat:support' },
      ],
    }),
    defineField({
      name: 'knowledgeBaseUrl',
      title: 'Knowledge Base URL',
      type: 'url',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'support' }),
      ],
    }),
  ],
})
