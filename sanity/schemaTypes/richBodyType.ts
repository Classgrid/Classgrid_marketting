import { defineArrayMember, defineType } from 'sanity'
import { QuickTableInput } from '../components/QuickTableInput'

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
      components: { input: QuickTableInput },
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

    // ── Code Block ──────────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code Block',
      fields: [
        { name: 'language', type: 'string', title: 'Language', initialValue: 'javascript' },
        { name: 'code', type: 'text', title: 'Raw Code', rows: 10 },
        { name: 'highlightedHtml', type: 'text', title: 'Highlighted HTML (Generated by Script)', readOnly: true },
      ],
      preview: {
        select: { code: 'code', language: 'language' },
        prepare({ code, language }: any) {
          return { title: 'Code Block', subtitle: language }
        }
      }
    }),

    // ── FAQ Accordion ───────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'docsFaq',
      title: 'FAQ Accordion',
      fields: [
        { name: 'question', type: 'string', title: 'Question' },
        { 
          name: 'answer', 
          type: 'array', 
          title: 'Answer',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Code', value: 'code' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'string' }]
                  }
                ]
              }
            }
          ]
        },
      ],
      preview: {
        select: { question: 'question' },
        prepare({ question }: any) {
          return { title: 'FAQ Accordion', subtitle: question }
        }
      }
    }),

    // ── External Docs Image ─────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'docsImage',
      title: 'External Docs Image',
      fields: [
        { name: 'src', type: 'url', title: 'Image URL' },
        { name: 'alt', type: 'string', title: 'Alt Text' },
        { name: 'title', type: 'string', title: 'Title (Optional)' },
      ],
      preview: {
        select: { src: 'src', alt: 'alt' },
        prepare({ src, alt }: any) {
          return { title: 'External Image', subtitle: alt || src }
        }
      }
    }),

    // ── Video Embed ──────────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'docsVideo',
      title: 'Video Embed',
      fields: [
        { name: 'url', type: 'string', title: 'Video URL (MP4, etc)' },
        { name: 'title', type: 'string', title: 'Title (Optional)' },
        { name: 'description', type: 'text', title: 'Description (Optional)' },
      ],
      preview: {
        select: { title: 'title', url: 'url' },
        prepare({ title, url }: any) {
          return { title: 'Video Embed', subtitle: title || url }
        }
      }
    }),

    // ── Button / CTA ────────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'docsButton',
      title: 'Button / CTA',
      fields: [
        { name: 'text', type: 'string', title: 'Button Text' },
        { name: 'href', type: 'string', title: 'Link URL' },
        { 
          name: 'variant', 
          type: 'string', 
          title: 'Variant', 
          options: { list: ['default', 'secondary', 'outline', 'ghost'] },
          initialValue: 'default'
        },
      ],
      preview: {
        select: { text: 'text', href: 'href' },
        prepare({ text, href }: any) {
          return { title: 'Button', subtitle: `${text} -> ${href}` }
        }
      }
    }),

    // ── Divider ─────────────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'docsDivider',
      title: 'Divider (Horizontal Rule)',
      fields: [
        { 
          name: 'style', 
          type: 'string', 
          title: 'Style', 
          options: { list: ['solid', 'dashed', 'dotted'] }, 
          initialValue: 'solid' 
        }
      ],
      preview: {
        prepare() {
          return { title: 'Divider (---)' }
        }
      }
    }),
  ],
})
