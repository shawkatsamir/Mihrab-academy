"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const articles = [
  {
    category: "SEERAH",
    title: "The Life of the Prophet",
    description:
      "Explore the pivotal moments and spiritual lessons from the life of the Prophet Muhammad (PBUH) in this engaging new series.",
    image:
      "https://images.unsplash.com/photo-1580692475446-c2fbaea51b0d?auto=format&fit=crop&q=80",
  },
  {
    category: "HADITH",
    title: "Understanding Prophetic Wisdom",
    description:
      "Delve into the profound wisdom of the Hadith and discover practical guidance for contemporary living.",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaab315d?auto=format&fit=crop&q=80",
  },
  {
    category: "PARENTING",
    title: "Nurturing Young Hearts",
    description:
      "Learn effective parenting techniques grounded in Islamic principles to raise compassionate and knowledgeable children.",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80",
  },
];

export default function BlogPreview() {
  return (
    <section className="py-24 bg-mihrab-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-mihrab-green mb-4">
            Knowledge & Inspiration
          </h2>
          <p className="text-gray-600 text-lg">
            Deepen your understanding with our latest insights on Seerah,
            Hadith, and Islamic life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-mihrab-gold text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {article.category}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif text-mihrab-green mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {article.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-mihrab-gold font-medium hover:text-mihrab-gold-light transition-colors group"
                >
                  Read More{" "}
                  <ChevronRight
                    size={18}
                    className="ml-1 transform group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
