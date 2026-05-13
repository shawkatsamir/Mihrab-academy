import { notFound } from "next/navigation";
import { programs, getProgramBySlug } from "@/shared/data/programs";
import ProgramPageClient from "./ProgramPageClient";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();
  return <ProgramPageClient program={program} />;
}
