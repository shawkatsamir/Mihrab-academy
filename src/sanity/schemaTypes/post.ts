import { defineType, defineField, defineArrayMember } from "sanity";
import { BlockquoteDecorator } from "../components/BlockquoteDecorator";

// ── Custom block types for the content body ──────────────────────
// These are the "building blocks" the client picks from.
// Each one becomes a distinct UI in the Studio editor.

const quranVerseBlock = defineArrayMember({
  // Renders as a styled blockquote with Arabic + translation
  type: "object",
  name: "quranVerse",
  title: "Quranic Verse",
  icon: () => "📖",
  fields: [
    defineField({
      name: "arabicText",
      title: "Arabic text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "translation",
      title: "Translation",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "surahName",
      title: "Surah name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ayahRef",
      title: "Ayah reference",
      type: "string",
      placeholder: "e.g. 37:102",
    }),
  ],
  preview: {
    select: { title: "surahName", subtitle: "ayahRef" },
    prepare: ({ title, subtitle }) => ({
      title: `📖 Quran — ${title ?? "Verse"}`,
      subtitle: subtitle ? `Ayah ${subtitle}` : "",
    }),
  },
});

const hadithBlock = defineArrayMember({
  // Renders as a styled pull-quote with source attribution
  type: "object",
  name: "hadith",
  title: "Hadith",
  icon: () => "🕌",
  fields: [
    defineField({
      name: "arabicText",
      title: "Arabic text (optional)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "text",
      title: "Hadith text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source / Book",
      type: "string",
      placeholder: "e.g. Sahih al-Bukhari",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "narrator",
      title: "Narrator (optional)",
      type: "string",
      placeholder: "e.g. Reported by Abu Hurairah",
    }),
    defineField({
      name: "hadithNumber",
      title: "Hadith number (optional)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "source", subtitle: "text" },
    prepare: ({ title, subtitle }) => ({
      title: `🕌 Hadith — ${title ?? "Source unknown"}`,
      subtitle: subtitle?.slice(0, 80) + "…",
    }),
  },
});

const keyLessonsBlock = defineArrayMember({
  // Renders as a grid of lesson cards (like the 🌿 lessons in the refactored post)
  type: "object",
  name: "keyLessons",
  title: "Key Lessons Block",
  icon: () => "✨",
  fields: [
    defineField({
      name: "heading",
      title: "Section heading",
      type: "string",
      placeholder: "e.g. Spiritual Lessons of Eid al-Adha",
    }),
    defineField({
      name: "lessons",
      title: "Lessons",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "lesson",
          fields: [
            defineField({
              name: "icon",
              title: "Emoji icon",
              type: "string",
              placeholder: "🌿",
            }),
            defineField({
              name: "title",
              title: "Lesson title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `✨ ${title ?? "Key Lessons"}` }),
  },
});

const faqBlock = defineArrayMember({
  // Renders as an accordion FAQ — Google FAQ schema markup
  type: "object",
  name: "faqSection",
  title: "FAQ Section",
  icon: () => "❓",
  fields: [
    defineField({
      name: "heading",
      title: "Section heading",
      type: "string",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `❓ ${title}` }),
  },
});

const calloutBlock = defineArrayMember({
  // Renders as a highlighted info/warning/tip box
  type: "object",
  name: "callout",
  title: "Callout Box",
  icon: () => "💡",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "💡 Tip", value: "tip" },
          { title: "ℹ️ Info", value: "info" },
          { title: "⚠️ Important", value: "important" },
          { title: "🌙 Islamic reminder", value: "reminder" },
        ],
        layout: "radio",
      },
      initialValue: "tip",
    }),
    defineField({
      name: "heading",
      title: "Heading (optional)",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "type" },
    prepare: ({ title, subtitle }) => ({
      title: `💡 Callout — ${title ?? subtitle}`,
    }),
  },
});

const youtubeBlock = defineArrayMember({
  // Embed YouTube videos inline in the post
  type: "object",
  name: "youtubeEmbed",
  title: "YouTube Video",
  icon: () => "▶️",
  fields: [
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({
      title: `▶️ ${title ?? "YouTube"}`,
      subtitle,
    }),
  },
});

const ctaBlock = defineArrayMember({
  // Call to action block — connects post to Mihrab courses
  type: "object",
  name: "cta",
  title: "Call to Action",
  icon: () => "🎯",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "buttonText",
      title: "Button text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "buttonUrl", title: "Button URL", type: "url" }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Teal (primary)", value: "teal" },
          { title: "Amber (warm)", value: "amber" },
          { title: "Subtle (light)", value: "subtle" },
        ],
        layout: "radio",
      },
      initialValue: "teal",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "buttonText" },
    prepare: ({ title, subtitle }) => ({
      title: `🎯 CTA — ${title}`,
      subtitle,
    }),
  },
});

const dividerBlock = defineArrayMember({
  // Visual separator between sections
  type: "object",
  name: "divider",
  title: "Section Divider",
  icon: () => "➖",
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Line", value: "line" },
          { title: "Bismillah ornament", value: "bismillah" },
          { title: "Stars", value: "stars" },
        ],
        layout: "radio",
      },
      initialValue: "line",
    }),
  ],
  preview: { prepare: () => ({ title: "➖ Section divider" }) },
});

// ── THE MAIN POST SCHEMA ─────────────────────────────────────────

export const postSchema = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  icon: () => "📝",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "SEO & Metadata" },
    { name: "settings", title: "Settings" },
  ],

  fields: [
    // ── CONTENT GROUP ─────────────────────────────────────────

    defineField({
      name: "title",
      title: "Post title",
      type: "string",
      group: "content",
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .max(100)
          .warning("Title should be 20–100 characters for best SEO"),
      description:
        'The H1 headline — include the main keyword. E.g. "Eid al-Adha: Meaning, Rituals & Lessons"',
    }),

    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description:
        "Auto-generated from title. This becomes mihrab.org/blog/your-slug",
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt (shown in blog cards and search results)",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) =>
        Rule.required()
          .max(200)
          .warning("Keep under 200 characters for clean display in blog cards"),
    }),

    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text (required for SEO)",
          type: "string",
          validation: (Rule) =>
            Rule.required().warning(
              "Alt text is required — describe the image with the post keyword",
            ),
        }),
        defineField({
          name: "caption",
          title: "Caption (optional)",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
    }),

    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "readingTime",
      title: "Reading time (minutes)",
      type: "number",
      group: "content",
      description:
        "Estimate: word count ÷ 200. The refactored Eid post = ~9 min",
      validation: (Rule) => Rule.min(1).max(60),
    }),

    // ── THE FLEXIBLE BODY ────────────────────────────────────
    // This is the key to "dynamic" posts.
    // Client picks blocks in any order — no fixed template required.

    defineField({
      name: "body",
      title: "Post content",
      type: "array",
      group: "content",
      description:
        "➕ Add blocks in any order. Mix text, Quranic verses, hadiths, FAQs, images, and CTAs freely.",
      of: [
        // Standard rich text block (paragraphs, headings, lists, bold, italic, links)
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote", value: "blockquote", component: BlockquoteDecorator },
          ],
          lists: [
            { title: "Bullet list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                title: "Link",
                name: "link",
                type: "object",
                fields: [
                  defineField({ name: "href", type: "url", title: "URL" }),
                  defineField({
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  }),
                ],
              },
              {
                title: "Internal link (to another post)",
                name: "internalLink",
                type: "object",
                fields: [
                  defineField({
                    name: "reference",
                    type: "reference",
                    title: "Post",
                    to: [{ type: "post" }],
                  }),
                ],
              },
            ],
          },
        }),

        // Image block (standalone images within the post)
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),

        // All custom Islamic content blocks
        quranVerseBlock,
        hadithBlock,
        keyLessonsBlock,
        faqBlock,
        calloutBlock,
        youtubeBlock,
        ctaBlock,
        dividerBlock,
      ],
    }),

    // ── SEO GROUP ─────────────────────────────────────────────

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "meta",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta title",
          type: "string",
          validation: (Rule) =>
            Rule.max(60).warning(
              "Keep under 60 characters — this is what appears in Google results",
            ),
          description:
            'E.g. "Eid al-Adha: Meaning, Rituals & Lessons | Mihrab"',
        }),
        defineField({
          name: "metaDescription",
          title: "Meta description",
          type: "text",
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning(
              "Keep under 160 characters — this is the snippet shown in Google",
            ),
          description:
            "Write a compelling summary that makes people want to click.",
        }),
        defineField({
          name: "keywords",
          title: "Target keywords",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description:
            'Main keywords for this post. E.g. ["Eid al-Adha", "Festival of Sacrifice", "Eid ul Adha meaning"]',
          options: { layout: "tags" },
        }),
        defineField({
          name: "ogImage",
          title: "Social share image (Open Graph)",
          type: "image",
          description:
            "If not set, hero image will be used. Ideal size: 1200×630px",
        }),
        defineField({
          name: "noIndex",
          title: "Hide from Google (noindex)",
          type: "boolean",
          initialValue: false,
          description: "Only enable this for drafts or private posts.",
        }),
      ],
    }),

    // ── SETTINGS GROUP ─────────────────────────────────────────

    defineField({
      name: "isFeatured",
      title: "Feature on homepage",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description: "Featured posts appear in the homepage hero section.",
    }),

    defineField({
      name: "relatedPosts",
      title: "Related posts",
      type: "array",
      group: "settings",
      of: [defineArrayMember({ type: "reference", to: [{ type: "post" }] })],
      validation: (Rule) => Rule.max(3),
      description:
        'Pick 2–3 posts to show at the bottom ("You might also like")',
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "settings",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description:
        'Freeform tags for filtering. E.g. "Eid", "Dhul-Hijjah", "Ibrahim", "sacrifice"',
    }),
  ],

  // How the post appears in the Studio content list
  orderings: [
    {
      title: "Published (newest first)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      title: "title",
      media: "heroImage",
      category: "category.title",
      date: "publishedAt",
    },
    prepare({ title, media, category, date }) {
      const d = date
        ? new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Draft";
      return {
        title,
        subtitle: `${category ?? "Uncategorised"} · ${d}`,
        media,
      };
    },
  },
});
