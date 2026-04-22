"use client";

import { useState, useRef } from "react";
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
import { createSupervisor } from "@/features/supervisors/actions/createSupervisor";
import {
  useUpdateSupervisor,
  type SupervisorWithProfile,
} from "@/features/supervisors/api/queries";
import {
  supervisorFormSchema,
  supervisorEditSchema,
  type SupervisorFormValues,
  type SupervisorEditValues,
} from "@/features/supervisors/schema";
import { Img } from "@/shared/ui/Image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supervisor: SupervisorWithProfile | null;
}

export function SupervisorFormModal({ open, onOpenChange, supervisor }: Props) {
  const isEdit = !!supervisor;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    supervisor?.profiles?.photo_url ?? null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateSupervisor();

  const form = useForm<SupervisorFormValues | SupervisorEditValues>({
    resolver: zodResolver(isEdit ? supervisorEditSchema : supervisorFormSchema),
    defaultValues: {
      full_name: supervisor?.profiles?.full_name ?? "",
      email: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: SupervisorFormValues | SupervisorEditValues) => {
    setError(null);
    setPending(true);

    try {
      if (isEdit && supervisor) {
        await updateMutation.mutateAsync({
          id: supervisor.id,
          values: {
            full_name: values.full_name,
          },
          imageFile: imageFile ?? undefined,
        });
      } else {
        const formData = new FormData();
        formData.append("full_name", values.full_name);
        formData.append("email", (values as SupervisorFormValues).email);
        if (imageFile) formData.append("image", imageFile);

        await createSupervisor(formData);
      }

      form.reset();
      setPreview(null);
      setImageFile(null);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Supervisor" : "Add Supervisor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 border">
                {preview ? (
                  <Img
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                    IMG
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? "Change" : "Upload"}
              </Button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              {...form.register("full_name")}
              placeholder="e.g. Yusuf M."
            />
            {form.formState.errors.full_name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email (create only) */}
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="supervisor@example.com"
              />
              {(form.formState.errors as any).email && (
                <p className="text-xs text-red-500">
                  {(form.formState.errors as any).email?.message}
                </p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
