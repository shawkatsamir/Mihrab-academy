"use client";

import { Badge } from "@/shared/ui/Badge";
import type { SessionDetailRow } from "@/features/sessions/api/queries";

const STYLES: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  live: "bg-green-100 text-green-800 hover:bg-green-100",
  completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
  no_show: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  shifted: "bg-purple-100 text-purple-800 hover:bg-purple-100",
};

export function SessionStatusBadge({
  status,
}: {
  status: SessionDetailRow["status"];
}) {
  return (
    <Badge variant="secondary" className={STYLES[status ?? "scheduled"]}>
      {status}
    </Badge>
  );
}
