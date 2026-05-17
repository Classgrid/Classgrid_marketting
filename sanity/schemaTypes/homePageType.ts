import { defineField, defineType } from 'sanity'

export const homePillarType = defineType({
  name: 'homePillar',
  title: 'Home Pillar',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'icon', title: 'Icon Name', type: 'string' }),
  ],
})

export const homeEcosystemFeatureType = defineType({
  name: 'homeEcosystemFeature',
  title: 'Ecosystem Feature',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Feature Label', type: 'string' }),
    defineField({ name: 'description', title: 'Screenshot Target Instructions', type: 'text', rows: 3 }),
    defineField({ name: 'icon', title: 'Lucide Icon Name', type: 'string' }),
    defineField({
      name: 'image',
      title: 'App Screenshot',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'description',
      media: 'image',
    },
  },
})

export const homeEcosystemRoleType = defineType({
  name: 'homeEcosystemRole',
  title: 'Ecosystem Role',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID (faculty, student, parent)', type: 'string' }),
    defineField({ name: 'label', title: 'Tab Label', type: 'string' }),
    defineField({
      name: 'features',
      title: 'Features (6 required)',
      type: 'array',
      of: [{ type: 'homeEcosystemFeature' }],
    }),
  ],
})



export const homeStatType = defineType({
  name: 'homeStat',
  title: 'Home Stat',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
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

export const homeModuleCardType = defineType({
  name: 'homeModuleCard',
  title: 'Home Module Card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'href', title: 'Link', type: 'string' }),
    defineField({
      name: 'color',
      title: 'Card Accent Gradient Class',
      type: 'string',
      description: 'Example: from-blue-500/20',
    }),
    defineField({ name: 'iconColor', title: 'Icon Color', type: 'string' }),
    defineField({
      name: 'orgs',
      title: 'Audience Filters',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['school', 'college', 'coaching'],
      },
    }),
  ],
})

export const homeShowcaseSlideType = defineType({
  name: 'homeShowcaseSlide',
  title: 'Home Showcase Slide',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})

export const homeTrustLogoType = defineType({
  name: 'homeTrustLogo',
  title: 'Home Trust Logo',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Logo Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'wordmark',
      title: 'Institution Name Style Image',
      type: 'image',
      description: 'Optional branded wordmark or stylized institute name image.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({ name: 'href', title: 'Link', type: 'string' }),
  ],
})

export const homeOrganizationCardType = defineType({
  name: 'homeOrganizationCard',
  title: 'Home Organization Card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'href', title: 'Link', type: 'string' }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Use icon names supported by IconRenderer, for example: School, GraduationCap, Building2, BookOpen.',
    }),
    defineField({
      name: 'color',
      title: 'Card Accent Gradient Class',
      type: 'string',
      description: 'Example: from-emerald-400/20',
    }),
    defineField({
      name: 'iconColor',
      title: 'Icon Color',
      type: 'string',
      description: 'Hex color example: #34d399',
    }),
  ],
})

export const homeTimelineRingType = defineType({
  name: 'homeTimelineRing',
  title: 'Home Timeline Ring',
  type: 'object',
  fields: [
    defineField({
      name: 'nodes',
      title: 'Nodes',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})

export const homeTimelineTabType = defineType({
  name: 'homeTimelineTab',
  title: 'Home Timeline Tab',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'rings',
      title: 'Rings',
      type: 'array',
      of: [{ type: 'homeTimelineRing' }],
    }),
  ],
})

export const homePlatformAudienceCardType = defineType({
  name: 'homePlatformAudienceCard',
  title: 'Home Platform Audience Card',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'localeString' }),
    defineField({ name: 'title', title: 'Title', type: 'localeString' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'localeString' }),
  ],
})

export const homeAudienceTabType = defineType({
  name: 'homeAudienceTab',
  title: 'Home Audience Tab',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
  ],
})

export const homeLinkType = defineType({
  name: 'homeLink',
  title: 'Home Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'href', title: 'Href', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'string' }),
  ],
})

export const homeNavSectionType = defineType({
  name: 'homeNavSection',
  title: 'Home Navigation Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'homeLink' }],
    }),
  ],
})

export const homeNavItemType = defineType({
  name: 'homeNavItem',
  title: 'Home Navigation Item',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'href', title: 'Direct Link', type: 'string' }),
    defineField({
      name: 'sections',
      title: 'Dropdown Sections',
      type: 'array',
      of: [{ type: 'homeNavSection' }],
    }),
  ],
})

export const homeFooterColumnType = defineType({
  name: 'homeFooterColumn',
  title: 'Home Footer Column',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'homeLink' }],
    }),
  ],
})

export const homeSocialLinkType = defineType({
  name: 'homeSocialLink',
  title: 'Home Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'X / Twitter', value: 'x' },
        ],
      },
    }),
    defineField({ name: 'href', title: 'URL', type: 'string' }),
  ],
})

export const homeFormOptionType = defineType({
  name: 'homeFormOption',
  title: 'Home Form Option',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
  ],
})

export const homeDemoFormCopyType = defineType({
  name: 'homeDemoFormCopy',
  title: 'Home Demo Form Copy',
  type: 'object',
  fields: [
    defineField({ name: 'fullNameLabel', title: 'Full Name Label', type: 'string' }),
    defineField({ name: 'fullNamePlaceholder', title: 'Full Name Placeholder', type: 'string' }),
    defineField({ name: 'emailLabel', title: 'Email Label', type: 'string' }),
    defineField({ name: 'emailPlaceholder', title: 'Email Placeholder', type: 'string' }),
    defineField({ name: 'phoneLabel', title: 'Phone Label', type: 'string' }),
    defineField({ name: 'phonePlaceholder', title: 'Phone Placeholder', type: 'string' }),
    defineField({ name: 'instituteNameLabel', title: 'Institute Name Label', type: 'string' }),
    defineField({
      name: 'instituteNamePlaceholder',
      title: 'Institute Name Placeholder',
      type: 'string',
    }),
    defineField({ name: 'stateLabel', title: 'State Label', type: 'string' }),
    defineField({ name: 'statePlaceholder', title: 'State Placeholder', type: 'string' }),
    defineField({ name: 'cityLabel', title: 'City Label', type: 'string' }),
    defineField({ name: 'cityPlaceholder', title: 'City Placeholder', type: 'string' }),
    defineField({ name: 'solutionLabel', title: 'Solution Label', type: 'string' }),
    defineField({ name: 'messageLabel', title: 'Message Label', type: 'string' }),
    defineField({ name: 'messagePlaceholder', title: 'Message Placeholder', type: 'string' }),
    defineField({ name: 'captchaPlaceholder', title: 'Captcha Placeholder', type: 'string' }),
    defineField({
      name: 'captchaMismatchMessage',
      title: 'Captcha Mismatch Message',
      type: 'string',
    }),
    defineField({
      name: 'securityCheckRequiredMessage',
      title: 'Security Check Required Message',
      type: 'string',
    }),
    defineField({ name: 'submitLoadingLabel', title: 'Submit Loading Label', type: 'string' }),
    defineField({ name: 'genericErrorMessage', title: 'Generic Error Message', type: 'string' }),
    defineField({
      name: 'validationInstitutionNameRequired',
      title: 'Institution Name Validation Message',
      type: 'string',
    }),
    defineField({
      name: 'validationOrgTypeRequired',
      title: 'Organization Type Validation Message',
      type: 'string',
    }),
    defineField({
      name: 'validationFullNameRequired',
      title: 'Full Name Validation Message',
      type: 'string',
    }),
    defineField({
      name: 'validationEmailInvalid',
      title: 'Email Validation Message',
      type: 'string',
    }),
    defineField({
      name: 'validationPhoneInvalid',
      title: 'Phone Validation Message',
      type: 'string',
    }),
    defineField({
      name: 'validationStateRequired',
      title: 'State Validation Message',
      type: 'string',
    }),
    defineField({
      name: 'validationCityRequired',
      title: 'City Validation Message',
      type: 'string',
    }),
    defineField({
      name: 'solutionOptions',
      title: 'Solution Options',
      type: 'array',
      of: [{ type: 'homeFormOption' }],
    }),
  ],
})

export const homeIntegrationLogoType = defineType({
  name: 'homeIntegrationLogo',
  title: 'Home Integration Logo',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Logo Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({ name: 'logoUrl', title: 'Logo URL', type: 'string' }),
    defineField({
      name: 'accentColor',
      title: 'Accent Gradient Class',
      type: 'string',
      description: 'Example: from-blue-500/20',
    }),
  ],
})

export const homeProductVideoType = defineType({
  name: 'homeProductVideo',
  title: 'Home Product Video',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'videoUrl',
      title: 'External Video URL',
      type: 'string',
      description: 'Use this only if you are not uploading the file directly to Sanity.',
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
  ],
})

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'heroSlider', title: '🖼️ Hero Slider', default: true },
    { name: 'branding', title: '🏷️ Branding & Nav' },
    { name: 'hero', title: '🏠 Hero Content' },
    { name: 'sections', title: '📦 Page Sections' },
    { name: 'modules', title: '🧩 Modules' },
    { name: 'social', title: '💬 Testimonials & Media' },
    { name: 'integrations', title: '🔗 Integrations & FAQ' },
    { name: 'cta', title: '📝 CTA & Demo' },
    { name: 'footer', title: '📋 Footer' },
    { name: 'status', title: '🚦 Site Status' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    defineField({
      name: 'showcaseSlides',
      title: 'Hero Slider (UPLOAD IMAGES HERE)',
      description: 'These slides appear in the top Hero Slider section. Upload images and edit text here.',
      type: 'array',
      of: [{ type: 'homeShowcaseSlide' }],
      group: 'heroSlider',
    }),

    defineField({
      name: 'moduleGridSlides',
      title: 'Module Grid Slides',
      description: 'These slides appear in the MODULE GRID section further down the page.',
      type: 'array',
      of: [{ type: 'homeShowcaseSlide' }],

      group: 'modules',
    }),
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',

      group: 'branding',
    }),
    defineField({
      name: 'brandTagline',
      title: 'Brand Tagline',
      type: 'localeText',

      group: 'branding',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'string',

      group: 'branding',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Primary Contact Email',
      type: 'string',

      group: 'branding',
    }),
    defineField({
      name: 'brandLogo',
      title: 'Brand Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],

      group: 'branding',
    }),
    defineField({
      name: 'navbarMenuItems',
      title: 'Navbar Menu Items',
      type: 'array',
      of: [{ type: 'homeNavItem' }],

      group: 'branding',
    }),
    defineField({
      name: 'navbarSecondaryLinkLabel',
      title: 'Navbar Secondary Link Label',
      type: 'string',

      group: 'branding',
    }),
    defineField({
      name: 'navbarSecondaryLinkHref',
      title: 'Navbar Secondary Link Href',
      type: 'string',

      group: 'branding',
    }),
    defineField({
      name: 'navbarPrimaryCtaLabel',
      title: 'Navbar Primary CTA Label',
      type: 'string',

      group: 'branding',
    }),
    defineField({
      name: 'navbarPrimaryCtaHref',
      title: 'Navbar Primary CTA Href',
      type: 'string',

      group: 'branding',
    }),
    defineField({
      name: 'mobileMenuTitle',
      title: 'Mobile Menu Title',
      type: 'string',

      group: 'branding',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer Columns',
      type: 'array',
      of: [{ type: 'homeFooterColumn' }],

      group: 'footer',
    }),
    defineField({
      name: 'footerContactHeading',
      title: 'Footer Contact Heading',
      type: 'string',

      group: 'footer',
    }),
    defineField({
      name: 'footerAddressLines',
      title: 'Footer Address Lines',
      type: 'array',
      of: [{ type: 'string' }],

      group: 'footer',
    }),
    defineField({
      name: 'footerMapHref',
      title: 'Footer Map Href',
      type: 'string',

      group: 'footer',
    }),
    defineField({
      name: 'footerPhoneNumbers',
      title: 'Footer Phone Numbers',
      type: 'array',
      of: [{ type: 'string' }],

      group: 'footer',
    }),
    defineField({
      name: 'footerEmailAddresses',
      title: 'Footer Email Addresses',
      type: 'array',
      of: [{ type: 'string' }],

      group: 'footer',
    }),
    defineField({
      name: 'footerLegalLinks',
      title: 'Footer Legal Links',
      type: 'array',
      of: [{ type: 'homeLink' }],

      group: 'footer',
    }),
    defineField({
      name: 'footerSocialLinks',
      title: 'Footer Social Links',
      type: 'array',
      of: [{ type: 'homeSocialLink' }],

      group: 'footer',
    }),
    defineField({
      name: 'footerCopyrightText',
      title: 'Footer Copyright Text',
      type: 'string',

      group: 'footer',
    }),
    defineField({
      name: 'footerStatusLabel',
      title: 'Footer Status Label',
      type: 'string',

      group: 'status',
    }),
    defineField({
      name: 'footerStatusState',
      title: 'Footer Status State',
      type: 'string',
      initialValue: 'operational',
      options: {
        list: [
          { title: '🔄 Automatic (from Statuspage)', value: 'automatic' },
          { title: '🟢 All Systems Normal', value: 'operational' },
          { title: '🟡 Degraded Performance', value: 'degraded' },
          { title: '🟠 Partial Outage', value: 'partial_outage' },
          { title: '🔴 Major Outage', value: 'major_outage' },
          { title: '🔵 Under Maintenance', value: 'maintenance' },
        ],
        layout: 'dropdown',
      },

      group: 'status',
    }),
    defineField({
      name: 'footerStatusHref',
      title: 'Footer Status Href',
      type: 'string',

      group: 'status',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'localeString',

      group: 'hero',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'localeText',

      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Hero Primary CTA Label',
      type: 'string',

      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaHref',
      title: 'Hero Primary CTA Link',
      type: 'string',

      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Hero Secondary CTA Label',
      type: 'string',

      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaHref',
      title: 'Hero Secondary CTA Link',
      type: 'string',

      group: 'hero',
    }),
    defineField({
      name: 'showcaseTitle',
      title: 'Showcase Title',
      type: 'localeString',

      group: 'sections',
    }),
    defineField({
      name: 'showcaseKicker',
      title: 'Showcase Kicker',
      type: 'localeString',

      group: 'sections',
    }),
    defineField({
      name: 'showcaseSubtitle',
      title: 'Showcase Subtitle',
      type: 'localeText',

      group: 'sections',
    }),

    defineField({
      name: 'showcaseCtaLabelTemplate',
      title: 'Showcase CTA Label Template',
      type: 'string',
      description: 'Use {label} to insert the active showcase tab label.',

      group: 'sections',
    }),
    defineField({
      name: 'platformKicker',
      title: 'Platform Kicker',
      type: 'localeString',
      description: 'Small emerald label above the platform section heading.',

      group: 'sections',
    }),
    defineField({
      name: 'platformTitle',
      title: 'Platform Title',
      type: 'localeString',

      group: 'sections',
    }),
    defineField({
      name: 'platformBody',
      title: 'Platform Body',
      type: 'localeText',

      group: 'sections',
    }),
    defineField({
      name: 'platformConnectionHint',
      title: 'Platform Connection Hint',
      type: 'localeString',
      description: 'Short clarification shown below the paragraph to explain the connection logic.',

      group: 'sections',
    }),
    defineField({
      name: 'platformSystemLabel',
      title: 'Platform System Label',
      type: 'localeString',

      group: 'sections',
    }),
    defineField({
      name: 'platformInputLabels',
      title: 'Platform Input Labels',
      type: 'array',
      description: 'Left-side labels in the platform beam section (3 items recommended).',
      of: [{ type: 'localeString' }],

      group: 'sections',
    }),
    defineField({
      name: 'platformAudienceCards',
      title: 'Platform Audience Cards',
      type: 'array',
      description: 'Right-side cards in the platform beam section (3 items recommended).',
      of: [{ type: 'homePlatformAudienceCard' }],

      group: 'sections',
    }),
    defineField({
      name: 'productVideo',
      title: 'Product Video',
      type: 'homeProductVideo',

      group: 'sections',
    }),
    defineField({
      name: 'trustedBy',
      title: 'Trusted By Line',
      type: 'string',

      group: 'sections',
    }),
    defineField({
      name: 'trustSectionDescription',
      title: 'Trust Section Description',
      type: 'text',
      rows: 2,

      group: 'sections',
    }),
    defineField({
      name: 'machineShowcase',
      title: 'Machine Showcase Copy',
      type: 'text',
      rows: 2,

      group: 'sections',
    }),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      of: [{ type: 'homePillar' }],

      group: 'sections',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{ type: 'homeStat' }],

      group: 'sections',
    }),
    defineField({
      name: 'trustedLogos',
      title: 'Trusted Logos',
      type: 'array',
      of: [{ type: 'homeTrustLogo' }],

      group: 'sections',
    }),
    defineField({
      name: 'organizationSectionTitle',
      title: 'Organization Section Title',
      type: 'string',

      group: 'sections',
    }),
    defineField({
      name: 'organizationCardCtaLabel',
      title: 'Organization Card CTA Label',
      type: 'string',

      group: 'sections',
    }),
    defineField({
      name: 'organizationCards',
      title: 'Organization Cards',
      type: 'array',
      of: [{ type: 'homeOrganizationCard' }],

      group: 'sections',
    }),
    defineField({
      name: 'modulesSectionHeading',
      title: 'Modules Section Heading',
      type: 'localeString',
      initialValue: 'One platform. One operating system.',

      group: 'modules',
    }),
    defineField({
      name: 'modulesSectionSubtext',
      title: 'Modules Section Subtext',
      type: 'localeText',
      initialValue: 'Manage academics, operations, and workflows in one unified platform.',

      group: 'modules',
    }),
    defineField({
      name: 'modulesTitle',
      title: 'Modules Section Title',
      type: 'string',

      group: 'modules',
    }),
    defineField({
      name: 'modulesSubtitle',
      title: 'Modules Section Subtitle',
      type: 'text',
      rows: 2,

      group: 'modules',
    }),
    defineField({
      name: 'modulesAudienceTabs',
      title: 'Modules Audience Tabs',
      type: 'array',
      of: [{ type: 'homeAudienceTab' }],

      group: 'modules',
    }),
    defineField({
      name: 'modulesAllTabLabel',
      title: 'Modules All Tab Label',
      type: 'string',

      group: 'modules',
    }),
    defineField({
      name: 'modulesCardCtaLabel',
      title: 'Modules Card CTA Label',
      type: 'string',

      group: 'modules',
    }),
    defineField({
      name: 'modulesShowMoreLabel',
      title: 'Modules Show More Label',
      type: 'string',

      group: 'modules',
    }),
    defineField({
      name: 'modulesViewAllLabel',
      title: 'Modules View All Label',
      type: 'string',
      description: 'Use {count} to include the number of modules, e.g. View All {count}',

      group: 'modules',
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [{ type: 'homeModuleCard' }],

      group: 'modules',
    }),
    defineField({
      name: 'modulesCalloutTitle',
      title: 'Modules Callout Title',
      type: 'string',

      group: 'modules',
    }),
    defineField({
      name: 'modulesCalloutBody',
      title: 'Modules Callout Body',
      type: 'text',
      rows: 3,

      group: 'modules',
    }),
    defineField({
      name: 'modulesCalloutCtaLabel',
      title: 'Modules Callout Button Label',
      type: 'string',

      group: 'modules',
    }),
    defineField({
      name: 'modulesCalloutCtaHref',
      title: 'Modules Callout Button Link',
      type: 'string',

      group: 'modules',
    }),
    defineField({
      name: 'stakeholderSectionHeading',
      title: 'Stakeholder Section Heading',
      type: 'localeString',
      initialValue: 'One system for every stakeholder',

      group: 'sections',
    }),
    defineField({
      name: 'stakeholderSectionSubtext',
      title: 'Stakeholder Section Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Classgrid connects students, staff, leadership, and compliance into one unified system.',

      group: 'sections',
    }),
    defineField({
      name: 'timelineTitle',
      title: 'Timeline Section Title',
      type: 'string',

      group: 'sections',
    }),
    defineField({
      name: 'timelineSubtitle',
      title: 'Timeline Section Subtitle',
      type: 'text',
      rows: 2,

      group: 'sections',
    }),
    defineField({
      name: 'timelineTabs',
      title: 'Timeline Tabs',
      type: 'array',
      of: [{ type: 'homeTimelineTab' }],

      group: 'sections',
    }),
    defineField({
      name: 'testimonialsLabel',
      title: 'Testimonials Label',
      type: 'string',
      initialValue: 'Testimonials',

      group: 'social',
    }),
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials Heading',
      type: 'string',
      initialValue: 'Trusted by educators and institutions',

      group: 'social',
    }),
    defineField({
      name: 'testimonialsSubtext',
      title: 'Testimonials Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'See how institutions are transforming operations with Classgrid.',

      group: 'social',
    }),
    defineField({
      name: 'testimonialsTitle',
      title: 'Testimonials Section Title',
      type: 'string',

      group: 'social',
    }),
    defineField({
      name: 'videoSectionHeading',
      title: 'Video Section Heading',
      type: 'string',
      initialValue: 'See Classgrid in action',

      group: 'social',
    }),
    defineField({
      name: 'videoSectionSubtext',
      title: 'Video Section Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Watch how Classgrid simplifies operations across your institution.',

      group: 'social',
    }),
    defineField({
      name: 'videoSectionTitle',
      title: 'Video Section Title',
      type: 'string',

      group: 'social',
    }),
    defineField({
      name: 'videoSectionDescription',
      title: 'Video Section Description',
      type: 'text',
      rows: 2,

      group: 'social',
    }),
    defineField({
      name: 'testimonialsSectionDescription',
      title: 'Testimonials Section Description',
      type: 'text',
      rows: 2,

      group: 'social',
    }),
    defineField({
      name: 'integrationsKicker',
      title: 'Integrations Kicker',
      type: 'string',

      group: 'integrations',
    }),
    defineField({
      name: 'integrationsHeadline',
      title: 'Integrations Headline',
      type: 'string',
      initialValue: 'Classgrid integrates with the tools you rely on',

      group: 'integrations',
    }),
    defineField({
      name: 'integrationsSubtext',
      title: 'Integrations Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Classgrid is integrated with leading tools like AWS, Google, and more.',

      group: 'integrations',
    }),
    defineField({
      name: 'integrationsTitle',
      title: 'Integrations Title',
      type: 'string',

      group: 'integrations',
    }),
    defineField({
      name: 'integrationsSubtitle',
      title: 'Integrations Subtitle',
      type: 'text',
      rows: 2,

      group: 'integrations',
    }),
    defineField({
      name: 'integrationLogos',
      title: 'Integration Logos',
      type: 'array',
      of: [{ type: 'homeIntegrationLogo' }],

      group: 'integrations',
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ Heading',
      type: 'string',
      initialValue: 'Everything you need to know',

      group: 'integrations',
    }),
    defineField({
      name: 'faqSubtext',
      title: 'FAQ Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'Find answers to common questions about Classgrid, features, and setup.',

      group: 'integrations',
    }),
    defineField({
      name: 'faqButtonText',
      title: 'FAQ Button Text',
      type: 'string',
      initialValue: 'Explore Help Center',

      group: 'integrations',
    }),
    defineField({
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string',

      group: 'integrations',
    }),
    defineField({
      name: 'faqSectionTitle',
      title: 'FAQ Main Heading',
      type: 'string',

      group: 'integrations',
    }),
    defineField({
      name: 'faqSectionDescription',
      title: 'FAQ Description',
      type: 'text',
      rows: 2,

      group: 'integrations',
    }),
    defineField({
      name: 'faqButtonLabel',
      title: 'FAQ Button Label',
      type: 'string',

      group: 'integrations',
    }),
    defineField({
      name: 'faqButtonHref',
      title: 'FAQ Button Link',
      type: 'string',

      group: 'integrations',
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Section Title',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaBody',
      title: 'CTA Section Body',
      type: 'text',
      rows: 3,

      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'CTA Primary Button Label',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'CTA Primary Button Link',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'CTA Secondary Button Label',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaSecondaryHref',
      title: 'CTA Secondary Button Link',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'demoSectionLabel',
      title: 'Demo Section Label',
      type: 'string',
      description: 'Small green tag above the headline, e.g. "Get a Demo"',
      initialValue: 'Get a Demo',

      group: 'cta',
    }),
    defineField({
      name: 'demoSectionHeading',
      title: 'Demo Section Heading',
      type: 'string',
      description: 'Main headline for the demo section',
      initialValue: 'See how Classgrid transforms your institution',

      group: 'cta',
    }),
    defineField({
      name: 'demoSectionSubtext',
      title: 'Demo Section Subtext',
      type: 'text',
      rows: 6,
      description: 'Persuasive paragraph below the headline',
      initialValue: 'Discover how Classgrid simplifies operations, automates workflows, and connects every part of your institution in one unified system.\nFrom admissions to academics, finance to compliance — everything works seamlessly together.\nOur platform is built for scale, speed, and complete visibility across your campus.\nGet started in minutes and see how institutions are eliminating complexity with Classgrid.',

      group: 'cta',
    }),
    defineField({
      name: 'demoSectionCtaLine',
      title: 'Demo Section CTA Line',
      type: 'string',
      description: 'Optional persuasive line shown above the form',
      initialValue: 'Start your 30-day free trial — no setup complexity.',

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormTitle',
      title: 'CTA Form Title',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormSubtitle',
      title: 'CTA Form Subtitle',
      type: 'text',
      rows: 2,

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormSubmitLabel',
      title: 'CTA Form Submit Label',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormDetailsHeading',
      title: 'CTA Form Details Heading',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormInstituteHeading',
      title: 'CTA Form Institute Heading',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormMessageHeading',
      title: 'CTA Form Message Heading',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormSuccessTitle',
      title: 'CTA Form Success Title',
      type: 'string',

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormSuccessBody',
      title: 'CTA Form Success Body',
      type: 'text',
      rows: 2,

      group: 'cta',
    }),
    defineField({
      name: 'ctaFormCopy',
      title: 'CTA Form Field Copy',
      type: 'homeDemoFormCopy',

      group: 'cta',
    }),
    defineField({
      name: 'moduleHighlights',
      title: 'Module Highlights',
      type: 'array',
      of: [{ type: 'homeModuleHighlight' }],

      group: 'modules',
    }),
    defineField({
      name: 'footerCta',
      title: 'Footer CTA',
      type: 'string',

      group: 'footer',
    }),
    defineField({
      name: 'whatsNew',
      title: 'Whats New',
      type: 'string',

      group: 'seo',
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

      group: 'seo',
    }),
    defineField({
      name: 'empowerSection',
      title: 'Empower Section',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],

      group: 'sections',
    }),
  ],
})
