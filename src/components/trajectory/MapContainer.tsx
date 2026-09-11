"use client";

import React, { useEffect, useRef, useState } from "react";
import { VehicleTrajectory, CameraNode } from "../../types/vehicle";
import { CITY_CAMERAS } from "../../mock/cameras";
import { useSimulation } from "../../context/SimulationContext";
import { Play, RotateCcw, Compass, MapPin, Radio, AlertTriangle } from "lucide-react";

interface MapContainerProps {
  trajectory?: VehicleTrajectory;
  onSelectNode?: (seq: number) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  trajectory,
  onSelectNode,
}) => {
  const { theme } = useSimulation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const animatedMarkerRef = useRef<any>(null);

  const [isReplaying, setIsReplaying] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Initialize Leaflet map safely on client
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet to prevent SSR window reference errors
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Center around Delhi NCR coordinates
      const centerLat = 28.58;
      const centerLng = 77.25;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // CartoDB tile layer: Dark Matter for dark mode, Positron for light mode
      const tileUrl =
        theme === "dark"
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = { map, L };
      setIsLeafletReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Dynamically update tile layer when theme changes
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const tileUrl =
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    tileLayerRef.current.setUrl(tileUrl);
  }, [theme]);

  // Update markers and glowing polyline when trajectory changes
  useEffect(() => {
    if (!isLeafletReady || !mapInstanceRef.current) return;

    const { map, L } = mapInstanceRef.current;

    // Clear existing markers & lines
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
    if (animatedMarkerRef.current) {
      animatedMarkerRef.current.remove();
      animatedMarkerRef.current = null;
    }

    // 1. Draw all ambient city surveillance camera nodes
    CITY_CAMERAS.forEach((cam) => {
      const isPartOfRoute = trajectory?.points.some((p) => p.camera.id === cam.id);
      if (isPartOfRoute) return; // will be drawn with route highlight

      const iconHtml = `
        <div class="relative flex items-center justify-center w-6 h-6 -translate-x-1/2 -translate-y-1/2">
          <div class="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400"></div>
        </div>
      `;

      const ambientIcon = L.divIcon({
        html: iconHtml,
        className: "custom-cam-pin",
        iconSize: [24, 24],
      });

      const marker = L.marker([cam.lat, cam.lng], { icon: ambientIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-mono text-xs">
            <div class="font-bold text-white">${cam.id}: ${cam.name}</div>
            <div class="text-zinc-400 text-[10px] mt-0.5">Zone: ${cam.zone}</div>
            <div class="text-emerald-400 text-[10px] mt-0.5">● ONLINE (${cam.fps} FPS)</div>
          </div>
        `);

      markersRef.current.push(marker);
    });

    // 2. Draw Trajectory Path & Sequential Route Nodes
    if (trajectory && trajectory.points.length > 0) {
      const latLngs = trajectory.points.map((p) => [p.camera.lat, p.camera.lng]);

      // Glowing Polyline: theme-adaptive
      const lineColor = theme === "dark" ? "#ffffff" : "#09090b";
      const glowColor = theme === "dark" ? "#ffffff" : "#71717a";

      const glowLine = L.polyline(latLngs, {
        color: glowColor,
        weight: 7,
        opacity: 0.25,
        smoothFactor: 1,
      }).addTo(map);

      const mainLine = L.polyline(latLngs, {
        color: lineColor,
        weight: 3,
        opacity: 0.95,
        dashArray: "6, 6",
        smoothFactor: 1,
      }).addTo(map);

      polylineRef.current = L.featureGroup([glowLine, mainLine]);

      // Draw numbered sequence markers for each node
      trajectory.points.forEach((point, idx) => {
        const isStart = idx === 0;
        const isEnd = idx === trajectory.points.length - 1;
        const isAnomalous = point.isImpossibleSpeed;

        const pinColor = isAnomalous
          ? "bg-rose-500 border-rose-300 text-white shadow-[0_0_15px_rgba(244,63,94,0.8)]"
          : isEnd
          ? "bg-zinc-900 text-white border-zinc-950 dark:bg-zinc-200 dark:border-white dark:text-zinc-950 font-black shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.7)]"
          : "bg-white border-zinc-900 text-zinc-950 dark:bg-white dark:border-zinc-300 dark:text-zinc-950 font-black shadow-sm dark:shadow-[0_0_12px_rgba(255,255,255,0.5)]";

        const iconHtml = `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <div class="absolute -inset-2 rounded-full ${isAnomalous ? "bg-rose-500/30 animate-ping" : "bg-black/10 dark:bg-white/20 animate-pulse"}"></div>
            <div class="relative w-7 h-7 rounded-full ${pinColor} border-2 flex items-center justify-center font-mono text-xs font-bold transition-transform hover:scale-125">
              ${point.sequence}
            </div>
            <div class="absolute top-8 px-2 py-0.5 rounded bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-800 dark:text-zinc-300 whitespace-nowrap shadow-md pointer-events-none">
              ${point.camera.id}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-route-node",
          iconSize: [28, 28],
        });

        const marker = L.marker([point.camera.lat, point.camera.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2 font-mono text-xs space-y-1 min-w-[200px]">
              <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1">
                <span class="font-bold text-zinc-900 dark:text-white">NODE ${point.sequence}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded ${isAnomalous ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40" : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"}">
                  ${isStart ? "FIRST SIGHTING" : isEnd ? "LATEST FIX" : "WAYPOINT"}
                </span>
              </div>
              <div class="font-bold text-zinc-800 dark:text-zinc-200 mt-1">${point.camera.name}</div>
              <div class="text-zinc-500 dark:text-zinc-400 text-[11px]">Time: <span class="text-zinc-800 dark:text-zinc-200 font-medium">${point.detection.timestamp}</span></div>
              <div class="text-zinc-500 dark:text-zinc-400 text-[11px]">Speed Logged: <span class="text-zinc-800 dark:text-zinc-200">${point.detection.speedKmh} km/h</span></div>
              ${
                !isStart
                  ? `<div class="text-zinc-500 dark:text-zinc-400 text-[11px]">Inter-node Speed: <span class="${point.isImpossibleSpeed ? "text-rose-600 dark:text-rose-400 font-bold" : "text-zinc-800 dark:text-zinc-200"}">${point.speedBetweenKmh.toFixed(1)} km/h (${point.distanceFromPrevKm} km in ${point.timeFromPrevMin} min)</span></div>`
                  : ""
              }
            </div>
          `);

        marker.on("click", () => {
          if (onSelectNode) onSelectNode(point.sequence);
        });

        markersRef.current.push(marker);
      });

      // Fit map bounds to show full route comfortably
      try {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
      } catch {
        // Fallback zoom
      }
    }
  }, [trajectory, isLeafletReady, onSelectNode, theme]);

  // Replay Trajectory animation
  const handleReplay = () => {
    if (!trajectory || trajectory.points.length < 2 || !mapInstanceRef.current) return;
    const { map, L } = mapInstanceRef.current;

    setIsReplaying(true);
    let step = 0;
    setActiveStep(0);

    const points = trajectory.points;

    const interval = setInterval(() => {
      if (step >= points.length) {
        clearInterval(interval);
        setIsReplaying(false);
        return;
      }

      const currentPoint = points[step];
      setActiveStep(currentPoint.sequence);

      // Pan to current node
      map.panTo([currentPoint.camera.lat, currentPoint.camera.lng], {
        animate: true,
        duration: 0.8,
      });

      step += 1;
    }, 1400);
  };

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-black shadow-lg dark:shadow-2xl transition-colors duration-200">
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating HUD Controls Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-300 flex items-center gap-2 shadow-md dark:shadow-lg">
          <Radio className="w-3.5 h-3.5 text-zinc-900 dark:text-white animate-pulse" />
          <span>GIS GRID: NCR ARTERIAL CORRIDORS</span>
        </div>

        {trajectory && (
          <button
            onClick={handleReplay}
            disabled={isReplaying}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md border ${
              isReplaying
                ? "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 animate-pulse cursor-wait"
                : "bg-zinc-950 text-white border-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:border-white dark:hover:bg-zinc-200"
            }`}
          >
            {isReplaying ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>REPLAYING (NODE {activeStep})...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>REPLAY TRAJECTORY</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Map Legend Overlay at bottom-left */}
      <div className="absolute bottom-3 left-3 z-10 px-3 py-2 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono space-y-1.5 shadow-md dark:shadow-lg">
        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
          Route Legend
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-white border border-zinc-300" />
          <span className="text-zinc-700 dark:text-zinc-300">Sequential Camera Fix</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-300 border border-zinc-900 dark:border-white" />
          <span className="text-zinc-700 dark:text-zinc-300">Latest Known Position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300" />
          <span className="text-rose-600 dark:text-rose-300">Kinematic Violation / Jump</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500" />
          <span className="text-zinc-500 dark:text-zinc-400">Active Sensor Node</span>
        </div>
      </div>
    </div>
  );
};
