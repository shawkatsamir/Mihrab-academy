"use client";
import { CheckCircle2, Users } from "lucide-react";
import { motion } from "motion/react";

const benefits = [
  {
    title: "Qualified Teachers",
    description: "Learn from scholars with authentic Ijazahs",
  },
  {
    title: "Structured Curriculum",
    description: "Clear milestones and progress tracking",
  },
  {
    title: "Flexible Learning",
    description: "Interactive online sessions tailored to your schedule",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-mihrab-green text-white relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/arabesque.png")',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid md:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-mihrab-gold font-semibold tracking-wider uppercase mb-4 text-sm">
            Excellence in Education
          </p>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Why Choose Mihrab Academy?
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            We are dedicated to offering a spiritually enriching and structured
            environment for Islamic studies. Our approach guarantees
            personalized guidance, nurturing each student&apos;s journey in
            learning the Deen and achieving academic excellence.
          </p>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-mihrab-gold shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-white/70">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mt-12 md:mt-0"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzLfRlxWuuRECMsGfc2-qsMwrPwy4MLpA7wQdGDr5B0bkCIEfxojc4l-qDpXhaY1PSZZtA3SPtdaJWrTK-ZrvCpVKZ_y3TVkmuf9urlO04Z4DltLoMead5sGCoH6VD-6s-z761yKqEwWbzh1dtx5uA6Z_Owt4qLfQtSnTTKH7GlbR2A-MHmFTROmPPMKsBgBmNYKgWPfELzca-ErgVKTOgnxEjOC0VgfHPDnGvhBu2EjglZKP4ymA2KsDCh63Vt-2VpzCd9zx0TVPc"
              alt="Student reading Quran in courtyard"
              className="w-full h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Stat Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute -bottom-8 -left-8 bg-white text-mihrab-green p-6 rounded-xl shadow-xl flex items-center gap-4"
          >
            <div className="bg-mihrab-cream p-3 rounded-full text-mihrab-gold">
              <Users size={32} />
            </div>
            <div>
              <p className="text-3xl font-bold font-serif">1000+</p>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Successful Students
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
