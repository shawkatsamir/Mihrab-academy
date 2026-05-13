"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Eye,
  Target,
  BookOpen,
  Globe,
  Heart,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/shared/ui/Navbar";
import Footer from "@/shared/ui/Footer";

const values = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Authentic Scholarship",
    description:
      "Every lesson is grounded in traditional Islamic scholarship. Our teachers hold ijazas and have studied under recognised scholars — ensuring the knowledge passed to your family is genuine and sound.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Personal Connection",
    description:
      "We reject the one-size-fits-all model. Each student is paired with a teacher who understands their pace, learning style, and goals — building a relationship that goes beyond the screen.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Accessible to All",
    description:
      "Whether you're in London, Toronto, or Sydney, Mihrab brings qualified Islamic education directly to your home. No travel, no barriers — just consistent, structured learning wherever you are.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Uncompromising Excellence",
    description:
      "From teacher vetting to lesson structure and progress tracking, we hold every part of the experience to the highest standard — because your child's Islamic foundation deserves nothing less.",
  },
];

const stats = [
  { value: "500+", label: "Students Enrolled" },
  { value: "30+", label: "Expert Scholars" },
  { value: "20+", label: "Countries Reached" },
  { value: "98%", label: "Parent Satisfaction" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.65, delay },
});

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans bg-mihrab-cream overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-mihrab-green pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mihrab-gold/10 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 text-white/50 text-sm mb-8">
            <Link href="/" className="hover:text-mihrab-gold transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-mihrab-gold">About Us</span>
          </motion.div>

          <motion.p {...fadeUp(0.1)} className="text-mihrab-gold font-serif tracking-widest uppercase text-sm mb-4">
            Our Story
          </motion.p>
          <motion.h1 {...fadeUp(0.2)} className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
            Where Tradition Meets{" "}
            <span className="text-mihrab-gold block mt-2">Modern Learning</span>
          </motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Mihrab Academy was founded on one conviction — that every Muslim family, wherever they are in the world, deserves access to authentic, structured Islamic education.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0)} className="relative order-2 md:order-1">
            <div className="absolute -inset-4 bg-mihrab-gold/10 rounded-2xl -rotate-2" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=900&q=80"
              alt="Student learning Quran online"
              className="relative z-10 rounded-2xl shadow-xl w-full h-[420px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-5 -right-5 z-20 bg-mihrab-green text-white px-5 py-3 rounded-xl shadow-lg">
              <p className="text-xs text-mihrab-gold uppercase tracking-widest mb-0.5">Founded on</p>
              <p className="font-serif text-lg leading-tight">Authentic Scholarship</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="order-1 md:order-2 space-y-6">
            <p className="text-mihrab-gold font-medium uppercase tracking-widest text-sm">About the Platform</p>
            <h2 className="text-4xl md:text-5xl font-serif text-mihrab-green leading-tight">
              Built on a Simple Belief
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                We started Mihrab Academy because we saw a growing need — Muslim families in the West searching for qualified scholars to teach their children, but struggling to find consistent, trustworthy, and engaging online education.
              </p>
              <p>
                The word <em className="text-mihrab-green font-medium">mihrab</em> refers to the prayer niche — the sacred focal point of a mosque, the direction a student faces their teacher. It embodies everything we stand for: intentionality, reverence, and connection to the divine through knowledge.
              </p>
              <p>
                Our platform connects students of all ages with certified, native Arabic-speaking scholars who bring the traditional method of learning — at the feet of a real teacher — directly into your home.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-mihrab-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <p className="text-mihrab-gold font-medium uppercase tracking-widest text-sm mb-3">What Drives Us</p>
            <h2 className="text-4xl md:text-5xl font-serif text-mihrab-green">Vision &amp; Mission</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
              <div className="w-14 h-14 rounded-full bg-mihrab-green/10 flex items-center justify-center">
                <Eye className="w-7 h-7 text-mihrab-green" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-mihrab-green mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become the most trusted global platform for Islamic education — a place where every Muslim family can find qualified scholars, proven methodology, and a genuine spiritual learning environment, regardless of where they live.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <p className="text-mihrab-green font-medium text-sm italic">
                  "We strive to provide the best possible Quranic and Arabic education to students all around the world — from children as young as four to adult learners."
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="bg-mihrab-green rounded-2xl p-8 shadow-sm flex flex-col gap-6">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                <Target className="w-7 h-7 text-mihrab-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-white mb-3">Our Mission</h3>
                <p className="text-white/80 leading-relaxed">
                  To deliver structured, personalised, and spiritually enriching education in Quran recitation, Arabic language, and Islamic sciences — taught by qualified scholars with integrity, care, and a deep commitment to the students they serve.
                </p>
              </div>
              <div className="border-t border-white/10 pt-5">
                <p className="text-mihrab-gold font-medium text-sm italic">
                  "With Mihrab Academy, we bring a positive, stimulating learning experience for all levels — helping every student build self-respect, motivation, and a lifelong love of knowledge."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <p className="text-mihrab-gold font-medium uppercase tracking-widest text-sm mb-3">What We Stand For</p>
            <h2 className="text-4xl md:text-5xl font-serif text-mihrab-green">Our Core Values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp(i * 0.08)}
                className="group bg-mihrab-cream hover:bg-mihrab-green rounded-2xl p-7 transition-colors duration-300 flex flex-col gap-4"
              >
                <div className="w-11 h-11 rounded-full bg-mihrab-gold/20 group-hover:bg-white/10 flex items-center justify-center text-mihrab-green group-hover:text-mihrab-gold transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="font-serif text-lg text-mihrab-green group-hover:text-white transition-colors duration-300">
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed transition-colors duration-300">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-mihrab-green relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }}
        />
        <div className="relative max-w-5xl mx-auto px-6 md:px-12">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="text-mihrab-gold font-medium uppercase tracking-widest text-sm mb-3">Our Growing Community</p>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Mihrab by the Numbers</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
                <p className="text-4xl md:text-5xl font-serif text-mihrab-gold mb-2">{s.value}</p>
                <p className="text-white/60 text-sm uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-mihrab-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <motion.div {...fadeUp(0)} className="space-y-6">
            <p className="text-mihrab-gold font-medium uppercase tracking-widest text-sm">Begin the Journey</p>
            <h2 className="text-4xl md:text-5xl font-serif text-mihrab-green leading-tight">
              Ready to Give Your Child an Authentic Islamic Education?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Book a free trial lesson today — no commitment, no pressure. Just a real teacher, a real student, and the beginning of something meaningful.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="https://wa.me/201553135708?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20trial%20lesson%20at%20Mihrab%20Academy."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-mihrab-green hover:bg-mihrab-green-light text-white font-semibold px-8 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Book a Free Trial
              </a>
              <Link
                href="/#courses"
                className="w-full sm:w-auto border border-mihrab-green text-mihrab-green hover:bg-mihrab-green hover:text-white font-semibold px-8 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                View Our Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
