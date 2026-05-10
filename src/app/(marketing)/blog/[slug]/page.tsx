import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/lib/client";
import { POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/sanity/components/PortableTextComponents";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all published posts at build time
export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient.fetch(
    `*[_type == "post" && !seo.noIndex]{ "slug": slug.current }`,
  );
  return slugs.map((s) => ({ slug: s.slug }));
}

// Dynamic metadata per post (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) return {};

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    keywords: post.seo?.keywords ?? [],
    openGraph: {
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.heroImage?.asset?.url ?? "" }],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) notFound();

  return (
    <article className="prose prose-gray prose-lg max-w-3xl mx-auto px-4 py-10 prose-headings:font-semibold prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-teal-400 prose-blockquote:text-gray-600">
      <h1>{post.title}</h1>
      <PortableText value={post.body} components={portableTextComponents} />
    </article>
  );
}

export const revalidate = false; // Static — revalidated by webhook only
