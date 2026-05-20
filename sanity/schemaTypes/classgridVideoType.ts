import { defineField, defineType } from 'sanity'

export const classgridVideoType = defineType({
  name: 'classgridVideo',
  title: '🎬 Classgrid Video',
  type: 'document',
  fields: [
    defineField({
      name: 'isVisible',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to show the Classgrid product video section on the homepage.',
    }),
    defineField({
      name: 'label',
      title: 'Section Label (small tag above title)',
      type: 'string',
      placeholder: 'e.g. See It In Action',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      placeholder: 'e.g. Built for Every Institution',
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
      rows: 3,
      placeholder: 'e.g. Watch how Classgrid transforms operations...',
    }),
    defineField({
      name: 'videoUrl',
      title: 'YouTube / Video URL',
      type: 'url',
      description: 'Paste a YouTube link (e.g. https://www.youtube.com/watch?v=abc123) or a direct .mp4 URL',
    }),
    defineField({
      name: 'highlights',
      title: 'Feature Highlights (shown beside video)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', title: 'Highlight Text', type: 'string' },
          ],
          preview: {
            select: { title: 'text' },
          },
        },
      ],
      description: 'Up to 4 bullet points shown to the left of the video',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      placeholder: 'e.g. Book a Free Demo',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA Button Link',
      type: 'string',
      placeholder: 'e.g. /#demo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isVisible: 'isVisible',
    },
    prepare({ title, isVisible }) {
      return {
        title: title || 'Classgrid Video Section',
        subtitle: isVisible ? '✅ Visible on Homepage' : '❌ Hidden',
      }
    },
  },
})
