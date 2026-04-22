import "./global.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn("font-sans", geist.variable)}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
