export const sessionKeys = {
  all: ["sessions"] as const,
  list: (range?: { start: string; end: string }) =>
    [...sessionKeys.all, "list", range] as const,
  detail: (id: string) => [...sessionKeys.all, "detail", id] as const,
  availableTeachers: (start: string, end: string) =>
    [...sessionKeys.all, "available-teachers", start, end] as const,
};
