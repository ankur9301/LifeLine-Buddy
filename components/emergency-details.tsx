"use client";

import {
  MapPin,
  Clock,
  BarChart,
  Shield,
  Flame,
  HeartPulse,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Emergency } from "@/types/emergency";
import { motion } from "framer-motion";

interface EmergencyDetailsProps {
  emergency: Emergency;
  onDispatch: (unit: "Police" | "Firefighters" | "Paramedics", id: string) => void;
}


export function EmergencyDetails({ emergency, onDispatch }: EmergencyDetailsProps) {
  console.log("Emergency Data:", emergency);

  // Convert the backend 1-10 scale to percentage (multiply by 10)
  const fearPercent = (emergency.emotions?.fear || 0) * 10;
  const confusionPercent = (emergency.emotions?.confusion || 0) * 10;
  const {
    severityLevel,
    urgencyLevel,
    severityPercent,
    urgencyPercent,
  } = getSeverityUrgency(emergency.severity as any);
  

  
  function getSeverityUrgency(level: "CRITICAL" | "URGENT" | "STANDARD") {
    switch (level) {
      case "CRITICAL":
        return {
          severityLevel: "High",
          urgencyLevel: "Critical",
          severityPercent: 90,
          urgencyPercent: 95,
        };
      case "URGENT":
        return {
          severityLevel: "Medium",
          urgencyLevel: "Urgent",
          severityPercent: 65,
          urgencyPercent: 70,
        };
      case "STANDARD":
        return {
          severityLevel: "Low",
          urgencyLevel: "Standard",
          severityPercent: 35,
          urgencyPercent: 40,
        };
      default:
        return {
          severityLevel: "Unknown",
          urgencyLevel: "Unknown",
          severityPercent: 0,
          urgencyPercent: 0,
        };
    }
  }
  
  
  return (
    <div className="h-full overflow-auto p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                CALLER EMOTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">Fear</span>
                    <span className="text-xs sm:text-sm">{fearPercent}%</span>
                  </div>
                  <Progress
                    value={fearPercent}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">
                      Confusion
                    </span>
                    <span className="text-xs sm:text-sm">
                      {confusionPercent}%
                    </span>
                  </div>
                  <Progress
                    value={confusionPercent}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-purple-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                AI ASSESSMENT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">
                      Severity
                    </span>
                    {/* <span className="text-xs sm:text-sm">High</span> */}
                    <span className="text-xs sm:text-sm">{severityLevel}</span>
                  </div>
                  <Progress
                    value={severityPercent}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-destructive"
                  />

                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">
                      Urgency
                    </span>
                    {/* <span className="text-xs sm:text-sm">Critical</span> */}
                    <span className="text-xs sm:text-sm">{urgencyLevel}</span>
                  </div>
                  <Progress
                    value={urgencyPercent}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-destructive"
                  />

                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-4">
          <h3 className="mb-3 text-xs sm:text-sm font-medium text-muted-foreground">
            Summary
          </h3>
          <p className="text-xs sm:text-sm">
            {emergency.summary ||
              "Caller reports current earthquakes and requests immediate assistance. Location: Golden Gate Bridge with many people injured."}
          </p>
        </div>

        <Separator className="my-4" />
        <div className="mb-0 flex flex-wrap items-center gap-3">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Dispatch:
          </h3>
          <Button
            size="sm"
            onClick={() => onDispatch("Police", emergency.id)}
            className="gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            Police
          </Button>
          <Button
            size="sm"
            onClick={() => onDispatch("Firefighters", emergency.id)}
            className="gap-1 sm:gap-2 bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
          >
            <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
            Firefighters
          </Button>
          <Button
            size="sm"
            onClick={() => onDispatch("Paramedics", emergency.id)}
            className="gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
          >
            <HeartPulse className="h-3 w-3 sm:h-4 sm:w-4" />
            Paramedics
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
