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
  {
    type: 'object',
    name: 'inlineImage',
    title: 'Image',
    fields: [
      { name: 'asset', type: 'image', title: 'Image', options: { hotspot: true } },
      { name: 'caption', type: 'string', title: 'Caption (Optional)' },
      {
        name: 'layout',
        type: 'string',
        title: 'Layout Position',
        description: 'Where the image appears relative to text',
        options: {
          list: [
            { title: '📷 Image Left, Text Right', value: 'left' },
            { title: '📷 Image Right, Text Left', value: 'right' },
            { title: '📷 Image Center, Full Width', value: 'center' },
          ],
          layout: 'radio',
        },
        initialValue: 'center',
      },
    ],
    preview: {
      select: { title: 'caption', media: 'asset' },
      prepare({ title, media }: any) {
        return { title: title || 'Image', media };
      },
    },
  },
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
      {
        name: 'layout',
        type: 'string',
        title: 'Layout Position',
        description: 'Where the video appears relative to text',
        options: {
          list: [
            { title: '🎬 Video Left, Text Right', value: 'left' },
            { title: '🎬 Video Right, Text Left', value: 'right' },
            { title: '🎬 Video Center, Full Width', value: 'center' },
          ],
          layout: 'radio',
        },
        initialValue: 'center',
      },
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
      name: 'sendSubscriberNotification',
      title: '📧 Send Subscriber Notification',
      description: 'Turn this ON to send an email to all subscribers when you publish. After the email is sent, this will automatically reset. If OFF, publishing will NOT trigger any email.',
      type: 'boolean',
      initialValue: false,
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
      name: 'tags',
      title: '🏷️ Tags',
      description: 'Add specific keywords (e.g. #EdTech, #AI). Press Enter to add a tag.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'readingTimeOverride',
      title: '⏱️ Reading Time Override (minutes)',
      description: 'Optional. If set, this overrides the auto-calculated reading time shown on the blog post. Leave blank to auto-calculate from body word count.',
      type: 'number',
      validation: (rule) => rule.min(1).max(120),
    }),
    defineField({
      name: 'author',
      title: 'Author (Legacy — use Multi-Author below)',
      description: '⚠️ DEPRECATED: Use the Authors (Multi-Author) field below instead. This field is only used as a fallback.',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'authorImage',
      title: 'Author Image (Legacy)',
      type: 'image',
      options: { hotspot: true },
      hidden: true,
    }),
    defineField({
      name: 'authorProfileLink',
      title: 'Author Profile Link (Legacy)',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
      hidden: true,
    }),
    defineField({
      name: 'authorBio',
      title: 'Author Bio (Legacy)',
      type: 'text',
      rows: 3,
      hidden: true,
    }),
    defineField({
      name: 'authors',
      title: '✍️ Authors (Multi-Author Support)',
      description: 'Add up to 3 authors for this post. If filled, this overrides the single Author fields above.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'blogAuthor',
          title: 'Author',
          fields: [
            defineField({ name: 'name', title: 'Author Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'image', title: 'Author Image (Passport Size)', type: 'image', options: { hotspot: true } }),
            defineField({
              name: 'profileLink',
              title: '🔗 Author Profile Link',
              description: 'Paste any URL — clicking the author image will open this. (e.g. Twitter, LinkedIn, Instagram)',
              type: 'url',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            }),
            defineField({ name: 'bio', title: 'Author Bio (Short Description)', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'name', media: 'image' },
            prepare({ title, media }: any) {
              return { title: title || 'Unnamed Author', media };
            },
          },
        },
      ],
      validation: (rule) => rule.max(3),
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
      title: '🔗 External References & Sources',
      description: 'Add links to YouTube videos, social media, articles, or websites cited in this post.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Link Title', description: 'e.g. "NEP 2020 Official Document" or "Product Demo Video"' },
            { name: 'url', type: 'url', title: 'Link URL', description: 'Paste any URL — YouTube, Instagram, Twitter, LinkedIn, or any website', validation: (rule: any) => rule.required() },
            { name: 'description', type: 'text', title: 'Description (Optional)', rows: 2, description: 'Brief note about why this reference is relevant' },
          ],
          preview: {
            select: { title: 'title', url: 'url' },
            prepare({ title, url }: any) {
              let platform = 'Website';
              try {
                const hostname = new URL(url || '').hostname.replace('www.', '');
                if (/youtube|youtu\.be/.test(hostname)) platform = '▶️ YouTube';
                else if (/instagram/.test(hostname)) platform = '📷 Instagram';
                else if (/facebook|fb\.com/.test(hostname)) platform = '👤 Facebook';
                else if (/twitter|x\.com/.test(hostname)) platform = '𝕏 Twitter';
                else if (/linkedin/.test(hostname)) platform = '💼 LinkedIn';
                else if (/github/.test(hostname)) platform = '🐙 GitHub';
                else if (/whatsapp|wa\.me/.test(hostname)) platform = '💬 WhatsApp';
                else platform = `🔗 ${hostname}`;
              } catch {}
              return { title: title || 'Untitled Reference', subtitle: platform };
            },
          },
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
              name: 'topText',
              title: 'Top Text (Full Width)',
              description: 'Optional paragraph shown ABOVE the media and side text layout.',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'text',
              title: 'Side Text',
              description: 'Text shown NEXT to the image/video.',
              type: 'text',
              rows: 5,
            }),
            defineField({
              name: 'bottomText',
              title: 'Bottom Text (Full Width)',
              description: 'Optional paragraph shown BELOW the media and side text layout.',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: '🖼️ Image', value: 'image' },
                  { title: '🎬 Video', value: 'video' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
            }),
            defineField({
              name: 'image',
              title: 'Section Image',
              type: 'image',
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.mediaType === 'video',
              fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'videoUrl',
              title: 'Video URL (YouTube/Vimeo)',
              type: 'url',
              hidden: ({ parent }) => parent?.mediaType !== 'video',
            }),
            defineField({
              name: 'videoFile',
              title: 'Upload Video File',
              type: 'file',
              options: { accept: 'video/*' },
              hidden: ({ parent }) => parent?.mediaType !== 'video',
            }),
            defineField({
              name: 'layout',
              title: 'Media Position',
              type: 'string',
              options: {
                list: [
                  { title: '← Media Left, Text Right', value: 'left' },
                  { title: 'Media Right, Text Left →', value: 'right' },
                  { title: '↔ Media Center (Full Width)', value: 'center' },
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
              mediaType: 'mediaType',
              image: 'image',
            },
            prepare({ title, subtitle, mediaType, image }: any) {
              const layoutLabel = subtitle === 'left' ? '← Media Left' : subtitle === 'right' ? 'Media Right →' : '↔ Center';
              const isVideo = mediaType === 'video';
              return {
                title: title || 'Untitled Section',
                subtitle: `${isVideo ? '🎬 Video' : '🖼️ Image'} | ${layoutLabel}`,
                media: !isVideo ? image : undefined,
              };
            },
          },
        },
      ],
    }),
  ],
})
