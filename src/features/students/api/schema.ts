import { z } from "zod";

export const studentFormSchema = z.object({
  full_name: z.string().min(2, "Name required"),
  parent_email: z.email("Valid email required"),
  date_of_birth: z.string().optional(),
  parent_whatsapp: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
