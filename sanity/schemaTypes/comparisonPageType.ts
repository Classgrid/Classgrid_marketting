import { defineField, defineType } from 'sanity'

export const comparisonPageType = defineType({
  name: 'comparisonPage',
  title: 'Comparison Page (vs Competitors)',
  type: 'document',
  fields: [
    defineField({
      name: 'competitorName',
      title: 'Competitor Name',
      type: 'string',
      description: 'e.g., "vmedulife", "Google Classroom", "Canvas"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL: /compare/[slug]',
      options: { source: 'competitorName' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (Minutes)',
      type: 'number',
      description: 'e.g., 11 (will display as "11 min read")',
      initialValue: 11,
    }),
    defineField({
      name: 'lastUpdatedDate',
      title: 'Manual Last Updated Date',
      type: 'date',
      description: 'Overrides the automatic Sanity update time',
    }),
    defineField({
      name: 'competitorLogo',
      title: 'Competitor Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'websiteLink',
      title: 'Competitor Website URL',
      type: 'url',
    }),

    // --- SEO ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Page title for search engines',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Short description for search engines and social cards',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      description: 'Social share preview image (1200×630 recommended)',
    }),

    // --- Body (Rich Text) ---
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [
        { type: 'block' },
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
      ],
      description: 'Optional rich-text intro / deep-dive content',
    }),

    // --- Rating Badges ---
    defineField({
      name: 'ratingBadges',
      title: 'Rating Badges',
      type: 'array',
      description: 'Expert rating cards (e.g., Automation Readiness: 4.9)',
      of: [
        defineField({
          name: 'badge',
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform / Category', type: 'string' }),
            defineField({ name: 'score', title: 'Score (out of 5)', type: 'number' }),
            defineField({ name: 'badgeLabel', title: 'Badge Label', type: 'string' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'badgeLabel' },
          },
        }),
      ],
    }),

    // --- USPs (Unique Selling Points) ---
    defineField({
      name: 'usps',
      title: 'Unique Selling Points',
      type: 'array',
      description: 'Key advantages of Classgrid over this competitor',
      of: [
        defineField({
          name: 'usp',
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon Name', type: 'string', description: 'e.g., workflow, sparkles, shield' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        }),
      ],
    }),

    // --- Feature Matrix (Comparison Table) ---
    defineField({
      name: 'featureMatrix',
      title: 'Feature Comparison Matrix',
      type: 'array',
      description: 'Side-by-side feature comparison table rows',
      of: [
        defineField({
          name: 'row',
          type: 'object',
          fields: [
            defineField({ name: 'category', title: 'Category', type: 'string', description: 'e.g., Compliance, Academics' }),
            defineField({ name: 'featureName', title: 'Feature Name', type: 'string' }),
            defineField({ name: 'ourStatus', title: 'Classgrid Status', type: 'string' }),
            defineField({
              name: 'ourIcon',
              title: 'Classgrid Icon',
              type: 'string',
              options: { list: ['check', 'warning', 'cross'] },
              initialValue: 'check',
            }),
            defineField({ name: 'competitorStatus', title: 'Competitor Status', type: 'string' }),
            defineField({
              name: 'competitorIcon',
              title: 'Competitor Icon',
              type: 'string',
              options: { list: ['check', 'warning', 'cross'] },
              initialValue: 'warning',
            }),
          ],
          preview: {
            select: { title: 'featureName', subtitle: 'category' },
          },
        }),
      ],
    }),

    // --- Migration Testimonial ---
    defineField({
      name: 'migrationTestimonial',
      title: 'Migration Testimonial',
      type: 'object',
      description: 'A quote from someone who switched to Classgrid',
      fields: [
        defineField({ name: 'quoteText', title: 'Quote', type: 'text', rows: 3 }),
        defineField({ name: 'authorName', title: 'Author Name', type: 'string' }),
        defineField({ name: 'authorRole', title: 'Author Role / Institution', type: 'string' }),
      ],
    }),

    // --- FAQs ---
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description: 'Frequently asked questions about this comparison',
      of: [
        defineField({
          name: 'faq',
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'question' },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: { title: 'competitorName', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return {
        title: `Classgrid vs ${title ?? 'Untitled'}`,
        subtitle: `/compare/${subtitle ?? ''}`,
      }
    },
  },
})
