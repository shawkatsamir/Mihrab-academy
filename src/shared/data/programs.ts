export type SubCourse = {
  title: string;
  description: string;
};

export type Program = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: "quran" | "arabic" | "fiqh" | "history";
  subCourses: SubCourse[];
};

export const programs: Program[] = [
  {
    slug: "quran",
    title: "Quran Program",
    tagline: "Read, Memorise & Understand the Holy Quran",
    description:
      "Here you will find the difference in learning the Holy Qur'an in terms of reading, memorising, and Tajweed, in addition to learning the interpretation — in order to live within the verses and feel the Quranic messages through understanding the tafsir and the reasons for revelation.",
    icon: "quran",
    subCourses: [
      {
        title: "Memorisation Lessons",
        description:
          "You can continue memorising with teachers who hold a degree in the Qur'an and are proficient in what they teach you and your children. Our structured Hifz programme ensures steady, sustainable progress at every age — from young children building their first surahs to adults completing the full Quran.",
      },
      {
        title: "Tajweed Lessons",
        description:
          "Educational habits formed from a young age are like engravings on stone. Our Tajweed programme ensures correct pronunciation and recitation from the very first lesson, establishing each student in the right way and grounding them in the rules that bring the Quran to life.",
      },
      {
        title: "Tafsir & Reasons for Revelation",
        description:
          "All of this is accompanied by in-depth explanation (Tafsir), reasons for revelation (Asbab al-Nuzul), and the wonderful stories behind the verses — helping students connect spiritually and intellectually with the Quran, so that its meanings live in their hearts, not just on their tongues.",
      },
    ],
  },
  {
    slug: "arabic",
    title: "Arabic Language",
    tagline: "Learn the Language of the Quran Your Way",
    description:
      "The language of the Qur'an — and the most wonderful language of all time. Here you can learn according to your own goals: conversation, reading, writing, and comprehension. All levels and plans are tailored to the age and experience of each student, ensuring a personalised path to fluency.",
    icon: "arabic",
    subCourses: [
      {
        title: "Beginner Level",
        description:
          "The student begins from the very foundation of the Arabic language — learning the letters, their articulation points (makhaarij), and their correct pronunciation, progressing all the way to confident reading and accurate dictation. The ideal starting point for students of any age with no prior Arabic knowledge.",
      },
      {
        title: "Intermediate Level",
        description:
          "The student learns the elements of a sentence, its grammatical structure, how to form questions, and how to build conversations that express real, everyday situations. This level bridges the gap between recognising Arabic and actively using it with confidence.",
      },
      {
        title: "Advanced Level",
        description:
          "The student develops the ability to converse fully and fluently, understand complex sentences and contexts, and read classical texts correctly. By this stage, students engage with Arabic as a living language — equipped to access Islamic scholarship directly.",
      },
      {
        title: "Noorani Qaida",
        description:
          "Alongside the language levels, the programme includes dedicated teaching of the Noorani Qaida — the foundational method for learning the correct recitation of the Holy Quran. This ensures students build a solid reading base that carries through every level of their Arabic and Quranic journey.",
      },
    ],
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    tagline: "Faith, Jurisprudence & the Sciences of Islam",
    description:
      "Learn the concept of Islamic education from all aspects and become familiar with everything you need to know about the religion — from belief in Allah Almighty to the jurisprudential matters that every Muslim requires in daily life. A comprehensive programme taught by qualified scholars with clarity, depth, and care.",
    icon: "fiqh",
    subCourses: [
      {
        title: "Islamic Jurisprudence (Fiqh)",
        description:
          "This module covers the foundations of the religion: what is permissible (halal) and forbidden (haram), recommended practices (sunnah), permissible actions (mubah), disliked actions (makruh), and other rulings every Muslim must know — so they can navigate daily life with confidence and avoid what is prohibited.",
      },
      {
        title: "Aqeedah (Islamic Creed)",
        description:
          "This module focuses on the principle of monotheism (Tawhid) — belief in Allah Almighty, His angels, His books, His messengers, the Last Day, the Resurrection, and the Gathering — together with the textual and rational proofs for these beliefs, building an unshakeable foundation of faith.",
      },
      {
        title: "Hadith (Prophetic Tradition)",
        description:
          "This module studies the Sunnah of the Prophet Muhammad ﷺ — his sayings, actions, and silent approvals. Students learn to understand and apply Prophetic guidance in their lives, developing a direct connection with the second most important source of Islamic knowledge.",
      },
      {
        title: "Seerah (Biography of the Prophet ﷺ)",
        description:
          "This module teaches the biography of our Prophet Muhammad ﷺ, his noble companions, and his blessed wives — their stories, their sacrifices, and the lessons they carry. Students learn to emulate their example and draw inspiration from the most remarkable generation in Islamic history.",
      },
    ],
  },
  {
    slug: "history",
    title: "History Program",
    tagline: "Know Your Heritage — Built on Facts",
    description:
      "Herein lies the difference: we learn about historical events that are absent from our children — and indeed from most of us. History is the heritage upon which generations build their identity, and it must be grounded in facts. Our History Programme brings the past to life with clarity, honesty, and scholarly rigour.",
    icon: "history",
    subCourses: [
      {
        title: "Islamic History",
        description:
          "Students explore the complete history of Islam from its very beginnings to the present day — including the early conquests, pivotal battles, great victories, periods of prosperity, and periods of weakness experienced by the Islamic state. A sweeping, honest account of a civilisation that shaped the world.",
      },
      {
        title: "Arab History",
        description:
          "Students learn about the Arabian Peninsula — its pre-Islamic history, its transformation under Islam, and the division and unification of its states across the centuries. A foundational module for understanding the roots of the Arab world and its enduring place in global history.",
      },
      {
        title: "European History",
        description:
          "Students learn about the history of European countries in a clear and comprehensive manner — from the medieval period and the Crusades through to the Renaissance, the Age of Empires, and the modern era. Understanding European history enriches students' ability to see the world and Islam's place within it.",
      },
    ],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
