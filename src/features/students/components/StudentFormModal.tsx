"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/Dialog";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import {
  useCreateStudent,
  useUpdateStudent,
} from "@/features/students/api/mutations";
import {
  studentFormSchema,
  type StudentFormValues,
} from "@/features/students/api/schema";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: any;
}

export function StudentFormModal({ open, onOpenChange, student }: Props) {
  const isEdit = !!student;
  const [error, setError] = useState<string | null>(null);

  const create = useCreateStudent();
  const update = useUpdateStudent();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      full_name: "",
      parent_email: "",
      date_of_birth: "",
      parent_whatsapp: "",
    },
  });

  useEffect(() => {
    const profiles = Array.isArray(student?.profiles)
      ? student.profiles[0]
      : student?.profiles;

    form.reset({
      full_name: profiles?.full_name ?? "",
      parent_email: "",
      date_of_birth: student?.date_of_birth ?? "",
      parent_whatsapp: student?.parent_whatsapp ?? "",
    });
  }, [student, form]);

  const onSubmit = async (values: StudentFormValues) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("parent_email", values.parent_email);
      formData.append("date_of_birth", values.date_of_birth ?? "");
      formData.append("parent_whatsapp", values.parent_whatsapp ?? "");

      if (isEdit && student) {
        formData.append("student_id", student.id);
        const profiles = Array.isArray(student?.profiles)
          ? student.profiles[0]
          : student?.profiles;
        formData.append("is_active", String(profiles?.is_active ?? true));
        await update.mutateAsync(formData);
      } else {
        await create.mutateAsync(formData);
      }

      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Student" : "Add Student"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Student Full Name</Label>
            <Input id="full_name" {...form.register("full_name")} />
            {form.formState.errors.full_name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.full_name.message}
              </p>
            )}
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="parent_email">Parent Email</Label>
              <Input
                id="parent_email"
                type="email"
                {...form.register("parent_email")}
                placeholder="parent@example.com"
              />
              {form.formState.errors.parent_email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.parent_email.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                An invitation link will be sent to this email.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" {...form.register("date_of_birth")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Parent WhatsApp</Label>
              <Input
                id="whatsapp"
                {...form.register("parent_whatsapp")}
                placeholder="+20 1xx xxx xxxx"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || update.isPending}
            >
              {create.isPending || update.isPending
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Add Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
