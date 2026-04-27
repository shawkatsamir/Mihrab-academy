/** Locked topic that is always present in every session report and cannot be removed. */
export const LOCKED_TOPIC = "Attendance";

/**
 * Suggested topics per subject category shown as quick-add chips in the
 * teacher report form. Teachers can still add any custom topic not listed here.
 */
export const TOPIC_PRESETS: Record<string, readonly string[]> = {
  quran: [
    "Tajweed",
    "Memorization",
    "Recitation",
    "Pronunciation",
    "Fluency",
    "Makharij",
    "Rules of Waqf",
    "Review",
  ],
  arabic: [
    "Vocabulary",
    "Grammar",
    "Reading",
    "Writing",
    "Speaking",
    "Comprehension",
    "Dictation",
    "Review",
  ],
  islamic_studies: [
    "Fiqh",
    "Aqeedah",
    "Seerah",
    "Hadith",
    "Tafsir",
    "Islamic Ethics",
    "Supplications",
    "Review",
  ],
};

/** Returns the preset list for a given subject category (falls back to an empty array). */
export function getPresets(subjectCategory: string | null | undefined): readonly string[] {
  return TOPIC_PRESETS[subjectCategory ?? ""] ?? [];
}
