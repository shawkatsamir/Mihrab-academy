"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/Select";
import {
  useCreateSubject,
  useUpdateSubject,
} from "@/features/subjects/api/mutations";
import type { Tables } from "@/lib/supabase/database.types";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  category: z.enum(["quran", "arabic", "islamic_studies"]),
  description: z.string().optional(),
  overview_md: z.string().optional(),
  estimated_sessions: z.coerce.number().min(1).optional(),
  sort_order: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Tables<"subjects">;
}

export function SubjectFormModal({ open, onOpenChange, subject }: Props) {
  const isEdit = !!subject;
  const [error, setError] = useState<string | null>(null);

  const create = useCreateSubject();
  const update = useUpdateSubject();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: subject?.name ?? "",
      category: (subject?.category as FormValues["category"]) ?? "quran",
      description: subject?.description ?? "",
      overview_md: subject?.overview_md ?? "",
      estimated_sessions: subject?.estimated_sessions ?? undefined,
      sort_order: subject?.sort_order ?? 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      if (isEdit && subject) {
        await update.mutateAsync({
          id: subject.id,
          values: {
            ...values,
            description: values.description || null,
            overview_md: values.overview_md || null,
            estimated_sessions: values.estimated_sessions || null,
          },
        });
      } else {
        await create.mutateAsync({
          ...values,
          description: values.description || null,
          overview_md: values.overview_md || null,
          estimated_sessions: values.estimated_sessions || null,
        });
      }
      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Subject" : "New Subject"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(v) =>
                form.setValue("category", v as FormValues["category"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quran">Quran</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
                <SelectItem value="islamic_studies">Islamic Studies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview_md">Overview (Markdown)</Label>
            <Textarea
              id="overview_md"
              {...form.register("overview_md")}
              rows={3}
              placeholder="Detailed overview..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_sessions">Estimated Sessions</Label>
              <Input
                id="estimated_sessions"
                type="number"
                {...form.register("estimated_sessions")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                {...form.register("sort_order")}
              />
            </div>
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
            <Button
              type="submit"
              disabled={create.isPending || update.isPending}
            >
              {create.isPending || update.isPending
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Subject"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
