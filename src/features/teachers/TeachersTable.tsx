"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/Table";
import { Badge } from "@/shared/ui/Badge";
import { Skeleton } from "@/shared/ui/Skeleton";
import {
  type TeacherWithProfile,
  getSupervisorName,
} from "@/features/teachers/api/queries";
import { Img } from "@/shared/ui/Image";
import { useRouter } from "next/navigation";

interface Props {
  teachers: TeacherWithProfile[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (teacher: TeacherWithProfile) => void;
}

export function TeachersTable({ teachers, isLoading, isAdmin, onEdit }: Props) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price / Session</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-8"
              >
                No teachers found.
              </TableCell>
            </TableRow>
          )}
          {teachers.map((t) => {
            const isActive = t.profiles?.is_active ?? true;
            const supervisorName = getSupervisorName(t);

            return (
              <TableRow
                key={t.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/teachers/${t.id}`)}
              >
                {/* Teacher name + avatar */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      {t.profiles?.photo_url ? (
                        <Img
                          src={t.profiles.photo_url}
                          alt={t.profiles.full_name ?? ""}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
                          {t.profiles?.full_name?.charAt(0) ?? "T"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{t.profiles?.full_name}</p>
                      {t.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                          {t.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Supervisor */}
                <TableCell>
                  {supervisorName ? (
                    <span className="text-sm text-[#1A2B4C] font-medium">
                      {supervisorName}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Unassigned
                    </span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {isActive ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-600 hover:bg-gray-100"
                    >
                      Inactive
                    </Badge>
                  )}
                </TableCell>

                {/* Price */}
                <TableCell>
                  {t.price_per_session
                    ? `$${t.price_per_session.toFixed(2)}`
                    : "—"}
                </TableCell>

                {/* Joined */}
                <TableCell>
                  {t.profiles?.created_at
                    ? format(new Date(t.profiles.created_at), "MMM d, yyyy")
                    : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
