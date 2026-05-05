import "./global.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";

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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
