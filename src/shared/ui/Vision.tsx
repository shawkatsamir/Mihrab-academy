"use client";
import { motion } from "motion/react";
import { Img } from "./Image";

export default function Vision() {
  return (
    <section id="about" className="py-24 bg-mihrab-cream relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative order-2 md:order-1"
        >
          <div className="absolute -inset-4 bg-mihrab-gold/10 rounded-2xl transform -rotate-3"></div>
          <Img
            src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80"
            alt="Person reading Quran"
            className="relative z-10 rounded-2xl shadow-xl w-full object-cover h-[400px]"
            referrerPolicy="no-referrer"
            width={1000}
            height={1000}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-1 md:order-2"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-mihrab-green mb-6">
            Vision
          </h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Mihrab is a comprehensive online learning platform that aims to
              teach the Holy Quran, Islam, and Arabic language skills.
            </p>
            <p>
              Experience a new and unique learning experience for your children
              online.
            </p>
            <p className="font-medium text-mihrab-green">
              Learn Quran, Islamic Studies, and Arabic online with trusted
              teachers.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
