import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/lib/client";
import { POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
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
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Hero image */}
        {post.heroImage?.asset && (
          <div className="mb-8 rounded-xl overflow-hidden aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(post.heroImage).width(1200).height(630).auto("format").url()}
              alt={post.heroImage.alt ?? post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Post header */}
        <header className="mb-8 border-b border-gray-100 pb-6">
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">
              {post.category.title}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {post.author?.name && (
              <span className="font-medium text-gray-700">{post.author.name}</span>
            )}
            {post.publishedAt && (
              <>
                {post.author?.name && <span>·</span>}
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
        </header>

        {/* Post body */}
        <article className="prose prose-gray prose-sm sm:prose-base lg:prose-lg prose-headings:font-semibold prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-teal-400 prose-blockquote:text-gray-600 prose-img:rounded-xl max-w-none">
          <PortableText value={post.body} components={portableTextComponents} />
        </article>
      </div>
    </div>
  );
}

export const revalidate = false; // Static — revalidated by webhook only
