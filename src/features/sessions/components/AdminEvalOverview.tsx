"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { Eye, EyeOff, GraduationCap, ClipboardCheck, Star } from "lucide-react";
import { StarInput } from "@/features/sessions/components/StarInput";

interface Props {
  teacherEval?: any;
  supervisorEval?: any;
  parentRating?: any;
}

export function AdminEvalOverview({
  teacherEval,
  supervisorEval,
  parentRating,
}: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Evaluation Overview</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Teacher Report */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Teacher Report
              </CardTitle>
              {teacherEval?.is_visible_to_parent ? (
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Eye className="h-3 w-3" />
                  Public
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <EyeOff className="h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {teacherEval ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-3">
                  {(teacherEval.categories as any[])?.map((c: any) => (
                    <div key={c.category}>
                      <p className="text-xs text-muted-foreground">
                        {c.category}
                      </p>
                      <StarInput
                        value={c.score}
                        onChange={() => {}}
                        readOnly
                        size={14}
                      />
                    </div>
                  ))}
                </div>
                {teacherEval.notes_md && (
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {teacherEval.notes_md}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not submitted yet</p>
            )}
          </CardContent>
        </Card>

        {/* Supervisor Evaluation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Supervisor Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supervisorEval ? (
              <div className="space-y-2">
                <StarInput
                  value={supervisorEval.rating}
                  onChange={() => {}}
                  readOnly
                  size={16}
                />
                {supervisorEval.notes_md && (
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {supervisorEval.notes_md}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not submitted yet</p>
            )}
          </CardContent>
        </Card>

        {/* Parent Rating */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              Parent Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {parentRating ? (
              <div className="space-y-2 text-center">
                <div className="flex justify-center">
                  <StarInput
                    value={parentRating.rating}
                    onChange={() => {}}
                    readOnly
                    size={18}
                  />
                </div>
                <p className="text-lg font-bold">{parentRating.rating}.0 / 5.0</p>
                {parentRating.comment && (
                  <p className="text-xs text-muted-foreground italic line-clamp-3">
                    &ldquo;{parentRating.comment}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not submitted yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
