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
      name: 'avatarType',
      title: 'Avatar Type',
      type: 'string',
      options: {
        list: [
          { title: 'Gradient (Auto)', value: 'gradient' },
          { title: 'Photo', value: 'photo' },
        ],
        layout: 'radio',
      },
      initialValue: 'gradient',
    }),
    defineField({
      name: 'photo',
      title: 'Reviewer Photo',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.avatarType !== 'photo',
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
      description: 'Key positive points mentioned.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'negatives',
      title: 'Issues / Critical Points',
      description: 'Problems or areas of concern.',
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
      title: 'Admin Reply (Public)',
      description: 'Official Classgrid team response. Displayed publicly on the Reviews page.',
      type: 'text',
      rows: 3,
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
