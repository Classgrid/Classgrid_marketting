import { defineField, defineType } from 'sanity'

export const sectionSettingsType = defineType({
  name: 'sectionSettings',
  title: 'Section Settings',
  type: 'document',
  groups: [
    { name: 'testimonials', title: 'Testimonials (Client)' },
    { name: 'videos', title: 'Testimonial Videos' },
    { name: 'whyClassgrid', title: 'Why ClassGrid' },
    { name: 'teamVision', title: 'Team Vision' },
    { name: 'moduleGrid', title: 'Module Grid' },
    { name: 'turboComparison', title: '⚡ Speed Comparison (Vercel-style)' },
    { name: 'isometricStack', title: '🏗️ Isometric Stack (Zoho-style)' },
  ],
  fields: [
    defineField({
      name: 'showClientTestimonials',
      title: 'Show Client Testimonials',
      type: 'boolean',
      initialValue: true,
      description: 'Turn ON to show the Client Testimonials carousel (Dr. Sharma, etc.). Turn OFF to hide.',
      group: 'testimonials',
    }),
    
    defineField({
      name: 'showTestimonialVideos',
      title: 'Show Testimonial Videos',
      type: 'boolean',
      initialValue: true,
      description: 'Turn ON to show the Testimonial Videos slider (Rahul Sharma, etc.). Turn OFF to hide.',
      group: 'videos',
    }),

    defineField({
      name: 'showModuleGrid',
      title: 'Show Module Grid',
      type: 'boolean',
      initialValue: true,
      description: 'Turn ON to show the Module Grid showcase section. Turn OFF to hide.',
      group: 'moduleGrid',
    }),

    defineField({
      name: 'showWhyClassgrid',
      title: 'Show Why ClassGrid Section',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to show the new Why ClassGrid section with value prop cards.',
      group: 'whyClassgrid',
    }),
    defineField({
      name: 'whyClassgridTitle',
      title: 'Why ClassGrid Title',
      type: 'string',
      initialValue: 'Why ClassGrid?',
      group: 'whyClassgrid',
      hidden: ({ parent }) => !parent?.showWhyClassgrid,
    }),
    defineField({
      name: 'whyClassgridDescription',
      title: 'Why ClassGrid Description',
      type: 'text',
      rows: 2,
      group: 'whyClassgrid',
      hidden: ({ parent }) => !parent?.showWhyClassgrid,
    }),
    defineField({
      name: 'whyClassgridCards',
      title: 'Why ClassGrid Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'icon', title: 'Icon Name', type: 'string', description: 'e.g., Shield, Zap, Globe, Users, BookOpen' },
          ],
        },
      ],
      group: 'whyClassgrid',
      hidden: ({ parent }) => !parent?.showWhyClassgrid,
    }),

    defineField({
      name: 'showTeamVision',
      title: 'Show Team Vision Section',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to show the new Team Vision section with founder/team quotes.',
      group: 'teamVision',
    }),
    defineField({
      name: 'teamVisionTitle',
      title: 'Team Vision Title',
      type: 'string',
      initialValue: 'Our Vision',
      group: 'teamVision',
      hidden: ({ parent }) => !parent?.showTeamVision,
    }),
    defineField({
      name: 'teamVisionQuotes',
      title: 'Team Vision Quotes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'role', title: 'Role', type: 'string' },
            { name: 'quote', title: 'Quote', type: 'text', rows: 3 },
            { 
              name: 'avatar', 
              title: 'Photo', 
              type: 'image', 
              options: { hotspot: true },
              fields: [
                { name: 'alt', title: 'Alt text', type: 'string' }
              ]
            },
          ],
        },
      ],
      group: 'teamVision',
      hidden: ({ parent }) => !parent?.showTeamVision,
    }),

    defineField({
      name: 'showTurboComparison',
      title: 'Show Speed Comparison Section',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to show the Vercel-style "Without ClassGrid vs With ClassGrid" animated comparison section.',
      group: 'turboComparison',
    }),

    defineField({
      name: 'showIsometricStack',
      title: 'Show Isometric Stack Section',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to show the Zoho-style sticky scroll 3D isometric stack section.',
      group: 'isometricStack',
    }),
  ],
})
