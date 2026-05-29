import { defineField, defineType } from 'sanity'
import { Users } from 'lucide-react'

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: Users,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'CEO & Founder', value: 'CEO & Founder' },
          { title: 'Co-Founder', value: 'Co-Founder' },
          { title: 'CTO', value: 'CTO' },
          { title: 'CMO', value: 'CMO' },
          { title: 'Lead Engineer', value: 'Lead Engineer' },
          { title: 'Software Engineer', value: 'Software Engineer' },
          { title: 'Frontend Developer', value: 'Frontend Developer' },
          { title: 'Backend Developer', value: 'Backend Developer' },
          { title: 'Product Designer', value: 'Product Designer' },
          { title: 'UI/UX Designer', value: 'UI/UX Designer' },
          { title: 'Product Manager', value: 'Product Manager' },
          { title: 'Sales Director', value: 'Sales Director' },
          { title: 'Sales Representative', value: 'Sales Representative' },
          { title: 'Marketing Manager', value: 'Marketing Manager' },
          { title: 'Content Writer', value: 'Content Writer' },
          { title: 'Support Manager', value: 'Support Manager' },
          { title: 'Customer Support', value: 'Customer Support' },
          { title: 'Module Expert', value: 'Module Expert' },
          { title: 'Platform Associate', value: 'Platform Associate' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Leadership', value: 'leadership' },
          { title: 'Engineering', value: 'engineering' },
          { title: 'Sales & Marketing', value: 'sales' },
          { title: 'Support & Module Experts', value: 'support' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineField({
          name: 'socialLink',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: ['LinkedIn', 'Twitter', 'GitHub', 'Facebook', 'Instagram', 'Website'],
              },
            }),
            defineField({
              name: 'url',
              type: 'url',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})
