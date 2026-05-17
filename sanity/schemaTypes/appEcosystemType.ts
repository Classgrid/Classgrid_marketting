import { defineField, defineType } from 'sanity'

export const appEcosystemType = defineType({
  name: 'appEcosystem',
  title: 'App Ecosystem Section',
  type: 'document',
  fields: [
    defineField({
      name: 'faculty',
      title: '👨‍🏫 Faculty Features',
      description: 'Caveat: Faculty have real dashboard cards plus strong backend APIs, but many detailed role screens are not yet wired as finished frontend pages. Upload screenshots of the cards found in Faculty /work.',
      type: 'array',
      of: [{ type: 'homeEcosystemFeature' }],
    }),
    defineField({
      name: 'student',
      title: '🎓 Student Features',
      description: 'Caveat: Student screens have real dashboard cards plus strong backend APIs. Upload screenshots of the cards found in Student /student/work.',
      type: 'array',
      of: [{ type: 'homeEcosystemFeature' }],
    }),
    defineField({
      name: 'parent',
      title: '👨‍👩‍👧 Parent Features',
      description: 'Caveat: Parent currently has a real admissions tracker experience at /parent/:orgId, not the full daily parent app yet. Upload screenshots of the admission portal tracker.',
      type: 'array',
      of: [{ type: 'homeEcosystemFeature' }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'App Ecosystem Features',
        subtitle: 'Manage Faculty, Student, and Parent feature highlights',
      }
    }
  }
})
