"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  BookOpen,
  Languages,
  Scale,
  ScrollText,
  ChevronRight,
  Users,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/shared/ui/Navbar";
import Footer from "@/shared/ui/Footer";
import { type Program } from "@/shared/data/programs";

const ICONS: Record<Program["icon"], React.ReactNode> = {
  quran: <BookOpen className="w-8 h-8" />,
  arabic: <Languages className="w-8 h-8" />,
  fiqh: <Scale className="w-8 h-8" />,
  history: <ScrollText className="w-8 h-8" />,
};

const SUBCOURSE_ICONS = [BookOpen, CheckCircle, Users];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay },
});

export default function ProgramPageClient({ program }: { program: Program }) {
  return (
    <div className="min-h-screen font-sans bg-mihrab-cream overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-mihrab-green pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/arabesque.png")',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-mihrab-gold/10 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-6 md:px-12">
          <motion.div
            {...fadeUp(0)}
            className="flex items-center gap-2 text-white/50 text-sm mb-10"
          >
            <Link href="/" className="hover:text-mihrab-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/#courses"
              className="hover:text-mihrab-gold transition-colors"
            >
              Programs
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-mihrab-gold">{program.title}</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="flex-1 space-y-4">
              <motion.div
                {...fadeUp(0.1)}
                className="w-16 h-16 rounded-2xl bg-mihrab-gold/20 flex items-center justify-center text-mihrab-gold"
              >
                {ICONS[program.icon]}
              </motion.div>
              <motion.p
                {...fadeUp(0.15)}
                className="text-mihrab-gold font-medium uppercase tracking-widest text-sm"
              >
                {program.tagline}
              </motion.p>
              <motion.h1
                {...fadeUp(0.2)}
                className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight"
              >
                {program.title}
              </motion.h1>
            </div>

            <motion.div
              {...fadeUp(0.3)}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 shrink-0"
            >
              <div className="text-center">
                <p className="text-3xl font-serif text-mihrab-gold leading-none">
                  {program.subCourses.length}
                </p>
                <p className="text-white/60 text-xs uppercase tracking-wider mt-1">
                  Modules
                </p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-serif text-mihrab-gold leading-none">
                  1-on-1
                </p>
                <p className="text-white/60 text-xs uppercase tracking-wider mt-1">
                  Sessions
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <motion.div {...fadeUp(0)} className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-serif text-mihrab-green">
                About This Programme
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {program.description}
              </p>
            </motion.div>

            <motion.div
              {...fadeUp(0.15)}
              className="bg-mihrab-cream rounded-2xl p-6 border border-mihrab-gold/20 space-y-4"
            >
              <h3 className="font-serif text-mihrab-green text-lg">
                What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {program.subCourses.map((sc) => (
                  <li key={sc.title} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-mihrab-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 leading-snug">
                      {sc.title}
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-mihrab-gold shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 leading-snug">
                    Personalised 1-on-1 sessions
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-mihrab-gold shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 leading-snug">
                    Free trial lesson included
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subcourse Cards */}
      <section className="py-20 bg-mihrab-cream">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <motion.div {...fadeUp(0)} className="mb-12">
            <p className="text-mihrab-gold font-medium uppercase tracking-widest text-sm mb-3">
              Programme Modules
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-mihrab-green">
              What You Will Learn
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {program.subCourses.map((sc, i) => {
              const SubIcon = SUBCOURSE_ICONS[i % SUBCOURSE_ICONS.length];
              return (
                <motion.div
                  key={sc.title}
                  {...fadeUp(i * 0.1)}
                  className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-mihrab-green/10 group-hover:bg-mihrab-green flex items-center justify-center text-mihrab-green group-hover:text-mihrab-gold transition-colors duration-300">
                      <SubIcon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-serif text-gray-100 group-hover:text-mihrab-gold/25 transition-colors duration-300 leading-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="w-8 h-0.5 bg-mihrab-gold rounded-full" />

                  <div className="flex flex-col gap-3 flex-1">
                    <h3 className="font-serif text-lg text-mihrab-green leading-snug">
                      {sc.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {sc.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center space-y-6">
          <motion.div {...fadeUp(0)}>
            <p className="text-mihrab-gold font-medium uppercase tracking-widest text-sm mb-4">
              Start Today
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-mihrab-green leading-tight mb-4">
              Ready to Begin Your{" "}
              <span className="text-mihrab-gold">{program.title}</span> Journey?
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Book a free trial session and meet your teacher before committing.
              No pressure, no payment required.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.15)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <a
              href={`https://wa.me/201553135708?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20trial%20for%20the%20${encodeURIComponent(program.title)}%20at%20Mihrab%20Academy.`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-mihrab-green hover:bg-mihrab-green-light text-white font-semibold px-8 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Book a Free Trial
            </a>
            <Link
              href="/#courses"
              className="w-full sm:w-auto border border-mihrab-green text-mihrab-green hover:bg-mihrab-green hover:text-white font-medium px-8 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              View All Programs
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
