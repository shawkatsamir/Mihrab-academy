import { z } from "zod";

export const teacherFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  price_per_hour: z
    .number()
    .min(0, "Price cannot be negative")
    .int("Price must be a whole number (cents)"),
  bio: z.string().max(500, "Bio too long").optional(),
  zoom_personal_link: z.string().url("Please enter a valid Zoom personal link URL"),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;

export const teacherEditSchema = teacherFormSchema.omit({ email: true });
export type TeacherEditValues = z.infer<typeof teacherEditSchema>;
