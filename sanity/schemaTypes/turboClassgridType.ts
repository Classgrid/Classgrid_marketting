import { defineField, defineType } from 'sanity'

export const turboClassgridType = defineType({
  name: 'turboClassgrid',
  title: 'Turbo Classgrid Section',
  type: 'document',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 3 }),

    // ── Left Side: Box 1 (School / Junior College) ──
    defineField({ name: 'leftBox1Line0', title: 'Box 1 — Title Line', type: 'string' }),
    defineField({ name: 'leftBox1Line1', title: 'Box 1 — Line 1', type: 'string' }),
    defineField({ name: 'leftBox1Line2', title: 'Box 1 — Line 2', type: 'string' }),
    defineField({ name: 'leftBox1Line3', title: 'Box 1 — Line 3', type: 'string' }),

    // ── Left Side: Box 2 (Engineering CAP) ──
    defineField({ name: 'leftBox2Line0', title: 'Box 2 — Title Line', type: 'string' }),
    defineField({ name: 'leftBox2Line1', title: 'Box 2 — Line 1', type: 'string' }),
    defineField({ name: 'leftBox2Line2', title: 'Box 2 — Line 2', type: 'string' }),
    defineField({ name: 'leftBox2Line3', title: 'Box 2 — Line 3', type: 'string' }),

    // ── Left Side: Bottom label ──
    defineField({ name: 'leftLabel', title: 'Left Bottom Label', type: 'string' }),
    defineField({ name: 'leftTime', title: 'Left Bottom Time', type: 'string' }),

    // ── Right Side: Terminal content ──
    defineField({ name: 'rightTermCmd', title: 'Right Terminal — Command', type: 'string' }),
    defineField({ name: 'rightTermLine1', title: 'Right Terminal — Line 1', type: 'string' }),
    defineField({ name: 'rightTermLine2', title: 'Right Terminal — Line 2', type: 'string' }),
    defineField({ name: 'rightTermLine3', title: 'Right Terminal — Line 3', type: 'string' }),

    // ── Right Side: Bottom label ──
    defineField({ name: 'rightLabel', title: 'Right Bottom Label', type: 'string' }),
    defineField({ name: 'rightTime', title: 'Right Bottom Time', type: 'string' }),
  ],
})
