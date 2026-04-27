export const teacherKeys = {
  all: ["teachers"] as const,
  list: () => [...teacherKeys.all, "list"] as const,
  detail: (id: string) => [...teacherKeys.all, "detail", id] as const,
  sessions: (id: string, range?: { start: string; end: string }) =>
    [...teacherKeys.all, "sessions", id, range] as const,
};
