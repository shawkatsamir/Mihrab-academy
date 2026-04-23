"use client";

import { useQuery } from "@tanstack/react-query";
import { subjectKeys } from "./keys";
import type { Tables } from "@/lib/supabase/database.types";
import {
  getSubjectOverviews,
  getSubjectDetail,
} from "@/features/subjects/actions/getSubjects";

export type SubjectOverview = Tables<"v_subject_overview">;

export type SubjectWithTree = Tables<"subjects"> & {
  milestones: Array<
    Tables<"milestones"> & {
      lessons: Array<
        Tables<"lessons"> & {
          lesson_content: Array<Tables<"lesson_content">>;
        }
      >;
    }
  >;
};

export function useSubjectOverviews() {
  return useQuery({
    queryKey: subjectKeys.overview(),
    queryFn: () => getSubjectOverviews() as Promise<SubjectOverview[]>,
  });
}

export function useSubjectDetail(id: string) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => getSubjectDetail(id) as Promise<SubjectWithTree>,
    enabled: !!id,
  });
}
