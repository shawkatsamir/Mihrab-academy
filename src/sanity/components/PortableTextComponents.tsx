import { Img } from "@/shared/ui/Image";
import type { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

// ── Block value types (mirror the schema fields) ─────────────────

type QuranVerseValue = {
  arabicText?: string;
  translation: string;
  surahName: string;
  ayahRef?: string;
};

type HadithValue = {
  arabicText?: string;
  text: string;
  source: string;
  narrator?: string;
  hadithNumber?: string;
};

type Lesson = {
  _key: string;
  icon?: string;
  title: string;
  description?: string;
};

type KeyLessonsValue = {
  heading?: string;
  lessons?: Lesson[];
};

type FaqItem = {
  _key: string;
  question: string;
  answer: string;
};

type FaqSectionValue = {
  heading?: string;
  questions?: FaqItem[];
};

type CalloutValue = {
  type: "tip" | "info" | "important" | "reminder";
  heading?: string;
  body: string;
};

type YoutubeEmbedValue = {
  url: string;
  caption?: string;
};

type CtaValue = {
  heading: string;
  description?: string;
  buttonText: string;
  buttonUrl?: string;
  style: "teal" | "amber" | "subtle";
};

type DividerValue = {
  style: "line" | "bismillah" | "stars";
};

type ImageValue = SanityImageSource & {
  alt: string;
  caption?: string;
};

// ── Mark value types ──────────────────────────────────────────────

type LinkValue = {
  href?: string;
  blank?: boolean;
};

type InternalLinkValue = {
  slug?: string;
};

// ── Components ────────────────────────────────────────────────────

export const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }: { value?: LinkValue; children: React.ReactNode }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-teal-600 underline underline-offset-2 hover:text-teal-800 transition-colors"
      >
        {children}
      </a>
    ),
    internalLink: ({ value, children }: { value?: InternalLinkValue; children: React.ReactNode }) => (
      <a
        href={value?.slug ? `/blog/${value.slug}` : "#"}
        className="text-teal-600 underline underline-offset-2 hover:text-teal-800 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    quranVerse: ({ value }: { value: QuranVerseValue }) => (
      <div className="not-prose quran-verse bg-teal-50 border-l-4 border-teal-500 p-5 my-6 rounded-r-lg">
        {value.arabicText && (
          <p
            className="text-right text-xl font-arabic leading-loose text-gray-800 mb-3"
            dir="rtl"
          >
            {value.arabicText}
          </p>
        )}
        <blockquote className="text-gray-700 italic mb-2">
          &ldquo;{value.translation}&rdquo;
        </blockquote>
        <cite className="text-sm text-teal-700 font-medium not-italic">
          — {value.surahName}
          {value.ayahRef ? ` (${value.ayahRef})` : ""}
        </cite>
      </div>
    ),

    hadith: ({ value }: { value: HadithValue }) => (
      <div className="not-prose hadith bg-amber-50 border-l-4 border-amber-500 p-5 my-6 rounded-r-lg">
        {value.arabicText && (
          <p
            className="text-right text-lg font-arabic leading-loose text-gray-800 mb-3"
            dir="rtl"
          >
            {value.arabicText}
          </p>
        )}
        <blockquote className="text-gray-800 font-medium mb-2">
          &ldquo;{value.text}&rdquo;
        </blockquote>
        <cite className="text-sm text-amber-700 not-italic">
          — {value.source}
          {value.narrator && `, ${value.narrator}`}
          {value.hadithNumber && ` (${value.hadithNumber})`}
        </cite>
      </div>
    ),

    keyLessons: ({ value }: { value: KeyLessonsValue }) => (
      <div className="not-prose key-lessons my-8">
        {value.heading && (
          <h3 className="text-xl font-medium mb-4">{value.heading}</h3>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {value.lessons?.map((lesson) => (
            <div key={lesson._key} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">{lesson.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{lesson.title}</p>
                {lesson.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {lesson.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    faqSection: ({ value }: { value: FaqSectionValue }) => (
      <div
        className="not-prose faq-section my-8"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        {value.heading && (
          <h3 className="text-xl font-medium mb-4">{value.heading}</h3>
        )}
        {value.questions?.map((q) => (
          <div
            key={q._key}
            className="faq-item border rounded-lg mb-2 p-4"
            itemScope
            itemType="https://schema.org/Question"
            itemProp="mainEntity"
          >
            <p className="font-medium" itemProp="name">
              {q.question}
            </p>
            <div
              itemScope
              itemType="https://schema.org/Answer"
              itemProp="acceptedAnswer"
            >
              <p className="text-gray-600 mt-2 text-sm" itemProp="text">
                {q.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),

    callout: ({ value }: { value: CalloutValue }) => {
      const styles: Record<CalloutValue["type"], string> = {
        tip: "bg-teal-50 border-teal-300 text-teal-800",
        info: "bg-blue-50 border-blue-300 text-blue-800",
        important: "bg-red-50 border-red-300 text-red-800",
        reminder: "bg-green-50 border-green-300 text-green-800",
      };
      return (
        <div
          className={`not-prose callout border rounded-lg p-4 my-5 ${styles[value.type] ?? styles.tip}`}
        >
          {value.heading && <p className="font-medium mb-1">{value.heading}</p>}
          <p className="text-sm">{value.body}</p>
        </div>
      );
    },

    youtubeEmbed: ({ value }: { value: YoutubeEmbedValue }) => {
      const videoId = value.url.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1];
      if (!videoId) return null;
      return (
        <figure className="not-prose my-8">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title={value.caption ?? "Video"}
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    cta: ({ value }: { value: CtaValue }) => (
      <div
        className={`not-prose cta-block text-center p-8 rounded-xl my-8 ${
          value.style === "teal"
            ? "bg-teal-600 text-white"
            : value.style === "amber"
              ? "bg-amber-50 border border-amber-200"
              : "bg-gray-50 border border-gray-200"
        }`}
      >
        <h3 className="text-xl font-medium mb-2">{value.heading}</h3>
        {value.description && (
          <p className="mb-4 opacity-90">{value.description}</p>
        )}
        <a
          href={value.buttonUrl}
          className="inline-block px-6 py-3 rounded-lg font-medium bg-white text-teal-700 hover:opacity-90 transition"
        >
          {value.buttonText}
        </a>
      </div>
    ),

    divider: ({ value }: { value: DividerValue }) => (
      <div
        className={`not-prose divider text-center my-8 text-gray-300 ${value.style === "stars" ? "text-xl tracking-widest" : ""}`}
      >
        {value.style === "stars" ? (
          "✦ ✦ ✦"
        ) : value.style === "bismillah" ? (
          "﷽"
        ) : (
          <hr className="border-gray-200" />
        )}
      </div>
    ),

    image: ({ value }: { value: ImageValue }) => (
      <figure className="not-prose my-6">
        <Img
          src={urlFor(value).width(800).auto("format").url()}
          alt={value.alt}
          className="w-full rounded-lg"
          fill
        />
        {value.caption && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
};
