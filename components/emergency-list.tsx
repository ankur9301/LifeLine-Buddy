"use client";

import { useMemo } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Emergency } from "@/types/emergency";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface EmergencyListProps {
  emergencies: Emergency[];
  activeEmergency: Emergency | null;
  setActiveEmergency: (emergency: Emergency | null) => void;
  dispatchedStatus: Record<string, string[]>;
}

// Helper function to format the time
function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function EmergencyList({
  emergencies,
  activeEmergency,
  setActiveEmergency,
  dispatchedStatus,
}: EmergencyListProps) {
  // Sorted by severity (higher first) and then by oldest case first.
  const sortedEmergencies = useMemo(() => {
    // Define severity priority: Higher number means higher priority.
    const severityPriority: Record<string, number> = {
      CRITICAL: 3,
      URGENT: 2,
      STANDARD: 1,
    };

    return emergencies.slice().sort((a, b) => {
      const aPriority = severityPriority[a.severity] ?? 0;
      const bPriority = severityPriority[b.severity] ?? 0;

      // If severities are different, order by severity (descending)
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // Otherwise, sort by time (oldest first)
      const aTime = new Date(a.time).getTime();
      const bTime = new Date(b.time).getTime();
      return aTime - bTime;
    });
  }, [emergencies]);

  // Assuming dispatchedStatus is an object that maps emergency IDs to their dispatch status
  // const dispatchedStatus: Record<string, any> = {}; // Replace with actual data or import



  return (
    <div className="space-y-2">
      {sortedEmergencies.map((emergency) => (
        <motion.div
          key={emergency.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "cursor-pointer rounded-md border p-2 sm:p-3 transition-all hover:bg-muted/50 hover:shadow-md",
            activeEmergency?.id === emergency.id &&
              "border-blue-600 bg-muted/50"
          )}
          onClick={() => {
            // Toggle selection: if already active, deselect; otherwise select.
            if (activeEmergency?.id === emergency.id) {
              setActiveEmergency(null);
            } else {
              setActiveEmergency(emergency);
            }
          }}
        >
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <AlertCircle
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4",
                  emergency.severity === "CRITICAL"
                    ? "text-destructive"
                    : "text-yellow-500"
                )}
              />
              <span className="text-xs sm:text-sm font-medium">
                {emergency.type}
              </span>
            </div>
            {/* <Badge
  variant={
    emergency.severity === "CRITICAL" ? "destructive" : "outline"
  }
  className={cn(
    "text-xs",
    emergency.severity !== "CRITICAL" && "border-yellow-500 text-yellow-500",
    dispatchedStatus[emergency.id]?.length > 0 && "bg-green-600 text-white border-none"
  )}
>
  {dispatchedStatus[emergency.id]?.length > 0 ? "Solved" : emergency.severity}
</Badge> */}
          <Badge
            variant={
              dispatchedStatus[emergency.id]?.includes("Transfer")
                ? "outline"
                : emergency.severity === "CRITICAL"
                ? "destructive"
                : "outline"
            }
            className={cn(
              "text-xs",
              dispatchedStatus[emergency.id]?.includes("Transfer") &&
                "border-blue-600 text-blue-600",
              dispatchedStatus[emergency.id]?.some((s) =>
                ["Police", "Firefighters", "Paramedics"].includes(s)
              ) && "bg-green-600 text-white border-none"
            )}
          >
            {dispatchedStatus[emergency.id]?.some((s) =>
              ["Police", "Firefighters", "Paramedics"].includes(s)
            )
              ? "Solved"
              : dispatchedStatus[emergency.id]?.includes("Transfer")
              ? "Routed"
              : emergency.severity}
          </Badge>


          </div>
          <div className="text-xs sm:text-sm">{emergency.location}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(emergency.time)}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
