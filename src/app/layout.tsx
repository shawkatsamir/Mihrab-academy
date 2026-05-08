import { Metadata } from "next";
import "./global.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import { SupabaseHashHandler } from "@/components/supabase-hash-handler";

export const metadata: Metadata = {
  title: {
    default: "Mihrab Academy | Online Islamic Learning",
    template: "%s | Mihrab Academy",
  },
  description: "Mihrab Academy offers comprehensive Islamic courses, Quran studies, and structured learning paths for students of all levels.",
  keywords: ["Islamic academy", "Quran learning", "Islamic courses", "online Islamic school"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mihrab-academy.com",
    title: "Mihrab Academy | Online Islamic Learning",
    description: "Comprehensive Islamic courses, Quran studies, and structured learning paths.",
    siteName: "Mihrab Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mihrab Academy",
    description: "Online Islamic Learning Platform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn("font-sans", geist.variable)}>
      <body>
        <Analytics />
        <SupabaseHashHandler />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
