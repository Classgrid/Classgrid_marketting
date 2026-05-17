import { defineArrayMember, defineType } from 'sanity'

/**
 * richBodyType — Global reusable rich text block.
 *
 * Use this anywhere you need full editorial content:
 *   { type: 'richBody' }
 *
 * Supports: headings (h2–h4), bold, italic, underline, strike,
 * code, bullet/numbered lists, blockquote, callout boxes,
 * tables, and images with captions.
 */
export const richBodyType = defineType({
  name: 'richBody',
  title: 'Rich Body',
  type: 'array',
  of: [
    // ── Portable Text Block ─────────────────────────────────────
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Blockquote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet List', value: 'bullet' },
        { title: 'Numbered List', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              { name: 'href', type: 'string', title: 'URL' },
              { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true },
            ],
          },
          {
            name: 'highlight',
            type: 'object',
            title: 'Highlight',
            fields: [
              {
                name: 'color',
                type: 'string',
                title: 'Color',
                options: {
                  list: [
                    { title: 'Green', value: 'emerald' },
                    { title: 'Blue', value: 'blue' },
                    { title: 'Amber', value: 'amber' },
                    { title: 'Red', value: 'red' },
                  ],
                },
              },
            ],
          },
        ],
      },
    }),

    // ── Image with caption ──────────────────────────────────────
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
    }),

    // ── Callout / Tip Box ───────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout Box',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Tip', value: 'tip' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' },
            ],
            layout: 'radio',
          },
          initialValue: 'info',
        },
        { name: 'title', type: 'string', title: 'Title' },
        { name: 'body', type: 'text', title: 'Body', rows: 3 },
      ],
      preview: {
        select: { title: 'title', subtitle: 'type' },
        prepare({ title, subtitle }: any) {
          const icons: Record<string, string> = { info: 'ℹ️', tip: '💡', warning: '⚠️', success: '✅' }
          return { title: title || 'Callout', subtitle: `${icons[subtitle] || ''} ${subtitle || ''}`.trim() }
        },
      },
    }),

    // ── Table ───────────────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'richTable',
      title: 'Table',
      fields: [
        {
          name: 'headers',
          title: 'Column Headers',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'tableRow',
              title: 'Row',
              fields: [
                {
                  name: 'cells',
                  title: 'Cells',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
              ],
            },
          ],
        },
      ],
      preview: {
        select: { headers: 'headers' },
        prepare({ headers }: any) {
          return { title: 'Table', subtitle: (headers || []).join(' | ') }
        },
      },
    }),
  ],
})
