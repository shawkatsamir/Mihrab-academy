import { z } from "zod";

export const supervisorFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
});

export type SupervisorFormValues = z.infer<typeof supervisorFormSchema>;

export const supervisorEditSchema = supervisorFormSchema.omit({ email: true });
export type SupervisorEditValues = z.infer<typeof supervisorEditSchema>;
