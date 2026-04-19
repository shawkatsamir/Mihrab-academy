"use client";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Img } from "./Image";

export default function Hero() {
  return (
    <section className="relative bg-mihrab-green min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Pattern Overlay (Simulated with CSS gradient/opacity) */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mihrab-gold to-transparent"></div>

      {/* Islamic Geometric Pattern Placeholder */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/arabesque.png")',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-6">
            Learn Qur&apos;an with{" "}
            <span className="text-mihrab-gold block mt-2">Proper Guidance</span>
          </h1>
          <p className="text-mihrab-gold font-serif text-xl md:text-2xl mb-8 tracking-widest uppercase">
            Mihrab Academy
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button className="w-full sm:w-auto bg-mihrab-gold hover:bg-mihrab-gold-light text-mihrab-green font-semibold px-8 py-3 rounded-full transition-colors flex items-center justify-center gap-2">
              Explore Courses <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto bg-transparent border border-white/30 hover:border-white text-white font-semibold px-8 py-3 rounded-full transition-colors">
              Start Learning
            </button>
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative hidden md:block"
        >
          {/* Decorative Arch Background */}
          <div className="absolute inset-0 bg-mihrab-gold/20 rounded-t-[150px] transform translate-x-4 translate-y-4"></div>
          <Img
            src="https://images.unsplash.com/photo-1711202675885-d0a0ce63b5bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Student reading Quran in a mosque"
            className="relative z-10 rounded-t-[150px] rounded-b-xl w-full object-cover h-[500px] shadow-2xl"
            referrerPolicy="no-referrer"
            width={1000}
            height={1000}
          />
        </motion.div>
      </div>

      {/* Bottom Curve Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-mihrab-cream rounded-t-[50%] scale-x-110 translate-y-1/2"></div>
    </section>
  );
}
