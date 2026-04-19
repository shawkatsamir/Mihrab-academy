"use client";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="bg-mihrab-green text-white pt-20 pb-10 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/arabesque.png")',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-12 gap-12 mb-16"
        >
          {/* Brand & Quote */}
          <div className="md:col-span-5">
            <span className="text-mihrab-gold font-serif text-3xl font-bold tracking-wider block mb-6">
              MIHRAB ACADEMY
            </span>
            <p className="text-white/80 leading-relaxed mb-8 pr-8">
              Dedicated to spreading the authentic knowledge of the Quran and
              Sunnah, nurturing the next generation of mindful Muslims.
            </p>

            <div className="border border-mihrab-gold/30 rounded-xl p-6 bg-white/5">
              <p className="font-serif italic text-mihrab-gold mb-2">
                &quot;And We have certainly made the Qur&apos;an easy for
                remembrance, so is there any who will remember?&quot;
              </p>
              <p className="text-white/60 text-sm text-right">
                — Surah Al-Qamar [54:17]
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-mihrab-gold font-semibold tracking-wider mb-6 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-mihrab-gold transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="text-white/80 hover:text-mihrab-gold transition-colors"
                >
                  Our Programs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-mihrab-gold transition-colors"
                >
                  Admissions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-mihrab-gold transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h4 className="text-mihrab-gold font-semibold tracking-wider mb-6 uppercase">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-mihrab-gold transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-mihrab-gold transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-mihrab-gold transition-colors"
                >
                  Student Portal
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Mihrab Academy. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-mihrab-gold hover:text-white transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-mihrab-gold hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-mihrab-gold hover:text-white transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-mihrab-gold hover:text-white transition-colors"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
