"use client";

import { BookOpen, Languages, Scale, ScrollText, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { programs, type Program } from "@/shared/data/programs";

const ICONS: Record<Program["icon"], React.ReactNode> = {
  quran: <BookOpen className="w-7 h-7" />,
  arabic: <Languages className="w-7 h-7" />,
  fiqh: <Scale className="w-7 h-7" />,
  history: <ScrollText className="w-7 h-7" />,
};

const ORDER_LABELS = ["01", "02", "03", "04"];

export default function Programs() {
  return (
    <section id="courses" className="py-24 bg-mihrab-cream relative">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/arabesque.png")',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-mihrab-gold font-medium uppercase tracking-widest text-sm mb-3">
            What We Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-mihrab-green mb-5">
            Our Programs
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Comprehensive Islamic education designed for all ages and levels —
            from the first letter of the Quran to advanced scholarship.
          </p>
        </motion.div>

        {/* Grid — 1 col → 2 col → 4 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-mihrab-gold" />

              <div className="flex flex-col flex-1 p-6">
                {/* Number + Icon row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-mihrab-green/10 group-hover:bg-mihrab-green flex items-center justify-center text-mihrab-green group-hover:text-mihrab-gold transition-colors duration-300">
                    {ICONS[program.icon]}
                  </div>
                  <span className="text-3xl font-serif text-gray-100 group-hover:text-mihrab-gold/30 transition-colors duration-300 leading-none select-none">
                    {ORDER_LABELS[index]}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-semibold text-mihrab-green mb-2 leading-snug">
                  {program.title}
                </h3>

                {/* Tagline */}
                <p className="text-xs text-mihrab-gold font-medium uppercase tracking-wide mb-3">
                  {program.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-5">
                  {program.description}
                </p>

                {/* Modules badge + CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {program.subCourses.length} modules
                  </span>
                  <Link
                    href={`/courses/${program.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-mihrab-green group-hover:text-mihrab-gold transition-colors duration-300"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
