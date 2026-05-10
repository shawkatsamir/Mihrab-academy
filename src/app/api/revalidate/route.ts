import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

type WebhookBody = {
  _type?: string;
  slug?: { current?: string };
};

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  let body: WebhookBody = {};
  try {
    body = await request.json();
  } catch {
    // empty body — fall back to full revalidation
  }

  const slug = body.slug?.current;

  // Always revalidate the index
  revalidatePath("/blog");

  if (body._type === "post" && slug) {
    // Targeted revalidation — only the changed post
    revalidatePath(`/blog/${slug}`);
  } else {
    // Fallback: author/category changed — revalidate all post pages
    revalidatePath("/blog/[slug]", "page");
  }

  return Response.json({ revalidated: true, slug: slug ?? "all", at: new Date().toISOString() });
}
