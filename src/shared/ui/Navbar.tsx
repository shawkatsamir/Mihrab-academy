"use client";

import { useState } from "react";

import { Menu, X } from "lucide-react";
import { motion } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-50 px-6 py-4 md:px-12"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-mihrab-gold font-serif text-2xl font-bold tracking-wider">
            MIHRAB ACADEMY
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 lg:gap-8 text-white/90 font-medium whitespace-nowrap">
          <a href="#" className="hover:text-mihrab-gold transition-colors">
            Home
          </a>
          <a
            href="#courses"
            className="hover:text-mihrab-gold transition-colors"
          >
            Courses
          </a>
          <a href="#about" className="hover:text-mihrab-gold transition-colors">
            About Us
          </a>
          <a
            href="#teachers"
            className="hover:text-mihrab-gold transition-colors"
          >
            Teachers
          </a>
          <a
            href="#contact"
            className="hover:text-mihrab-gold transition-colors"
          >
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block shrink-0 ml-4">
          <button className="bg-mihrab-gold hover:bg-mihrab-gold-light text-mihrab-green font-semibold px-6 py-2 rounded-full transition-colors">
            Start Learning
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white ml-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-mihrab-green border-t border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          <a
            href="#"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-mihrab-gold px-4 py-2"
          >
            Home
          </a>
          <a
            href="#courses"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-mihrab-gold px-4 py-2"
          >
            Courses
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-mihrab-gold px-4 py-2"
          >
            About Us
          </a>
          <a
            href="#teachers"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-mihrab-gold px-4 py-2"
          >
            Teachers
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-mihrab-gold px-4 py-2"
          >
            Contact
          </a>
          <button className="bg-mihrab-gold text-mihrab-green font-semibold px-6 py-2 rounded-full mt-2 w-full">
            Start Learning
          </button>
        </div>
      )}
    </motion.nav>
  );
}
