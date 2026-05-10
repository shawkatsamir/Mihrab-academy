import { groq } from "next-sanity";

// Blog index — all published posts
export const ALL_POSTS_QUERY = groq`
  *[_type == "post" && !seo.noIndex] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readingTime,
    heroImage { asset->, alt },
    category->{ title, color, slug },
    author->{ name, photo }
  }
`;

// Single post by slug
export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readingTime,
    heroImage { asset->, alt, caption },
    category->{ title, color, slug },
    author->{ name, photo, role, bio },
    body[]{
      ...,
      // Dereference image assets so urlFor() works client-side
      _type == "image" => { ..., asset-> },
      // Resolve internal link references in rich text
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "slug": reference->slug.current
        }
      }
    },
    seo,
    tags,
    relatedPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      heroImage { asset->, alt },
      category->{ title, color }
    }
  }
`;

// Featured posts for homepage hero
export const FEATURED_POSTS_QUERY = groq`
  *[_type == "post" && isFeatured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    heroImage { asset->, alt },
    category->{ title, color }
  }
`;

// Posts by category
export const POSTS_BY_CATEGORY_QUERY = groq`
  *[_type == "post" && category->slug.current == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readingTime,
    heroImage { asset->, alt },
    category->{ title, color }
  }
`;
