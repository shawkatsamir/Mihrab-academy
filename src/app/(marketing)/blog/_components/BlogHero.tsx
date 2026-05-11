"use client";

import { motion } from "motion/react";

export default function BlogHero() {
  return (
    <section className="bg-mihrab-green py-20 px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-serif font-bold text-mihrab-gold mb-4"
      >
        Insights &amp; Articles
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="max-w-xl mx-auto text-white/80 text-lg leading-relaxed"
      >
        Reflections, lessons, and knowledge rooted in Islamic tradition — curated
        by the scholars and teachers of Mihrab Academy.
      </motion.p>
    </section>
  );
}
