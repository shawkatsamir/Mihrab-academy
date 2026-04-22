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
import { type SupervisorWithProfile } from "@/features/supervisors/api/queries";
import { Img } from "@/shared/ui/Image";
import { useRouter } from "next/navigation";

interface Props {
  supervisors: SupervisorWithProfile[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (supervisor: SupervisorWithProfile) => void;
}

export function SupervisorsTable({
  supervisors,
  isLoading,
  isAdmin,
  onEdit,
}: Props) {
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
            <TableHead>Supervisor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supervisors.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-8"
              >
                No supervisors found.
              </TableCell>
            </TableRow>
          )}
          {supervisors.map((s) => {
            const isActive = s.profiles?.is_active ?? true;
            return (
              <TableRow
                key={s.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/supervisors/${s.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      {s.profiles?.photo_url ? (
                        <Img
                          src={s.profiles.photo_url}
                          alt={s.profiles.full_name ?? ""}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-500">
                          {s.profiles?.full_name?.charAt(0) ?? "S"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{s.profiles?.full_name}</p>
                    </div>
                  </div>
                </TableCell>
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
                <TableCell>
                  {s.profiles?.created_at
                    ? format(new Date(s.profiles.created_at), "MMM d, yyyy")
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
