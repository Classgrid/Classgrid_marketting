import { defineField, defineType } from 'sanity'

const createPostBodyOf = () => [
  {
    type: 'block',
    marks: {
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule: any) => rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
            },
          ],
        },
      ],
    },
  },
  { type: 'image', options: { hotspot: true } },
  {
    type: 'object',
    name: 'table',
    title: 'Table',
    fields: [
      {
        name: 'rows',
        type: 'array',
        title: 'Rows',
        of: [
          {
            type: 'object',
            name: 'tableRow',
            title: 'Row',
            fields: [
              {
                name: 'cells',
                type: 'array',
                title: 'Cells',
                of: [{ type: 'string' }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'object',
    name: 'video',
    title: 'Video Embed',
    fields: [
      { name: 'url', type: 'url', title: 'External Video URL (YouTube/Vimeo)' },
      { name: 'videoFile', type: 'file', title: 'Upload Video File', options: { accept: 'video/*' } },
      { name: 'caption', type: 'string', title: 'Caption' },
      { name: 'speakerName', type: 'string', title: 'Speaker Name (Optional)' },
      { name: 'speakerRole', type: 'string', title: 'Speaker Role (Optional)' },
      { name: 'speakerImage', type: 'image', title: 'Speaker Avatar (Optional)' },
    ],
  },
]

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value || typeof value !== 'object' || !('en' in value) || !(value as { en?: string }).en) {
            return 'English title is required.'
          }
          return true
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localeText',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Education', value: 'Education' },
          { title: 'Software', value: 'Software' },
          { title: 'App Updates', value: 'App Updates' },
          { title: 'Academic', value: 'Academic' },
          { title: 'AI', value: 'AI' },
          { title: 'ERP', value: 'ERP' },
        ],
      }
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'authorImage',
      title: 'Author Image (Passport Size)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'authorProfileLink',
      title: '🔗 Author Profile Link',
      description: 'Paste any URL — clicking the author image will open this. (e.g. Twitter, LinkedIn, Instagram)',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'authorBio',
      title: 'Author Bio (Short Description)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'array', of: createPostBodyOf() }),
        defineField({ name: 'hi', title: 'Hindi', type: 'array', of: createPostBodyOf() }),
        defineField({ name: 'mr', title: 'Marathi', type: 'array', of: createPostBodyOf() }),
      ],
    }),
    defineField({
      name: 'references',
      title: 'External References',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Link Title' },
            { name: 'url', type: 'url', title: 'Link URL' }
          ]
        }
      ]
    }),
    defineField({
      name: 'contentSections',
      title: '📸 Visual Content Sections',
      description: 'Add image+text sections with alternating layouts (like the Case Study page). These appear after the main blog body.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'blogSection',
          title: 'Content Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
            }),
            defineField({
              name: 'text',
              title: 'Section Text',
              type: 'text',
              rows: 5,
            }),
            defineField({
              name: 'image',
              title: 'Section Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'layout',
              title: 'Image Position',
              type: 'string',
              options: {
                list: [
                  { title: '🖼️ Image Left, Text Right', value: 'left' },
                  { title: '🖼️ Image Right, Text Left', value: 'right' },
                  { title: '🖼️ Image Center (Full Width)', value: 'center' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'layout',
              media: 'image',
            },
            prepare({ title, subtitle, media }: any) {
              const layoutLabel = subtitle === 'left' ? '← Image Left' : subtitle === 'right' ? 'Image Right →' : '↔ Center';
              return {
                title: title || 'Untitled Section',
                subtitle: layoutLabel,
                media,
              };
            },
          },
        },
      ],
    }),
  ],
})
