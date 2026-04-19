import BlogPreview from "@/shared/ui/BlogPreview";
import Contact from "@/shared/ui/Contact";
import Footer from "@/shared/ui/Footer";
import Hero from "@/shared/ui/Hero";
import Navbar from "@/shared/ui/Navbar";
import Programs from "@/shared/ui/Programs";
import Vision from "@/shared/ui/Vision";
import WhyChooseUs from "@/shared/ui/WhyChooseUs";

export default function Page() {
  return (
    <div className="min-h-screen font-sans selection:bg-mihrab-gold/30 selection:text-mihrab-green overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Vision />
        <Programs />
        <WhyChooseUs />
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
