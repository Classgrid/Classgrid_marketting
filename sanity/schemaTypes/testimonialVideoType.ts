export default {
  name: "testimonialVideo",
  title: "Testimonial Video",
  type: "document",
  fields: [
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
        "Optional. Use this only if you are not uploading the video file directly to Sanity.",
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
};
