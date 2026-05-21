import { defineField, defineType } from 'sanity'

export const sectionSettingsType = defineType({
  name: 'sectionSettings',
  title: 'Testimonials Controls',
  type: 'document',
  fields: [
    defineField({
      name: 'showClientTestimonials',
      title: 'Show Client Messages',
      type: 'boolean',
      initialValue: true,
      description: 'Turn ON to show the Client Testimonials carousel. Turn OFF to hide.',
    }),
    
    defineField({
      name: 'showTestimonialVideos',
      title: 'Show Testimonial Videos',
      type: 'boolean',
      initialValue: true,
      description: 'Turn ON to show the Testimonial Videos slider. Turn OFF to hide.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Testimonials Controls',
        subtitle: 'Manage visibility of testimonial sections',
      }
    },
  },
})
