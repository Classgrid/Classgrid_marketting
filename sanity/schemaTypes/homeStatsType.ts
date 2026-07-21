import { defineField, defineType } from 'sanity'

export const homeStatsType = defineType({
  name: 'homeStats',
  title: 'Global Stats',
  type: 'document',
  fields: [
    defineField({
      name: 'students',
      title: 'Students Managed',
      type: 'string',
      initialValue: '100,000+',
    }),
    defineField({
      name: 'showStudents',
      title: '👁️ Show "Students Managed" stat',
      description: 'Toggle OFF to hide this stat from the homepage. Use this when the stat is not yet ready (e.g. Coming Soon).',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'institutions',
      title: 'Institutions Managed',
      type: 'string',
      initialValue: '50+',
    }),
    defineField({
      name: 'showInstitutions',
      title: '👁️ Show "Institutions" stat',
      description: 'Toggle OFF to hide this stat from the homepage.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'modules',
      title: 'Modules Available',
      type: 'string',
      initialValue: '25+',
    }),
    defineField({
      name: 'showModules',
      title: '👁️ Show "Modules" stat',
      description: 'Toggle OFF to hide this stat from the homepage.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'uptime',
      title: 'System Uptime',
      type: 'string',
      initialValue: '99.9%',
    }),
    defineField({
      name: 'showUptime',
      title: '👁️ Show "Uptime" stat',
      description: 'Toggle OFF to hide this stat from the homepage.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
