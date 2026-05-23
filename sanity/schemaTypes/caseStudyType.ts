import { defineField, defineType } from 'sanity'

export const caseStudyType = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline Result',
      description: 'The big, bold headline for the card. E.g., "₹12L recovered in one semester with zero manual follow-ups"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      description: 'E.g., PCCOE, Pune',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'E.g., 2024',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'institutionType',
      title: 'Institution Type',
      type: 'string',
      options: {
        list: [
          { title: 'School', value: 'school' },
          { title: 'College', value: 'college' },
          { title: 'Engineering', value: 'engineering' },
          { title: 'Coaching', value: 'coaching' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Primary Category',
      type: 'string',
      options: {
        list: [
          { title: 'Fee Recovery', value: 'fee-recovery' },
          { title: 'Compliance', value: 'compliance' },
          { title: 'Automation', value: 'automation' },
          { title: 'Attendance', value: 'attendance' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modules',
      title: 'Modules Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Finance', value: 'finance' },
          { title: 'Attendance', value: 'attendance' },
          { title: 'Reports', value: 'reports' },
          { title: 'Compliance', value: 'compliance' },
          { title: 'Communication', value: 'communication' },
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      description: 'A 1-2 sentence description for the card body.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Card Hero Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'metrics',
      title: 'Key Metrics (Exactly 3)',
      description: 'These appear at the bottom of the card.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'metric',
          fields: [
            { name: 'value', title: 'Value', type: 'string', description: 'E.g., 12' },
            { name: 'suffix', title: 'Suffix/Prefix', type: 'string', description: 'E.g., ₹, L, %, hrs' },
            { name: 'label', title: 'Label', type: 'string', description: 'E.g., Recovered, On-Time, Deploy' },
          ],
        },
      ],
      validation: (rule) => rule.min(3).max(3),
    }),
    
    // Fields for the detail page (to be built later)
    defineField({
      name: 'championName',
      title: 'Champion Name',
      description: 'The person giving the quote',
      type: 'string',
      group: 'detailPage',
    }),
    defineField({
      name: 'championRole',
      title: 'Champion Role',
      type: 'string',
      group: 'detailPage',
    }),
    defineField({
      name: 'championHeadshot',
      title: 'Champion Headshot',
      type: 'image',
      options: { hotspot: true },
      group: 'detailPage',
    }),
    defineField({
      name: 'championQuote',
      title: 'Champion Quote',
      type: 'text',
      group: 'detailPage',
    }),
    defineField({
      name: 'overview',
      title: 'Overview / Executive Summary',
      description: '2-3 sentences that set the stage for the story. Displayed prominently after the hero.',
      type: 'text',
      rows: 3,
      group: 'detailPage',
    }),
    defineField({
      name: 'overviewDivider',
      title: 'Show Line After Overview?',
      type: 'boolean',
      description: 'Adds a horizontal divider line below the overview section',
      group: 'detailPage',
      initialValue: false,
    }),
    defineField({
      name: 'championSocialLink',
      title: 'Champion Social Link',
      description: 'URL to redirect to when clicking the champion headshot (e.g. LinkedIn, X/Twitter, Instagram)',
      type: 'url',
      group: 'detailPage',
    }),
    defineField({
      name: 'champions',
      title: '👥 Case Study Team Members',
      description: 'Add 2–5 people who worked on this case study. These appear as a team credits section. The main quote stays separate above.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'caseStudyChampion',
          title: 'Team Member',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'role', title: 'Role / Designation', type: 'string' }),
            defineField({ name: 'headshot', title: 'Headshot Photo', type: 'image', options: { hotspot: true } }),
            defineField({
              name: 'socialLink',
              title: '🔗 Social Profile Link',
              description: 'URL to redirect to when clicking the headshot (e.g. LinkedIn, X/Twitter)',
              type: 'url',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'headshot' },
            prepare({ title, subtitle, media }: any) {
              return { title: title || 'Unnamed Member', subtitle: subtitle || '', media };
            },
          },
        },
      ],
      validation: (rule) => rule.max(5),
      group: 'detailPage',
    }),
    defineField({
      name: 'overview',
      title: 'Overview / Executive Summary',
      name: 'conclusion',
      title: 'Conclusion / Key Takeaway',
      description: 'Final takeaway paragraph. Displayed at the end of the story before the champion quote.',
      type: 'text',
      rows: 3,
      group: 'detailPage',
    }),
    defineField({
      name: 'body',
      title: 'Full Story (Body)',
      description: 'Supports text, images, videos (YouTube/upload), and tables in any order.',
      type: 'array',
      of: [
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
                  { title: '📷 Image Center, Text Both Sides', value: 'center' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
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
                  { title: '🎬 Video Center, Text Both Sides', value: 'center' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            },
            { name: 'speakerName', type: 'string', title: 'Speaker Name (Optional)' },
            { name: 'speakerRole', type: 'string', title: 'Speaker Role (Optional)' },
            { name: 'speakerImage', type: 'image', title: 'Speaker Avatar (Optional)' },
          ],
        },
        {
          type: 'object',
          name: 'divider',
          title: 'Divider Line',
          fields: [
            {
              name: 'style',
              type: 'string',
              title: 'Line Style',
              options: { list: ['Solid', 'Dashed', 'Faded'] },
              initialValue: 'Solid',
            },
          ],
        },
      ],
      group: 'detailPage',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Proof Gallery',
      description: 'Images to show in the ImageGallery component',
      type: 'array',
      of: [{ type: 'image' }],
      group: 'detailPage',
    }),
  ],
  groups: [
    {
      name: 'detailPage',
      title: 'Detail Page Fields',
    },
  ],
})
