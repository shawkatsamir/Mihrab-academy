import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mihrab-academy.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/protected/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
