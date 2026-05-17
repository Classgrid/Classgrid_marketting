import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutValueType = defineType({
  name: "aboutValue",
  title: "About Value",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
      description: "Icon name from Lucide (e.g., Shield, Zap, Heart)",
    }),
  ],
});

export const aboutTimelineItemType = defineType({
  name: "aboutTimelineItem",
  title: "About Timeline Item",
  type: "object",
  fields: [
    defineField({
      name: "year",
      title: "Year Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const aboutTeamMemberType = defineType({
  name: "aboutTeamMember",
  title: "About Team Member",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});

export const aboutLogoItemType = defineType({
  name: "aboutLogoItem",
  title: "About Logo Item",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "href",
      title: "Website URL",
      type: "url",
    }),
  ],
});

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "showGlobe",
      title: "Show 3D Globe",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatIsClassgrid",
      title: "What is Classgrid?",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "whatWeDo",
      title: "What We Do",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "whyChooseClassgrid",
      title: "Why Choose Classgrid?",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "storyTitle",
      title: "Story Section Title",
      type: "string",
      initialValue: "Our Story",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "originQuote",
      title: "Origin Pull Quote",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "originStory",
      title: "Origin Story Paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      validation: (Rule) => Rule.required().min(3).max(3),
    }),
    defineField({
      name: "missionTitle",
      title: "Mission Card Title",
      type: "string",
      initialValue: "Mission",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "missionBody",
      title: "Mission Body",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visionTitle",
      title: "Vision Card Title",
      type: "string",
      initialValue: "Vision",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visionBody",
      title: "Vision Body",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "values",
      title: "Core Values",
      type: "array",
      of: [defineArrayMember({ type: "aboutValue" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "timeline",
      title: "Timeline (Past & Present)",
      type: "array",
      of: [defineArrayMember({ type: "aboutTimelineItem" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "futureTimelineItem",
      title: "Future Timeline Item (Always appears last)",
      type: "aboutTimelineItem",
    }),
    defineField({
      name: "teamHeadline",
      title: "Team Section Headline",
      type: "string",
      initialValue: "The people building calmer operations for education",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [defineArrayMember({ type: "aboutTeamMember" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "backedByLabel",
      title: "Backed By Label",
      type: "string",
      initialValue: "Trusted By",
    }),
    defineField({
      name: "backedByLogos",
      title: "Backed By / Trusted By Logos",
      type: "array",
      of: [defineArrayMember({ type: "aboutLogoItem" })],
    }),
    defineField({
      name: "closingHeadline",
      title: "Closing CTA Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
        subtitle: "Singleton story page",
      };
    },
  },
});
