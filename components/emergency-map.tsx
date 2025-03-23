"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  MapPin,
  ZoomIn,
  ZoomOut,
  Compass,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import type { Emergency } from "@/types/emergency";

interface EmergencyMapProps {
  emergencies: Emergency[];
  activeEmergency: Emergency | null;
  onEmergencySelect?: (emergencyId: string) => void;
}

export function EmergencyMap({
  emergencies,
  activeEmergency,
  onEmergencySelect,
}: EmergencyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapInteractionHint, setMapInteractionHint] = useState(true);
  // NEW: track if user has manually interacted (panned/zoomed) the map.
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const apiKey = "AIzaSyCsPL2l1E1jk9gwwOuVc5h8hwpvLKlFIpw";

  // INITIALIZE MAP
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    try {
      const washingtonDC = { lat: 38.9072, lng: -77.0369 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: washingtonDC,
        zoom: 13,
        mapId: "emergency-map",
        disableDefaultUI: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: false,
        gestureHandling: "greedy",
        // Note: If using mapId, you should remove custom styles.
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#000000" }, { lightness: 13 }],
          },
          {
            featureType: "administrative",
            elementType: "geometry.fill",
            stylers: [{ color: "#000000" }],
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }],
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [{ color: "#08304b" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#0c4152" }, { lightness: 5 }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [{ color: "#000000" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#0b434f" }, { lightness: 25 }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.fill",
            stylers: [{ color: "#000000" }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.stroke",
            stylers: [{ color: "#0b3d51" }, { lightness: 16 }],
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [{ color: "#000000" }],
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [{ color: "#146474" }],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [{ color: "#021019" }],
          },
        ],
      });
      // Mark user interaction
      map.addListener("dragstart", () => setHasUserInteracted(true));
      map.addListener("zoom_changed", () => setHasUserInteracted(true));
      setMapInstance(map);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoading(false);
    }
  }, [mapLoaded]);

  // CREATE MARKERS & AUTO-CENTER (only on emergency data update)
  useEffect(() => {
    if (!mapInstance || !mapLoaded) return;

    // Clear any existing markers.
    markers.forEach((markerObj) => {
      markerObj.marker?.setMap(null);
      markerObj.infoWindow?.close();
    });

    const geocoder = new window.google.maps.Geocoder();
    const newMarkers: any[] = [];

    // Keywords that indicate an invalid location.
    const invalidLocationKeywords = [
      "unknown",
      "no location",
      "kofodite",
      "not provided",
      "missing and abandoned office",
    ];

    emergencies.forEach((emergency) => {
      if (!emergency.location) return;
      const loc = emergency.location.trim().toLowerCase();
      if (invalidLocationKeywords.some((keyword) => loc.includes(keyword))) {
        console.warn(
          "Skipping geocode for invalid location:",
          emergency.location
        );
        return;
      }

      geocoder.geocode({ address: emergency.location }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === "OK" && results && results[0]) {
          const position = results[0].geometry.location;
          const isActive = activeEmergency?.id === emergency.id;
          const marker = new window.google.maps.Marker({
            position,
            map: mapInstance,
            title: emergency.type,
            animation: isActive ? window.google.maps.Animation.BOUNCE : null,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor:
                emergency.severity === "CRITICAL" ? "#ef4444" : "#eab308",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
              scale: isActive ? 12 : 10,
            },
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 250px;">
                <div style="font-weight: 600;">${emergency.type}</div>
                <div style="font-size: 13px;">${emergency.location}</div>
                <div style="font-size: 12px; color: #9ca3af;">${emergency.time}</div>
                <div style="font-size: 13px; color: #374151;">
                  ${emergency.summary?.substring(0, 100)}${
                    emergency.summary && emergency.summary.length > 100
                      ? "..."
                      : ""
                  }
                </div>
              </div>
            `,
            maxWidth: 300,
            pixelOffset: new window.google.maps.Size(0, -5),
          });

          marker.addListener("click", () => {
            newMarkers.forEach((m) => m.infoWindow?.close());
            infoWindow.open(mapInstance, marker);
            // When a marker is clicked, disable auto-centering.
            setMapInteractionHint(false);
            onEmergencySelect?.(emergency.id);
          });
          marker.addListener("mouseover", () =>
            infoWindow.open(mapInstance, marker)
          );
          marker.addListener("mouseout", () => infoWindow.close());

          newMarkers.push({ marker, infoWindow, emergency });
          // Update markers state (batching markers)
          setMarkers([...newMarkers]);
        } else {
          console.warn(
            "Geocode failed for",
            emergency.location,
            "with status:",
            status
          );
        }
      });
    });

    // Auto-center the map only if there's no active emergency and the user has not interacted.
    if (!activeEmergency && newMarkers.length > 0 && !hasUserInteracted) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(({ marker }) => {
        if (marker?.getPosition) bounds.extend(marker.getPosition());
      });
      mapInstance.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(
        mapInstance,
        "idle",
        () => {
          if (mapInstance.getZoom() > 15) mapInstance.setZoom(15);
          window.google.maps.event.removeListener(listener);
        }
      );
    }
  }, [emergencies, activeEmergency, mapInstance, mapLoaded, hasUserInteracted]);

  // UPDATE MARKER ANIMATIONS WHEN activeEmergency CHANGES (but DO NOT auto-fit here)
  useEffect(() => {
    if (!mapInstance || !mapLoaded || markers.length === 0) return;
    markers.forEach(({ marker, infoWindow, emergency }) => {
      const isActive = activeEmergency?.id === emergency.id;
      if (marker.setAnimation) {
        marker.setAnimation(
          isActive ? window.google.maps.Animation.BOUNCE : null
        );
      }
      if (marker.setIcon) {
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: emergency.severity === "CRITICAL" ? "#ef4444" : "#eab308",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
          scale: isActive ? 12 : 10,
        });
      }
      // If an emergency is active, recenter the map on its location.
      if (isActive) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: emergency.location }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === "OK" && results && results[0]) {
            const position = results[0].geometry.location;
            mapInstance.panTo(position);
            mapInstance.setZoom(15);
          }
        });
      } else {
        infoWindow.close();
      }
    });
    // Note: We removed auto-fit bounds from this effect.
  }, [activeEmergency, mapInstance, mapLoaded, markers]);

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() + 1);
      setMapInteractionHint(false);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() - 1);
      setMapInteractionHint(false);
    }
  };

  const handleRecenter = () => {
    if (mapInstance) {
      if (activeEmergency) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { address: activeEmergency.location },
          (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === "OK" && results && results[0]) {
              const position = results[0].geometry.location;
              mapInstance.panTo(position);
              mapInstance.setZoom(15);
            }
          }
        );
      } else if (markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(({ marker }) => {
          if (marker?.getPosition) bounds.extend(marker.getPosition());
        });
        mapInstance.fitBounds(bounds);
      } else {
        mapInstance.panTo({ lat: 38.9072, lng: -77.0369 });

        mapInstance.setZoom(13);
      }
      setMapInteractionHint(false);
    }
  };

  const renderFallbackMap = () => {
    const geoToPixel = (coordinates: [number, number]): [number, number] => {
      const mapBounds = {
        west: -122.52,
        east: -122.35,
        north: 37.82,
        south: 37.75,
      };
      const [lng, lat] = coordinates;
      const x =
        ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
      const y =
        ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
      return [x, y];
    };

    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-slate-900 bg-opacity-90">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
          <div className="absolute left-0 top-0 h-full w-1/3 rounded-r-full bg-blue-900 opacity-10"></div>
          <div className="absolute bottom-0 right-0 h-1/4 w-1/4 rounded-tl-full bg-blue-900 opacity-10"></div>
          <div className="absolute left-1/4 top-0 h-full w-1 bg-gray-500 opacity-30"></div>
          <div className="absolute left-0 top-1/3 h-1 w-full bg-gray-500 opacity-30"></div>
          <div className="absolute left-2/3 top-0 h-full w-1 bg-gray-500 opacity-30"></div>
          <div className="absolute left-0 top-2/3 h-1 w-full bg-gray-500 opacity-30"></div>
          {emergencies.map((emergency) => {
            const dummyCoordinates: [number, number] = [0, 0];
            const [x, y] = geoToPixel(dummyCoordinates);
            const isActive = activeEmergency?.id === emergency.id;
            return (
              <div
                key={emergency.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isActive ? 10 : 5,
                }}
              >
                <div
                  className={`absolute h-8 w-8 sm:h-12 sm:w-12 animate-ping rounded-full ${
                    emergency.severity === "CRITICAL"
                      ? "bg-red-500/30"
                      : "bg-yellow-500/30"
                  }`}
                ></div>
                <div
                  className={`relative flex h-5 w-5 sm:h-6 sm:w-6 animate-pulse items-center justify-center rounded-full ${
                    emergency.severity === "CRITICAL"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  } ${isActive ? "ring-2 ring-white" : ""}`}
                >
                  <AlertCircle className="h-3 w-3 text-white" />
                </div>
                {isActive && (
                  <div className="mt-1 rounded bg-background/80 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                    {emergency.type}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full w-full bg-slate-900">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        onLoad={() => setMapLoaded(true)}
        onError={(e) => {
          console.error("Error loading Google Maps:", e);
          setLoading(false);
        }}
      />
      <div ref={mapRef} className="h-full w-full cursor-move" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-medium">Loading map...</span>
          </div>
        </div>
      )}
      {!mapLoaded && !loading && renderFallbackMap()}
      <AnimatePresence>
        {mapInteractionHint && mapLoaded && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-lg text-center max-w-xs"
          >
            <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">Interactive Map</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Click and drag to move the map. Click on markers to see emergency
              details.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMapInteractionHint(false)}
            >
              Got it
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute left-4 top-20 z-10 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Zoom In</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Zoom Out</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
                onClick={handleRecenter}
              >
                <Compass className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Recenter Map</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
        <Card className="bg-background/80 p-1 sm:p-2 backdrop-blur-sm shadow-lg">
          <div className="text-xs font-medium">Active Incidents</div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-destructive"></span>
            <span className="text-xs">
              Critical:{" "}
              {emergencies.filter((e) => e.severity === "CRITICAL").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500"></span>
            <span className="text-xs">
              Urgent:{" "}
              {emergencies.filter((e) => e.severity === "URGENT").length}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
