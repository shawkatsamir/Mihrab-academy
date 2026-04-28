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
import { Textarea } from "@/shared/ui/Textarea";
import { createTeacher } from "@/features//teachers/actions/createTeacher";
import {
  useUpdateTeacher,
  type TeacherWithProfile,
} from "@/features/teachers/api/queries";
import {
  teacherFormSchema,
  teacherEditSchema,
  type TeacherFormValues,
  type TeacherEditValues,
} from "@/features/teachers/schema";
import { Img } from "@/shared/ui/Image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: TeacherWithProfile | null;
}

export function TeacherFormModal({ open, onOpenChange, teacher }: Props) {
  const isEdit = !!teacher;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    teacher?.profiles?.photo_url ?? null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateTeacher();

  const form = useForm<TeacherFormValues | TeacherEditValues>({
    resolver: zodResolver(isEdit ? teacherEditSchema : teacherFormSchema),
    defaultValues: {
      full_name: teacher?.profiles?.full_name ?? "",
      email: "", // never pre-fill email for edit
      price_per_hour: teacher?.price_per_hour ?? 0,
      bio: teacher?.bio ?? "",
      zoom_personal_link: teacher?.zoom_personal_link ?? "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: TeacherFormValues | TeacherEditValues) => {
    setError(null);
    setPending(true);

    try {
      if (isEdit && teacher) {
        await updateMutation.mutateAsync({
          id: teacher.id,
          values: {
            full_name: values.full_name,
            bio: (values as TeacherEditValues).bio,
            price_per_hour: values.price_per_hour,
            zoom_personal_link: values.zoom_personal_link,
          },
          imageFile: imageFile ?? undefined,
        });
      } else {
        const formData = new FormData();
        formData.append("full_name", values.full_name);
        formData.append("email", (values as TeacherFormValues).email);
        formData.append("price_per_hour", String(values.price_per_hour));
        if (values.bio) formData.append("bio", values.bio);
        if (values.zoom_personal_link)
          formData.append("zoom_personal_link", values.zoom_personal_link);
        if (imageFile) formData.append("image", imageFile);

        await createTeacher(formData);
      }

      form.reset();
      setPreview(null);
      setImageFile(null);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
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
              placeholder="e.g. Ahmad Hassan"
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
                placeholder="teacher@example.com"
              />
              {(form.formState.errors as Record<string, { message?: string }>)
                .email && (
                <p className="text-xs text-red-500">
                  {
                    (
                      form.formState.errors as Record<
                        string,
                        { message?: string }
                      >
                    ).email?.message
                  }
                </p>
              )}
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price_per_hour">Price / Hour</Label>
            <Input
              id="price_per_hour"
              type="number"
              min={0}
              {...form.register("price_per_hour", {
                valueAsNumber: true,
                min: { value: 0, message: "Price cannot be negative" },
              })}
              placeholder="2500"
            />
            <p className="text-xs text-muted-foreground">
              Enter amount in cents (e.g. 2500 = $25.00)
            </p>
            {form.formState.errors.price_per_hour && (
              <p className="text-xs text-red-500">
                {form.formState.errors.price_per_hour.message}
              </p>
            )}
          </div>

          {/* Zoom URL */}
          <div className="space-y-2">
            <Label htmlFor="zoom_personal_link">Zoom Personal Link</Label>
            <Input
              id="zoom_personal_link"
              type="url"
              {...form.register("zoom_personal_link")}
              placeholder="https://zoom.us/j/..."
            />
            {(form.formState.errors as Record<string, { message?: string }>)
              .zoom_personal_link && (
              <p className="text-xs text-red-500">
                {
                  (
                    form.formState.errors as Record<
                      string,
                      { message?: string }
                    >
                  ).zoom_personal_link?.message
                }
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder="Short bio..."
              rows={3}
            />
          </div>

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
