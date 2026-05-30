import { defineField, defineType } from 'sanity'

export const websiteFeedbackType = defineType({
  name: 'websiteFeedback',
  title: 'Website Feedback (Was this helpful?)',
  type: 'document',
  icon: () => '💬',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      description: 'The type of content page this feedback came from.',
      options: {
        list: [
          { title: '⚔️ Compare', value: 'compare' },
          { title: '📝 Blog Post', value: 'blog' },
          { title: '🧩 Module', value: 'module' },
          { title: '💡 Solution', value: 'solution' },
          { title: '📊 Case Study', value: 'case-study' },
          { title: '🎯 Use Case', value: 'use-case' },
          { title: '📖 Help Article', value: 'help-article' },
          { title: '🌐 General', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'pageUrl',
      title: 'Page URL',
      type: 'string',
      description: 'The URL of the page where the feedback was submitted.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'e.g., "Classgrid vs vmedulife" or "Smart Attendance Module"',
    }),
    defineField({
      name: 'reaction',
      title: 'Emoji Reaction',
      type: 'string',
      description: 'The emoji the user clicked.',
      options: {
        list: [
          { title: '😭 Not helpful', value: 'terrible' },
          { title: '😞 Somewhat', value: 'bad' },
          { title: '😐 Okay', value: 'okay' },
          { title: '🤩 Very helpful', value: 'great' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Feedback Message',
      type: 'text',
      rows: 4,
      description: 'Optional text feedback from the visitor.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🆕 New', value: 'new' },
          { title: '✅ Reviewed', value: 'reviewed' },
          { title: '📦 Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
      description: 'Browser info (auto-captured).',
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: 'pageTitle',
      reaction: 'reaction',
      status: 'status',
      pageType: 'pageType',
      submittedAt: 'submittedAt',
    },
    prepare({ title, reaction, status, pageType, submittedAt }) {
      const emojiMap: Record<string, string> = {
        terrible: '😭',
        bad: '😞',
        okay: '😐',
        great: '🤩',
      }
      const pageTypeEmoji: Record<string, string> = {
        compare: '⚔️',
        blog: '📝',
        module: '🧩',
        solution: '💡',
        'case-study': '📊',
        'use-case': '🎯',
        'help-article': '📖',
        general: '🌐',
      }
      const statusEmoji = status === 'reviewed' ? '✅' : status === 'archived' ? '📦' : '🆕'
      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : ''
      return {
        title: `${emojiMap[reaction] || '❓'} ${title || 'Unknown page'}`,
        subtitle: `${pageTypeEmoji[pageType] || '🌐'} ${pageType || 'general'} · ${statusEmoji} ${date}`,
      }
    },
  },

  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'By Page Type',
      name: 'pageTypeAsc',
      by: [{ field: 'pageType', direction: 'asc' }, { field: 'submittedAt', direction: 'desc' }],
    },
  ],
})
