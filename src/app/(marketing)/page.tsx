import BlogPreview from "@/shared/ui/BlogPreview";
import Contact from "@/shared/ui/Contact";
import Footer from "@/shared/ui/Footer";
import Hero from "@/shared/ui/Hero";
import Navbar from "@/shared/ui/Navbar";
import Programs from "@/shared/ui/Programs";
import Vision from "@/shared/ui/Vision";
import WhyChooseUs from "@/shared/ui/WhyChooseUs";
import { sanityClient } from "@/sanity/lib/client";
import { LATEST_POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type SanityPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  heroImage?: { asset: { _ref: string; _type: string }; alt?: string };
  category?: { title: string };
};

export default async function Page() {
  const rawPosts: SanityPost[] = await sanityClient.fetch(LATEST_POSTS_QUERY);

  const livePosts = rawPosts.map((p) => ({
    category: p.category?.title ?? "BLOG",
    title: p.title,
    description: p.excerpt ?? "",
    image: p.heroImage?.asset
      ? urlFor(p.heroImage).width(600).height(400).auto("format").url()
      : null,
    slug: p.slug.current,
  }));

  return (
    <div className="min-h-screen font-sans selection:bg-mihrab-gold/30 selection:text-mihrab-green overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Vision />
        <Programs />
        <WhyChooseUs />
        <BlogPreview livePosts={livePosts} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
