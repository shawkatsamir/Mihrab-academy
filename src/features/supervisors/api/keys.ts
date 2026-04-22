export const supervisorKeys = {
  all: ["supervisors"] as const,
  list: () => [...supervisorKeys.all, "list"] as const,
  detail: (id: string) => [...supervisorKeys.all, "detail", id] as const,
};
