export default {
  name: "testimonialVideo",
  title: "Testimonial Video",
  type: "document",
  fields: [
    {
      name: "playerStyle",
      title: "Video Player Style",
      type: "string",
      description:
        "Classic Slider = shows person name, avatar, subtitle overlay on the video. YouTube-Style = clean minimal player, no overlay.",
      initialValue: "classic",
      options: {
        list: [
          { title: "🎬 Classic Slider", value: "classic" },
          { title: "▶️ YouTube-Style Player", value: "youtube" },
        ],
        layout: "radio",
      },
    },
    {
      name: "video",
      title: "Video File",
      type: "file",
      options: {
        accept: "video/*",
      },
    },
    {
      name: "videoUrl",
      title: "External Video URL",
      type: "string",
      description:
        "Optional. Paste a direct .mp4 link (e.g., from Supabase or AWS S3) to bypass Sanity's CDN and save on bandwidth costs. Do not use youtube.com links.",
    },
    {
      name: "name",
      title: "Person Name",
      type: "string",
    },
    {
      name: "avatar",
      title: "Passport Photo",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
        },
      ],
    },
    {
      name: "role",
      title: "Role / School",
      type: "string",
    },
    {
      name: "subtitle",
      title: "Testimonial Text",
      type: "text",
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "playerStyle",
      media: "avatar",
    },
    prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: any }) {
      const style = subtitle === "youtube" ? "▶️ YouTube-Style" : "🎬 Classic";
      return {
        title: title || "Testimonial Video",
        subtitle: style,
        media,
      };
    },
  },
};
