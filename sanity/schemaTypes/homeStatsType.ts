import { defineField, defineType } from 'sanity'

export const homeStatsType = defineType({
  name: 'homeStats',
  title: 'Global Stats',
  type: 'document',
  fields: [
    defineField({
      name: 'institutions',
      title: 'Institutions Managed',
      type: 'string',
      initialValue: '50+',
    }),
    defineField({
      name: 'students',
      title: 'Students Managed',
      type: 'string',
      initialValue: '100,000+',
    }),
    defineField({
      name: 'modules',
      title: 'Modules Available',
      type: 'string',
      initialValue: '25+',
    }),
    defineField({
      name: 'uptime',
      title: 'System Uptime',
      type: 'string',
      initialValue: '99.9%',
    }),
  ],
})
