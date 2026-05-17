import { defineField, defineType } from 'sanity'

export const solutionPageType = defineType({
  name: 'solutionPage',
  title: 'Solution Pages',
  type: 'document',
  groups: [
    { name: 'general', title: 'General Info', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Content' },
    { name: 'tables', title: 'Tables' },
    { name: 'faqs', title: 'FAQs' },
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
      description: '"industry" for institution types, "role" for audience types',
      options: {
        list: [
          { title: 'Industry (institution type)', value: 'industry' },
          { title: 'Role (audience type)', value: 'role' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'label',
      title: 'Eyebrow Label',
      type: 'localeString',
      description: 'Short badge shown above the headline. E.g. "For Schools", "For Students".',
      group: 'general',
    }),
    defineField({
      name: 'headline',
      title: 'Headline (H1)',
      type: 'localeString',
      description: 'Main page title. Keep it punchy and benefit-driven.',
      group: 'general',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'localeText',
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
      name: 'lastUpdatedAt',
      title: 'Last Updated Date',
      type: 'datetime',
      description: 'Manually set the "Last Updated" date shown on the page. If empty, the Sanity auto-updated date is used.',
      options: {
        dateFormat: 'DD MMM YYYY',
        timeFormat: 'HH:mm',
      },
      group: 'general',
    }),
    defineField({
      name: 'body',
      title: 'Page Content',
      description: 'Full rich-text content for the page.',
      type: 'localeRichBody',
      group: 'content',
    }),
    defineField({
      name: 'markdownBody',
      title: 'Markdown / HTML Body',
      description: 'Raw markdown or HTML content for technical solution pages with tables. When present, overrides body field rendering.',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'structuredSections',
      title: 'Structured Sections (Rich Text)',
      description: 'Break your page content into sections here. These accept Rich Text (images, bold, bullets, tables).',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
            defineField({ name: 'content', title: 'Rich Text Content', type: 'richBody' })
          ],
          preview: {
            select: { title: 'heading' }
          }
        }
      ]
    }),
    defineField({
      name: 'capabilities',
      title: 'Capabilities Table',
      description: 'Feature / description pairs shown in the capabilities table.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'feature', title: 'Feature Name', type: 'localeString' }),
            defineField({ name: 'description', title: 'Description', type: 'localeText' }),
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
            defineField({ name: 'roleName', title: 'Stakeholder Role', type: 'localeString' }),
            defineField({ name: 'description', title: 'Their Experience', type: 'localeText' }),
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
            defineField({ name: 'question', title: 'Question', type: 'localeString' }),
            defineField({ name: 'answer', title: 'Answer', type: 'localeText' }),
          ],
          preview: {
            select: { title: 'question.en' },
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
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'localeString' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'localeText' }),
      ],
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'label', slug: 'slug' },
    prepare({ title, subtitle, slug }: any) {
      // headline and label are localeString objects — extract .en
      const displayTitle =
        typeof title === 'string' ? title :
        title?.en ?? title?.hi ?? slug?.current ?? 'Untitled'
      const displaySubtitle =
        typeof subtitle === 'string' ? subtitle :
        subtitle?.en ?? subtitle?.hi ?? ''
      return { title: displayTitle, subtitle: displaySubtitle }
    },
  },
})
