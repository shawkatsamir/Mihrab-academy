import Link from "next/link";
import { sanityClient } from "@/sanity/lib/client";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Metadata } from "next";

type HeroImage = {
  asset: { _ref: string; _type: string };
  alt?: string;
};

type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  readingTime?: number;
  heroImage?: HeroImage;
  category?: { title: string; color?: string; slug?: { current: string } };
  author?: { name: string };
};

export const metadata: Metadata = {
  title: "Blog | Mihrab Academy",
  description: "Islamic articles, lessons, and reflections from Mihrab Academy.",
};

export const revalidate = false;

export default async function BlogPage() {
  const posts = await sanityClient.fetch(ALL_POSTS_QUERY);

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts published yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(posts as BlogPost[]).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="group flex flex-col rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {post.heroImage?.asset && (
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor(post.heroImage).width(600).height(338).auto("format").url()}
                    alt={post.heroImage.alt ?? post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col flex-1 p-5 gap-2">
                {post.category && (
                  <span className="text-xs font-medium uppercase tracking-wide text-teal-600">
                    {post.category.title}
                  </span>
                )}

                <h2 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-teal-700 transition line-clamp-2">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  )}
                  {post.readingTime && (
                    <span>{post.readingTime} min read</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
