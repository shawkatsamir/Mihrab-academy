"use client";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-mihrab-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Contact Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-mihrab-green text-white p-12 md:w-2/5 relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full border border-white/10 -translate-x-1/4 translate-y-1/4"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-serif mb-4">Get in Touch</h2>
              <p className="text-white/80 mb-12">
                Have questions about our programs? Reach out to us and our
                admissions team will guide you.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-mihrab-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Call Us</p>
                    <a href="tel:+201553135708" className="font-medium">
                      +20 15 53135708
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-mihrab-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">WhatsApp</p>
                    <a
                      href="https://wa.me/201553135708"
                      className="font-medium"
                      target="_blank"
                      rel="noreferrer"
                    >
                      +20 15 53135708
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-mihrab-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="font-medium">salam@mihrabacademy.org</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-12 md:w-3/5"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Abdullah Muhammad"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mihrab-green focus:ring-1 focus:ring-mihrab-green outline-none transition-colors bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="abdullah@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mihrab-green focus:ring-1 focus:ring-mihrab-green outline-none transition-colors bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (234) 567-8900"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mihrab-green focus:ring-1 focus:ring-mihrab-green outline-none transition-colors bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mihrab-green focus:ring-1 focus:ring-mihrab-green outline-none transition-colors bg-gray-50/50 resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full bg-mihrab-green hover:bg-mihrab-green-light text-white font-semibold py-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
