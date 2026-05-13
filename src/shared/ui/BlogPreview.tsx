"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Img } from "./Image";

type LivePost = {
  category: string;
  title: string;
  description: string;
  image: string | null;
  slug: string;
};

const mockArticles = [
  {
    category: "SEERAH",
    title: "The Life of the Prophet",
    description:
      "Explore the pivotal moments and spiritual lessons from the life of the Prophet Muhammad (PBUH) in this engaging new series.",
    image:
      "https://images.unsplash.com/photo-1580692475446-c2fbaea51b0d?auto=format&fit=crop&q=80",
    href: "#",
  },
  {
    category: "HADITH",
    title: "Understanding Prophetic Wisdom",
    description:
      "Delve into the profound wisdom of the Hadith and discover practical guidance for contemporary living.",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaab315d?auto=format&fit=crop&q=80",
    href: "#",
  },
  {
    category: "PARENTING",
    title: "Nurturing Young Hearts",
    description:
      "Learn effective parenting techniques grounded in Islamic principles to raise compassionate and knowledgeable children.",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80",
    href: "#",
  },
];

export default function BlogPreview({ livePosts = [] }: { livePosts?: LivePost[] }) {
  const articles = mockArticles.map((mock, i) => {
    const live = livePosts[i];
    if (!live) return mock;
    return {
      category: live.category,
      title: live.title,
      description: live.description,
      image: live.image ?? mock.image,
      href: `/blog/${live.slug}`,
    };
  });
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
              <div className="relative h-40 overflow-hidden">
                <Img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  fill
                />
                <div className="absolute top-3 left-3 bg-mihrab-gold text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                  {article.category}
                </div>
              </div>
              <div className="p-5 flex flex-col grow">
                <h3 className="text-base font-serif font-semibold text-mihrab-green mb-2 line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 grow line-clamp-2">
                  {article.description}
                </p>
                <Link
                  href={article.href}
                  className="inline-flex items-center text-mihrab-gold font-medium hover:text-mihrab-gold-light transition-colors group"
                >
                  Read More{" "}
                  <ChevronRight
                    size={18}
                    className="ml-1 transform group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
