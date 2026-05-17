import { defineField, defineType } from 'sanity'

export const pricingPlanType = defineType({
  name: 'pricingPlan',
  title: 'Pricing Plan',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Plan Name', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'targetAudience', title: 'Target Audience', type: 'string' }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'price', title: 'Price (optional)', type: 'string' }),
    defineField({
      name: 'cta',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Book a Demo',
    }),
  ],
})

export const pricingPageType = defineType({
  name: 'pricingPage',
  title: 'Pricing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Transparent pricing that scales with your ambition',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'plans',
      title: 'Pricing Plans',
      type: 'array',
      of: [{ type: 'pricingPlan' }],
      description: 'Coaching | School | College plans',
    }),
    defineField({
      name: 'moduleMatrix',
      title: 'Module Matrix',
      type: 'array',
      of: [
        defineField({
          name: 'moduleRow',
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Module Name', type: 'string' }),
            defineField({ name: 'school', title: 'School', type: 'boolean' }),
            defineField({ name: 'coaching', title: 'Coaching', type: 'boolean' }),
            defineField({ name: 'engineering', title: 'College (Engineering/Diploma)', type: 'boolean' }),
            defineField({
              name: 'level',
              title: 'Level',
              type: 'string',
              options: { list: ['Basic', 'PRO', 'MASTER'] },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'premiumSection',
      title: 'Premium Section',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
        defineField({ name: 'pricingNote', title: 'Pricing Note', type: 'text', rows: 2 }),
        defineField({ name: 'items', title: 'Included Modules', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
        defineField({ name: 'ctaHref', title: 'CTA Href', type: 'string' }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Pricing FAQ',
      type: 'array',
      of: [
        defineField({
          name: 'faqItem',
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'contactSales',
      title: 'Contact Sales CTA',
      type: 'string',
      initialValue: 'Contact Sales for volume pricing',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'pricing' }),
      ],
    }),
  ],
})
