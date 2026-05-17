import { defineField, defineType } from 'sanity'
import { Package } from 'lucide-react'

export const solutionModuleType = defineType({
  name: 'solutionModule',
  title: 'Solution Module',
  type: 'document',
  icon: Package,
  groups: [
    { name: 'general', title: 'General Info', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Content' },
    { name: 'tables', title: 'Tables' },
    { name: 'faqs', title: 'FAQs' },
    { name: 'related', title: 'Related Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug (URL key)',
      type: 'slug',
      description: 'Unique identifier — determines the URL. Do not change after publishing.',
      options: { source: 'headline', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Module category for grouping on the modules listing page.',
      options: {
        list: [
          { title: 'Academics', value: 'Academics' },
          { title: 'Assessment', value: 'Assessment' },
          { title: 'Management', value: 'Management' },
          { title: 'Advanced', value: 'Advanced' },
          { title: 'Dashboards', value: 'Dashboards' },
          { title: 'Communication', value: 'Communication' },
          { title: 'Finance', value: 'Finance' },
          { title: 'AI', value: 'AI' },
        ],
      },
      group: 'general',
    }),
    defineField({
      name: 'label',
      title: 'Eyebrow Label',
      type: 'string',
      description: 'Short badge shown above the headline. E.g. "Attendance Module", "AI Module".',
      validation: (Rule) => Rule.max(50),
      group: 'general',
    }),
    defineField({
      name: 'headline',
      title: 'Headline (H1)',
      type: 'string',
      description: 'Main page title.',
      validation: (Rule) => Rule.required().max(100),
      group: 'general',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'One-liner shown below the headline.',
      group: 'general',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
      group: 'hero',
    }),
    defineField({
      name: 'availableFor',
      title: 'Available For (Institution Types)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'School', value: 'school' },
          { title: 'College', value: 'college' },
          { title: 'Jr College', value: 'junior-college' },
          { title: 'Coaching', value: 'coaching' },
          { title: 'Engineering', value: 'engineering' },
        ],
      },
      group: 'general',
    }),
    defineField({
      name: 'lastUpdatedAt',
      title: 'Last Updated Date',
      type: 'datetime',
      description: 'Manually set the "Last Updated" date shown on the page.',
      options: {
        dateFormat: 'DD MMM YYYY',
        timeFormat: 'HH:mm',
      },
      group: 'general',
    }),
    defineField({
      name: 'body',
      title: 'Module Content',
      description: 'Full rich-text content for the module detail page.',
      type: 'richBody',
      group: 'content',
    }),
    defineField({
      name: 'structuredSections',
      title: 'Structured Sections (Rich Text)',
      description: 'Break your module content into sections here. Each section can have text content + an optional image.',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
            defineField({ name: 'content', title: 'Rich Text Content', type: 'richBody' }),
            defineField({
              name: 'sectionImage',
              title: 'Section Image (optional)',
              type: 'image',
              description: 'Upload a screenshot or diagram relevant to this section.',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'imageCaption',
              title: 'Image Caption (optional)',
              type: 'string',
              description: 'Short label shown below the image.',
            }),
            defineField({
              name: 'suggestedImageNote',
              title: 'Suggested Image Note (for editor)',
              type: 'text',
              rows: 2,
              description: 'Codex writes what image should go here. You then upload the actual image above.',
            }),
          ],
          preview: {
            select: { title: 'heading', media: 'sectionImage' }
          }
        }
      ]
    }),

    defineField({
      name: 'capabilities',
      title: 'Capabilities Table',
      description: 'Feature / description pairs shown in the capabilities table on the page.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'feature', title: 'Feature Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', title: 'Icon (Lucide name)', type: 'string' }),
          ],
          preview: {
            select: { title: 'feature', subtitle: 'description' },
          },
        },
      ],
      group: 'tables',
    }),
    defineField({
      name: 'roleExperiences',
      title: 'Stakeholder Experience Table',
      description: 'Role / experience pairs shown in the stakeholder table.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'roleName', title: 'Stakeholder Role', type: 'string' }),
            defineField({ name: 'description', title: 'Their Experience', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'roleName', subtitle: 'description' },
          },
        },
      ],
      group: 'tables',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4 }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
      group: 'faqs',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string', validation: (Rule) => Rule.max(60) }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2, validation: (Rule) => Rule.max(160) }),
      ],
      group: 'seo',
    }),
    defineField({
      name: 'relatedHelpArticles',
      title: 'Related Help Center Articles',
      description: 'Link to help articles from the Help Center that relate to this module. All fields optional.',
      type: 'array',
      group: 'related',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'articleTitle', title: 'Article Title', type: 'string' }),
            defineField({ name: 'articleSlug', title: 'Article Slug (URL)', type: 'string', description: 'e.g. how-to-mark-attendance' }),
            defineField({ name: 'articleSummary', title: 'One-line Summary', type: 'string' }),
          ],
          preview: {
            select: { title: 'articleTitle', subtitle: 'articleSlug' },
          },
        },
      ],
    }),
    defineField({
      name: 'relatedChangelogs',
      title: 'Related Changelog Entries',
      description: 'Link changelog updates that are related to this module.',
      type: 'array',
      group: 'related',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'changeTitle', title: 'Changelog Title', type: 'string' }),
            defineField({ name: 'changeDate', title: 'Date', type: 'date' }),
            defineField({ name: 'changeSummary', title: 'Summary', type: 'text', rows: 2 }),
            defineField({
              name: 'changeType',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: '✨ New Feature', value: 'feature' },
                  { title: '🐛 Bug Fix', value: 'bugfix' },
                  { title: '⚡ Improvement', value: 'improvement' },
                  { title: '🔒 Security', value: 'security' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'changeTitle', subtitle: 'changeDate' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'category' },
    prepare({ title, subtitle }: any) {
      return { title, subtitle }
    },
  },
})
