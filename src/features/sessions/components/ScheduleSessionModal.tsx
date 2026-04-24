"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addMinutes } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";
import { Calendar } from "@/shared/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  useStudents,
  useStudentSubjects,
  useAvailableTeachers,
} from "@/features/sessions/api/queries";
import {
  useCreateSession,
  useCreateSeries,
} from "@/features/sessions/api/mutations";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    date: z.date({ required_error: "Select a date" }),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time"),
    duration_minutes: z.coerce.number().min(15).max(180).default(45),
    student_id: z.string().uuid("Select a student"),
    subject_id: z.string().uuid("Select a subject"),
    teacher_id: z.string().uuid("Select a teacher"),
    zoom_join_url: z.string().url().optional().or(z.literal("")),
    session_type: z.enum(["one_time", "recurring"]),
    recurrence_days: z.array(z.number()).optional(),
    end_date: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.session_type === "recurring") {
        return data.recurrence_days && data.recurrence_days.length > 0;
      }
      return true;
    },
    {
      message: "Select at least one day for recurring sessions",
      path: ["recurrence_days"],
    },
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: "admin" | "supervisor";
}

export function ScheduleSessionModal({ open, onOpenChange, role }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);

  const { data: students = [] } = useStudents();
  const createSession = useCreateSession();
  const createSeries = useCreateSeries();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      duration_minutes: 45,
      session_type: "one_time",
      recurrence_days: [],
    },
  });

  const watchDate = form.watch("date");
  const watchTime = form.watch("time");
  const watchDuration = form.watch("duration_minutes");
  const watchStudent = form.watch("student_id");
  const watchType = form.watch("session_type");

  const proposedStart = useMemo(() => {
    if (!watchDate || !watchTime) return null;
    const [hours, minutes] = watchTime.split(":").map(Number);
    const d = new Date(watchDate);
    d.setHours(hours, minutes, 0, 0);
    return d;
  }, [watchDate, watchTime]);

  const proposedEnd = useMemo(() => {
    if (!proposedStart) return null;
    return addMinutes(proposedStart, watchDuration);
  }, [proposedStart, watchDuration]);

  const { data: availableTeachers = [], isLoading: loadingTeachers } =
    useAvailableTeachers(proposedStart, proposedEnd);

  const { data: studentSubjects = [] } = useStudentSubjects(watchStudent);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const [hours, minutes] = values.time.split(":").map(Number);
      const start = new Date(values.date);
      start.setHours(hours, minutes, 0, 0);

      if (values.session_type === "recurring") {
        await createSeries.mutateAsync({
          teacher_id: values.teacher_id,
          student_id: values.student_id,
          subject_id: values.subject_id,
          recurrence_type: "custom",
          recurrence_days: values.recurrence_days ?? [],
          session_time: values.time + ":00",
          duration_minutes: values.duration_minutes,
          start_date: format(start, "yyyy-MM-dd"),
          end_date: values.end_date
            ? format(values.end_date, "yyyy-MM-dd")
            : undefined,
          zoom_join_url: values.zoom_join_url || undefined,
          timezone: "UTC", // TODO: make configurable
        });
      } else {
        await createSession.mutateAsync({
          session_type: "one_time",
          teacher_id: values.teacher_id,
          student_id: values.student_id,
          subject_id: values.subject_id,
          scheduled_at: start.toISOString(),
          duration_minutes: values.duration_minutes,
          zoom_join_url: values.zoom_join_url || undefined,
        });
      }

      form.reset();
      setStep(1);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message ?? "Failed to schedule");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Session</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: Date & Time */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              1. When
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchDate ? format(watchDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watchDate}
                      onSelect={(d) => {
                        form.setValue("date", d as Date);
                        form.setValue("teacher_id", ""); // reset teacher on date change
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.date && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <Input
                  id="time"
                  type="time"
                  {...form.register("time")}
                  onChange={(e) => {
                    form.setValue("time", e.target.value);
                    form.setValue("teacher_id", "");
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                step={5}
                min={15}
                max={180}
                {...form.register("duration_minutes")}
              />
            </div>
          </div>

          {/* Step 2: Student & Subject */}
          <div className="space-y-3 pt-2 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground">
              2. Who & What
            </h3>

            <div className="space-y-2">
              <Label>Student</Label>
              <Select
                value={watchStudent}
                onValueChange={(v) => {
                  form.setValue("student_id", v);
                  form.setValue("subject_id", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.profiles?.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.student_id && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.student_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                value={form.watch("subject_id")}
                onValueChange={(v) => form.setValue("subject_id", v)}
                disabled={!watchStudent || studentSubjects.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !watchStudent ? "Select student first" : "Select subject"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {studentSubjects.map((ss) => (
                    <SelectItem key={ss.subject_id} value={ss.subject_id}>
                      {ss.subjects?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.subject_id && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.subject_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Step 3: Teacher (availability-gated) */}
          <div className="space-y-3 pt-2 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground">
              3. Teacher
              {proposedStart && proposedEnd && (
                <span className="font-normal text-xs ml-2">
                  ({format(proposedStart, "h:mm a")} –{" "}
                  {format(proposedEnd, "h:mm a")})
                </span>
              )}
            </h3>

            {!proposedStart || !proposedEnd ? (
              <p className="text-sm text-muted-foreground">
                Choose date and time to see available teachers.
              </p>
            ) : loadingTeachers ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking availability...
              </div>
            ) : availableTeachers.length === 0 ? (
              <p className="text-sm text-red-500">
                No teachers available at this time. Try a different slot.
              </p>
            ) : (
              <div className="space-y-2">
                <Select
                  value={form.watch("teacher_id")}
                  onValueChange={(v) => form.setValue("teacher_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select available teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.profiles?.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.formState.errors.teacher_id && (
              <p className="text-xs text-red-500">
                {form.formState.errors.teacher_id.message}
              </p>
            )}
          </div>

          {/* Step 4: Zoom & Type */}
          <div className="space-y-3 pt-2 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground">
              4. Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="zoom">Zoom URL (optional)</Label>
              <Input
                id="zoom"
                placeholder="https://zoom.us/j/..."
                {...form.register("zoom_join_url")}
              />
            </div>

            <div className="space-y-2">
              <Label>Session Type</Label>
              <Select
                value={watchType}
                onValueChange={(v: "one_time" | "recurring") =>
                  form.setValue("session_type", v)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-time</SelectItem>
                  <SelectItem value="recurring">Recurring Series</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {watchType === "recurring" && (
              <div className="space-y-3 rounded-md border p-3">
                <div className="space-y-2">
                  <Label>Repeat on</Label>
                  <div className="flex gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day, idx) => (
                        <label
                          key={day}
                          className={cn(
                            "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-xs font-medium",
                            (form.watch("recurrence_days") ?? []).includes(idx)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted bg-background",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={(
                              form.watch("recurrence_days") ?? []
                            ).includes(idx)}
                            onChange={(e) => {
                              const current =
                                form.watch("recurrence_days") ?? [];
                              if (e.target.checked) {
                                form.setValue("recurrence_days", [
                                  ...current,
                                  idx,
                                ]);
                              } else {
                                form.setValue(
                                  "recurrence_days",
                                  current.filter((d) => d !== idx),
                                );
                              }
                            }}
                          />
                          {day[0]}
                        </label>
                      ),
                    )}
                  </div>
                  {form.formState.errors.recurrence_days && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.recurrence_days.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>End Date (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.watch("end_date") && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("end_date")
                          ? format(form.watch("end_date") as Date, "PPP")
                          : "No end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.watch("end_date")}
                        onSelect={(d) => form.setValue("end_date", d)}
                        disabled={(date) => date < (watchDate ?? new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setStep(1);
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createSession.isPending ||
                createSeries.isPending ||
                !proposedStart
              }
            >
              {createSession.isPending || createSeries.isPending
                ? "Scheduling..."
                : "Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
