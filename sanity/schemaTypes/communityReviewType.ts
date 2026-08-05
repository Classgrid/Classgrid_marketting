import { defineField, defineType } from 'sanity';

export const communityReviewType = defineType({
  name: 'communityReview',
  title: 'Community Reviews',
  type: 'document',
  fields: [
    // ── Identity ──────────────────────────────────
    defineField({
      name: 'name',
      title: 'Reviewer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'institution',
      title: 'Institution / College',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Reviewer Email (Internal)',
      description: 'Not displayed publicly. Used to verify if the reviewer is a real Classgrid platform user and to pull their profile photo.',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'photoUrl',
      title: 'Profile Photo URL',
      description: 'Paste the Supabase storage URL of the reviewer\'s profile photo. Leave blank to use auto-generated initial avatar.',
      type: 'url',
    }),

    // ── Rating ────────────────────────────────────
    defineField({
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      options: {
        list: [
          { title: '⭐ 1', value: 1 },
          { title: '⭐⭐ 2', value: 2 },
          { title: '⭐⭐⭐ 3', value: 3 },
          { title: '⭐⭐⭐⭐ 4', value: 4 },
          { title: '⭐⭐⭐⭐⭐ 5', value: 5 },
        ],
      },
    }),

    // ── Classification ────────────────────────────
    defineField({
      name: 'category',
      title: 'Review Category',
      description: 'Used for filtering and featured sections on the marketing site.',
      type: 'string',
      options: {
        list: [
          { title: '🏆 Top Review', value: 'top' },
          { title: '🌟 Best Review', value: 'best' },
          { title: '⚠️ Critical Feedback', value: 'critical' },
          { title: '💬 General', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
    }),

    // ── Module Context (inline) ───────────────────
    defineField({
      name: 'moduleName',
      title: 'Related Module',
      description: 'Which Classgrid module is this review about?',
      type: 'string',
      options: {
        list: [
          { title: 'Overall Platform', value: 'Overall' },
          { title: 'Attendance', value: 'Attendance' },
          { title: 'Fees', value: 'Fees' },
          { title: 'Exams', value: 'Exams' },
          { title: 'Timetable', value: 'Timetable' },
          { title: 'Admissions', value: 'Admissions' },
          { title: 'Digital Classroom', value: 'Digital Classroom' },
          { title: 'AI Assistant', value: 'AI Assistant' },
          { title: 'Library', value: 'Library' },
          { title: 'Canteen', value: 'Canteen' },
          { title: 'Leave & Payroll', value: 'Leave & Payroll' },
          { title: 'Analytics', value: 'Analytics' },
          { title: 'Certificates', value: 'Certificates' },
          { title: 'Events', value: 'Events' },
        ],
      },
      initialValue: 'Overall',
    }),

    // ── Structured Feedback ───────────────────────
    defineField({
      name: 'reviewText',
      title: 'Review Content',
      description: 'The main review body.',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().max(2000),
    }),
    defineField({
      name: 'positives',
      title: 'What They Liked',
      description: '(Internal Admin Use) Briefly summarize the key positive points mentioned in the public review above into bullet points for quick reference.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'negatives',
      title: 'Issues / Critical Points',
      description: '(Internal Admin Use) Briefly summarize any problems or areas of concern mentioned in the public review above.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'suggestion',
      title: 'Suggestion (Optional)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),

    // ── Admin Response ────────────────────────────
    defineField({
      name: 'adminReply',
      title: 'Admin Reply (Public & Email)',
      description: '⚠️ DO NOT START WITH "Hi [Name]"! The automated email already starts with a full greeting ("Hi [Reviewer], I personally wanted to...").\n\nStart your reply directly with your message (e.g. "We are so happy to hear..."). This reply is shown publicly on the Reviews page AND inserted directly into the automated Thank You email.',
      type: 'text',
      rows: 4,
    }),

    // ── Email System ──────────────────────────────
    defineField({
      name: 'autoSendEmail',
      title: 'Auto-Send Thank You Email',
      description: 'If ON, the thank you email will automatically send to the reviewer exactly once when you hit "Publish".',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'customEmailSubject',
      title: 'Email Subject (Override)',
      description: 'Optional: Leave blank to use the standard subject. Type here to completely override the email subject.',
      type: 'string',
    }),
    defineField({
      name: 'customEmailBody',
      title: 'Full Email Body (Override)',
      description: 'Optional: Leave blank to use the standard branded template. Type here (using HTML) to completely override the ENTIRE email content.',
      type: 'text',
      rows: 10,
    }),

    // ── System Flags ──────────────────────────────
    defineField({
      name: 'isFeatured',
      title: 'Featured Review',
      description: 'Pin this review at the top of the feed.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified User',
      description: 'Mark as a verified Classgrid user.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Review Status',
      type: 'string',
      options: {
        list: [
          { title: '⏳ Pending (Under Review)', value: 'pending' },
          { title: '✅ Published (Live)', value: 'published' },
          { title: '❌ Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  // ── Preview ─────────────────────────────────────
  preview: {
    select: {
      title: 'name',
      subtitle: 'institution',
      status: 'status',
      rating: 'rating',
      category: 'category',
      isFeatured: 'isFeatured',
    },
    prepare({ title, subtitle, status, rating, category, isFeatured }) {
      const statusEmoji =
        status === 'published' ? '✅' : status === 'rejected' ? '❌' : '⏳';
      const categoryLabel =
        category === 'top'
          ? '🏆'
          : category === 'best'
            ? '🌟'
            : category === 'critical'
              ? '⚠️'
              : '💬';
      const pin = isFeatured ? '📌 ' : '';
      return {
        title: `${pin}${title} (${rating}⭐) ${categoryLabel}`,
        subtitle: `${statusEmoji} ${subtitle || 'No institution'}`,
      };
    },
  },

  // ── Orderings ───────────────────────────────────
  orderings: [
    {
      title: 'Rating (High → Low)',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
});
