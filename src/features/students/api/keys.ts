export const studentKeys = {
  all: ["students"] as const,
  list: () => [...studentKeys.all, "list"] as const,
  detail: (id: string) => [...studentKeys.all, "detail", id] as const,
};
