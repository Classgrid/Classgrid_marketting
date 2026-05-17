import { defineField, defineType } from 'sanity'

export const homePillarType = defineType({
  name: 'homePillar',
  title: 'Home Pillar',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 2 }),
  ],
})

export const homeStatType = defineType({
  name: 'homeStat',
  title: 'Home Stat',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'value', title: 'Value', type: 'string' }),
  ],
})

export const homeModuleHighlightType = defineType({
  name: 'homeModuleHighlight',
  title: 'Home Module Highlight',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'href', title: 'Link', type: 'string', initialValue: '/features' }),
  ],
})

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'trustedBy',
      title: 'Trusted By Line',
      type: 'string',
    }),
    defineField({
      name: 'machineShowcase',
      title: 'Machine Showcase Copy',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'videoSectionHeading',
      title: 'Video Section Heading',
      type: 'string',
      initialValue: 'See Classgrid in action',
    }),
    defineField({
      name: 'videoSectionSubtext',
      title: 'Video Section Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Watch how Classgrid simplifies operations across your institution.',
    }),
    defineField({
      name: 'modulesSectionHeading',
      title: 'Modules Section Heading',
      type: 'string',
      initialValue: 'One platform. One operating system.',
    }),
    defineField({
      name: 'modulesSectionSubtext',
      title: 'Modules Section Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Manage academics, operations, and workflows in one unified platform.',
    }),
    defineField({
      name: 'stakeholderSectionHeading',
      title: 'Stakeholder Section Heading',
      type: 'string',
      initialValue: 'One system for every stakeholder',
    }),
    defineField({
      name: 'stakeholderSectionSubtext',
      title: 'Stakeholder Section Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Classgrid connects students, staff, leadership, and compliance into one unified system.',
    }),
    defineField({
      name: 'integrationsHeadline',
      title: 'Integrations Headline',
      type: 'string',
      initialValue: 'Classgrid integrates with the tools you rely on',
    }),
    defineField({
      name: 'integrationsSubtext',
      title: 'Integrations Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Classgrid is integrated with leading tools like AWS, Google, and more.',
    }),
    defineField({
      name: 'testimonialsLabel',
      title: 'Testimonials Label',
      type: 'string',
      initialValue: 'Testimonials',
    }),
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials Heading',
      type: 'string',
      initialValue: 'Trusted by educators and institutions',
    }),
    defineField({
      name: 'testimonialsSubtext',
      title: 'Testimonials Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'See how institutions are transforming operations with Classgrid.',
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ Heading',
      type: 'string',
      initialValue: 'Everything you need to know',
    }),
    defineField({
      name: 'faqSubtext',
      title: 'FAQ Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Find answers to common questions about Classgrid, features, and setup.',
    }),
    defineField({
      name: 'faqButtonText',
      title: 'FAQ Button Text',
      type: 'string',
      initialValue: 'Explore Help Center',
    }),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      of: [{ type: 'homePillar' }],
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{ type: 'homeStat' }],
    }),
    defineField({
      name: 'moduleHighlights',
      title: 'Module Highlights',
      type: 'array',
      of: [{ type: 'homeModuleHighlight' }],
    }),
    defineField({
      name: 'footerCta',
      title: 'Footer CTA',
      type: 'string',
    }),
    defineField({
      name: 'whatsNew',
      title: 'Whats New',
      type: 'string',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'slug', title: 'Slug', type: 'string', initialValue: 'home' }),
      ],
    }),
  ],
})
