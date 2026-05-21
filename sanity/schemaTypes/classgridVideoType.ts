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
      name: 'videoFile',
      title: '📁 Upload Video File (recommended)',
      type: 'file',
      options: { accept: 'video/mp4,video/webm,video/ogg' },
      description: 'Upload your Classgrid product demo video directly (MP4 recommended). This takes priority over the URL field below.',
    }),
    defineField({
      name: 'videoUrl',
      title: '🔗 External Video URL (fallback)',
      type: 'url',
      description: 'Only use this if you are NOT uploading a file above. Paste a direct .mp4 or .webm CDN URL.',
    }),
    defineField({
      name: 'videoPlaylist',
      title: '🎞️ Video Playlist (sequential autoplay)',
      type: 'array',
      description: 'Add up to 5 videos. They will play 1 → 2 → 3 → back to 1, silently looping forever. Each video should be 20–60 seconds.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'videoFile',
              title: 'Upload Video (MP4)',
              type: 'file',
              options: { accept: 'video/mp4,video/webm' },
            },
            {
              name: 'videoUrl',
              title: 'Or External URL',
              type: 'url',
              description: 'Use only if not uploading a file above',
            },
            {
              name: 'label',
              title: 'Label (optional)',
              type: 'string',
              placeholder: 'e.g. Admissions Flow',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'videoUrl' },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title || 'Video Clip', subtitle: subtitle || 'File upload' }
            },
          },
        },
      ],
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
