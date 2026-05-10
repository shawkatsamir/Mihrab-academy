import { defineType, defineField } from "sanity";

export const authorSchema = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: () => "👤",

  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "role", title: "Role / title", type: "string" }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "bio", title: "Short bio", type: "text", rows: 3 }),
  ],

  preview: {
    select: { title: "name", media: "photo" },
    prepare: ({ title, media }) => ({ title, media }),
  },
});
