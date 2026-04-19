"use client";
import { BookOpen, Languages, Scale } from "lucide-react";
import { motion } from "motion/react";

const programs = [
  {
    title: "Quran Memorization",
    description:
      "Systematic Hifz program with certified teachers, focusing on Tajweed and retention.",
    icon: <BookOpen className="w-12 h-12 text-mihrab-gold mb-4" />,
  },
  {
    title: "Arabic Language",
    description:
      "Master Classical Arabic grammar, vocabulary, and comprehension for sacred texts.",
    icon: <Languages className="w-12 h-12 text-mihrab-gold mb-4" />,
  },
  {
    title: "Islamic Jurisprudence",
    description:
      "Explore Fiqh and Usul with qualified scholars, covering daily life and worship.",
    icon: <Scale className="w-12 h-12 text-mihrab-gold mb-4" />,
  },
];

export default function Programs() {
  return (
    <section id="courses" className="py-24 bg-mihrab-cream relative">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/arabesque.png")',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-mihrab-gold mb-6">
            Our Programs
          </h2>
          <p className="text-gray-700 text-lg">
            Comprehensive Islamic Studies: Structured courses designed for
            beginners to advanced learners, fostering a deep connection with the
            words of Allah.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl border border-mihrab-gold/30 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                {program.icon}
              </div>
              <h3 className="text-2xl font-serif text-mihrab-gold mb-4">
                {program.title}
              </h3>
              <p className="text-gray-600 mb-8 flex-grow">
                {program.description}
              </p>
              <button className="bg-mihrab-green hover:bg-mihrab-green-light text-white font-medium px-6 py-2 rounded transition-colors">
                Learn More
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
