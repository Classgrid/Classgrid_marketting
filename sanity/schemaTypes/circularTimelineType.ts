import { defineField, defineType } from 'sanity'

const themeOptions = [
  { title: 'Emerald', value: 'emerald' },
  { title: 'Blue', value: 'blue' },
  { title: 'Fuchsia', value: 'fuchsia' },
  { title: 'Amber', value: 'amber' },
]

export const circularTimelineRingType = defineType({
  name: 'circularTimelineRing',
  title: 'Circular Timeline Ring',
  type: 'object',
  fields: [
    defineField({
      name: 'nodes',
      title: 'Role Nodes',
      description:
        'Keep this compact for the orbital UI: 2 nodes for the inner ring, and no more than 3 nodes for middle/outer rings.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.min(1).max(3),
    }),
  ],
  preview: {
    select: { nodes: 'nodes' },
    prepare({ nodes }) {
      return {
        title: Array.isArray(nodes) && nodes.length > 0 ? nodes.join(' / ') : 'Timeline ring',
      }
    },
  },
})

export const circularTimelineTabType = defineType({
  name: 'circularTimelineTab',
  title: 'Circular Timeline Tab',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      description: 'Stable ID used by the frontend, for example school, college, engineering, coaching.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Tab Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Optional Feature Lines',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'rings',
      title: 'Rings',
      description:
        'Use exactly 3 rings: inner core users, middle operational users, and outer leadership/admins.',
      type: 'array',
      of: [{ type: 'circularTimelineRing' }],
      validation: (Rule) => Rule.required().length(3),
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'label' },
  },
})

export const circularTimelineRoleType = defineType({
  name: 'circularTimelineRole',
  title: 'Circular Timeline Role Popup',
  type: 'object',
  fields: [
    defineField({
      name: 'roleKey',
      title: 'Role Name / Node Label',
      description:
        'This must exactly match a role node in the rings, for example Operations Admins or Department Heads.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Popup Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      initialValue: 'System Connected',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tooltip',
      title: 'Hover Tooltip',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Left Card Features',
      description: 'Three short bullets work best in the popup.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'stats',
      title: 'Right Card Benefits',
      description: 'Three short benefit lines work best in the popup.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'metric',
      title: 'Bottom Highlight Metric',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: { list: themeOptions, layout: 'radio' },
      initialValue: 'emerald',
    }),
  ],
  preview: {
    select: { title: 'roleKey', subtitle: 'title' },
  },
})

export const circularTimelineType = defineType({
  name: 'circularTimeline',
  title: 'Circular Timeline',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Circular Timeline',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Internal Notes',
      type: 'text',
      rows: 2,
      description: 'Editor notes only. The homepage section heading still comes from Home Page copy.',
    }),
    defineField({
      name: 'tabs',
      title: 'Organization Tabs and Rings',
      type: 'array',
      of: [{ type: 'circularTimelineTab' }],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: 'roles',
      title: 'Role Popup Content',
      description:
        'Add one popup entry for every node label used in the rings. You can edit, delete, replace, or add roles here.',
      type: 'array',
      of: [{ type: 'circularTimelineRole' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle' },
  },
})
