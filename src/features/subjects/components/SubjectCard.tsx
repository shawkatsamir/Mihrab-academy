"use client";

import Link from "next/link";
import { Badge } from "@/shared/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { BookOpen, Layers, FileText } from "lucide-react";
import type { SubjectOverview } from "@/features/subjects/api/queries";

interface Props {
  subject: SubjectOverview;
  isAdmin: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  quran: "bg-emerald-100 text-emerald-800",
  arabic: "bg-blue-100 text-blue-800",
  islamic_studies: "bg-amber-100 text-amber-800",
};

export function SubjectCard({ subject, isAdmin }: Props) {
  return (
    <Link href={`/subjects/${subject.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">
              {subject.name}
            </CardTitle>
            {subject.category && (
              <Badge
                variant="secondary"
                className={CATEGORY_COLORS[subject.category] ?? ""}
              >
                {subject.category}
              </Badge>
            )}
          </div>
          {subject.estimated_sessions && (
            <p className="text-xs text-muted-foreground">
              ~{subject.estimated_sessions} sessions
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {subject.overview_md ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {subject.overview_md}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No description
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              <span>{subject.milestone_count ?? 0} milestones</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{subject.lesson_count ?? 0} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span>{subject.content_item_count ?? 0} items</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
