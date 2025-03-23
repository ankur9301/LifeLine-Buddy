"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  Headphones,
  MapPin,
  Phone,
  X,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  AlertTriangle,
  Menu,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Emergency } from "@/types/emergency";
import { EmergencyMap } from "@/components/emergency-map";
import { EmergencyList } from "@/components/emergency-list";
import { EmergencyDetails } from "@/components/emergency-details";
import { LiveTranscript } from "@/components/live-transcript";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

export function EmergencyDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMobileView, setIsMobileView] = useState<boolean | undefined>();
  const [emergencyListOpen, setEmergencyListOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [fullscreenMap, setFullscreenMap] = useState(false);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [activeEmergency, setActiveEmergency] = useState<Emergency | null>(
    null
  );
  const [resolvedCount, setResolvedCount] = useState(0); // New state for resolved cases


  // Inside EmergencyDashboard component
const [dispatchedStatus, setDispatchedStatus] = useState<Record<string, string[]>>({});
const [dispatchAlerts, setDispatchAlerts] = useState<{ id: string, message: string, color: string }[]>([]);

const handleDispatch = (unit: "Police" | "Firefighters" | "Paramedics", id: string) => {
  const colorMap = {
    Police: "bg-blue-600",
    Firefighters: "bg-red-600",
    Paramedics: "bg-green-600",
  };

  // setDispatchedStatus((prev) => ({
  //   ...prev,
  //   [id]: [...(prev[id] || []), unit],
  // }));
  setDispatchedStatus((prev) => ({
    ...prev,
    [id]: [...(prev[id] || []), unit],
  }));
  
  

  setDispatchAlerts((prev) => [...prev, {
    id,
    message: `${unit} dispatched!`,
    color: colorMap[unit],
  }]);

  // Auto-dismiss the alert after 3 seconds
  setTimeout(() => {
    setDispatchAlerts((prev) => prev.filter((a) => a.id !== id || a.message !== `${unit} dispatched!`));
  }, 3000);
};


  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkIfMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      if (isMobile) setSidebarOpen(false);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const response = await fetch(
          "https://bisonbuddyapp-3ba93dd7d7dd.herokuapp.com/get_conversation"
        );
        const data = await response.json();
        // The API returns an object with an "emergencies" array.
        const emergenciesArray = Array.isArray(data.emergencies)
          ? data.emergencies
          : [];
        // Since there is no status field in the sample, include all emergencies.
        // Modify this filter if your API later adds a status field.
        const filtered = emergenciesArray.filter(
          (e: Emergency) => !e.status || e.status === "open"
        );
        setEmergencies(filtered);
      } catch (error) {
        console.error("Failed to fetch emergencies:", error);
      }
    };
    fetchAndFilter();
    const interval = setInterval(fetchAndFilter, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTransfer = (id: string) => {
    setDispatchedStatus((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), "Transfer"],
    }));
  };
  

  // When an emergency is selected (via list or marker), open details/transcript and the list overlay.
  const handleEmergencySelect = (emergencyId: string) => {
    const foundEmergency =
      emergencies.find((e) => e.id === emergencyId) || null;
    if (activeEmergency && activeEmergency.id === emergencyId) {
      // If already active but overlays are closed, force them open.
      setDetailsOpen(true);
      if (isMobileView) {
        setEmergencyListOpen(true);
      } else {
        setSidebarOpen(true);
      }
      // Force a new reference to trigger re‑render.
      setActiveEmergency({ ...activeEmergency });
    } else {
      setActiveEmergency(foundEmergency);
      setDetailsOpen(true);
      if (isMobileView) {
        setEmergencyListOpen(true);
      } else {
        setSidebarOpen(true);
      }
    }
  };

  useEffect(() => {
    if (activeEmergency) {
      if (isMobileView) {
        if (!emergencyListOpen && !detailsOpen) {
          setActiveEmergency(null);
        }
      } else {
        if (!sidebarOpen && !detailsOpen) {
          setActiveEmergency(null);
        }
      }
    }
  }, [
    activeEmergency,
    isMobileView,
    emergencyListOpen,
    sidebarOpen,
    detailsOpen,
  ]);

  useEffect(() => {
    if (activeEmergency) setDetailsOpen(true);
  }, [activeEmergency]);

  const formattedTime =
    currentTime?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }) || "\u00A0";

  const onCloseCase = async (id: string) => {
    try {
      await fetch(
        "https://bisonbuddyapp-3ba93dd7d7dd.herokuapp.com/close_conversation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      setEmergencies((prev) => prev.filter((e) => e.id !== id));
      setActiveEmergency(null);
      setResolvedCount((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to close case:", err);
    }
  };

  


  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {/* Pass onEmergencySelect so marker clicks trigger both overlays */}
        <EmergencyMap
          emergencies={emergencies}
          activeEmergency={activeEmergency}
          onEmergencySelect={handleEmergencySelect}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <header className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <div className="flex h-14 items-center border-b px-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-red-500" />
                    <span className="text-lg font-semibold">LifeLine Buddy</span>
                  </div>
                </div>
                <div className="py-4">
                  <div className="px-2 py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Button>
                  </div>
                  <div className="px-2 py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span>Emergencies</span>
                    </Button>
                  </div>
                  <div className="px-2 py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <Users className="h-5 w-5" />
                      <span>Resources</span>
                    </Button>
                  </div>
                  <div className="px-2 py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <FileText className="h-5 w-5" />
                      <span>Reports</span>
                    </Button>
                  </div>
                  <div className="px-2 py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-auto border-t p-4">
                  <Button
                    variant="ghost"
                    className="flex w-full justify-start gap-2 px-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>OP</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">Operator</span>
                      <span className="text-xs text-muted-foreground">
                        Online
                      </span>
                    </div>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-500" />
              <span className="text-lg font-semibold whitespace-nowrap">
                LifeLine Buddy
              </span>
            </div>

            <Badge
              variant="outline"
              className="ml-2 gap-1 border-blue-600 text-blue-600"
            >
              <MapPin className="h-3 w-3" />
              <span className="hidden sm:inline">WASHINGTON, DC</span>
              <span className="sm:hidden">SF</span>
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="ml-2 hidden md:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="ml-2 gap-1 md:hidden"
              onClick={() => setEmergencyListOpen(!emergencyListOpen)}
            >
              <List className="h-3 w-3" />
              <span>{isMounted ? emergencies.length : "..."}</span>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <Headphones className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                AI Operator Connected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {isMounted ? formattedTime : "\u00A0"}
              </span>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <Badge variant="secondary" className="gap-1">
                <Bell className="h-3 w-3" />
                {isMounted ? emergencies.length : "..."}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullscreenMap(!fullscreenMap)}
              className="ml-2"
            >
              {fullscreenMap ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>
      </div>

      <div className="absolute inset-0 pt-14 z-0 pointer-events-none">
        <AnimatePresence>
          {(sidebarOpen || emergencyListOpen) && !fullscreenMap && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 20 }}
              className={cn(
                "absolute left-0 top-0 bottom-0 z-20 w-80 bg-background/80 backdrop-blur-sm border-r pointer-events-auto",
                isMobileView ? "top-0" : "top-0"
              )}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <h2 className="text-lg font-semibold">Emergencies</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      isMobileView
                        ? setEmergencyListOpen(false)
                        : setSidebarOpen(false)
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <Input placeholder="Filter calls..." className="mb-4" />
                  <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-md bg-muted/70 p-2">
                      <div className="text-xl font-bold">
                        {emergencies.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="rounded-md bg-muted/70 p-2">
                      <div className="text-xl font-bold text-destructive">
                        {
                          emergencies.filter((e) => e.severity === "CRITICAL")
                            .length
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Critical
                      </div>
                    </div>
                    <div className="rounded-md bg-muted/70 p-2">
                      <div className="text-xl font-bold text-green-500">
                        {resolvedCount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Resolved
                      </div>
                    </div>
                  </div>
                  <EmergencyList
                    emergencies={emergencies}
                    activeEmergency={activeEmergency}
                    dispatchedStatus={dispatchedStatus}
                    setActiveEmergency={(emergency) => {
                      setActiveEmergency(emergency);
                      if (isMobileView) setEmergencyListOpen(false);

                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeEmergency && detailsOpen && !fullscreenMap && (
            <motion.div
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              transition={{ type: "spring", damping: 20 }}
              className={cn(
                "absolute bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-t pointer-events-auto",
                "h-[60%] md:h-[50%]",
                sidebarOpen && !isMobileView ? "left-80" : "left-0"
              )}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <h2 className="text-base font-semibold">
                    {activeEmergency.type} at {activeEmergency.location}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        activeEmergency.severity === "CRITICAL"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {activeEmergency.severity}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDetailsOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                  <div className="flex h-1/2 md:h-full md:w-1/2 flex-col overflow-hidden border-b md:border-b-0 md:border-r">
                    <div className="flex items-center justify-between border-b px-4 py-1 overflow-auto">
                      <h2 className="text-sm font-medium">Emergency Details</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-7 invisible"
                      />

                    </div>
                    <div className="flex-1 overflow-auto">
                    <EmergencyDetails
                      emergency={activeEmergency}
                      onDispatch={handleDispatch}
                    />

                    </div>
                  </div>
                  <div className="flex h-1/2 md:h-full md:w-1/2 flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto">
                      <LiveTranscript
                        emergency={activeEmergency}
                        onCloseCase={onCloseCase}
                        onTransfer={handleTransfer}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
          {activeEmergency && !detailsOpen && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDetailsOpen(true)}
              className="shadow-lg"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </Button>
          )}
          {!sidebarOpen && isMobileView === false && !emergencyListOpen && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="shadow-lg"
            >
              <List className="mr-2 h-4 w-4" />
              Show Emergencies
            </Button>
          )}
        </div>

        {isMobileView && !emergencyListOpen && !fullscreenMap && (
          <div className="absolute bottom-4 left-4 z-30">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEmergencyListOpen(true)}
              className="shadow-lg"
            >
              <List className="mr-2 h-4 w-4" />
              <span className="mr-1">Emergencies</span>
              <Badge variant="outline" className="h-5 min-w-5 px-1">
                {isMounted ? emergencies.length : "..."}
              </Badge>
            </Button>
          </div>
        )}
      </div>
      <div className="absolute top-16 right-4 z-[999] w-[320px] space-y-3">
  <AnimatePresence>
    {dispatchAlerts.map((alert, i) => (
      <motion.div
        key={alert.id + alert.message + i}
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{
          type: "spring",
          damping: 14,
          stiffness: 200,
          duration: 0.5,
        }}
        className="relative flex items-center gap-4 rounded-2xl p-4 shadow-xl backdrop-blur-md border border-white/10 bg-gradient-to-br from-[#1e293b]/90 via-[#0f172a]/80 to-[#0f172a]/90"
      >
        <div className="text-3xl">
          {alert.message.includes("Police") && "🚓"}
          {alert.message.includes("Firefighters") && "🔥"}
          {alert.message.includes("Paramedics") && "🩺"}
        </div>
        <div className="flex flex-col text-white">
          <p className="font-semibold text-base tracking-tight">
            {alert.message}
          </p>
          <p className="text-sm text-white/70">
            {alert.message.includes("Police") && "Police are en route."}
            {alert.message.includes("Firefighters") && "Fire unit dispatched."}
            {alert.message.includes("Paramedics") &&
              "Medical team dispatched."}
          </p>
        </div>
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-400 animate-ping"></div>
      </motion.div>
    ))}
  </AnimatePresence>
</div>


    </div>
  );
}