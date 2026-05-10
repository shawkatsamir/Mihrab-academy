import { defineType, defineField } from "sanity";

export const categorySchema = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: () => "🏷️",

  fields: [
    defineField({
      name: "title",
      title: "Category name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "color",
      title: "Theme color",
      type: "string",
      options: {
        list: [
          { title: "Teal (Quran)", value: "teal" },
          { title: "Purple (Arabic)", value: "purple" },
          { title: "Amber (Islamic Studies)", value: "amber" },
          { title: "Blue (Prophet's Life)", value: "blue" },
          { title: "Green (General Islamic)", value: "green" },
        ],
        layout: "radio",
      },
    }),
  ],

  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title }),
  },
});
