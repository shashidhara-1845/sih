"use client";

import React from "react";
import { CachedSuspect } from "../../services/cacheService";
import { VehicleDetection } from "../../types/vehicle";
import { useSimulation } from "../../context/SimulationContext";
import {
  ShieldAlert,
  Radio,
  Clock,
  MapPin,
  X,
  Compass,
  Zap,
  CheckCircle,
} from "lucide-react";

interface RedAlertBannerProps {
  alert: {
    suspect: CachedSuspect;
    detection: VehicleDetection;
  } | null;
  onDismiss: () => void;
}

export const RedAlertBanner: React.FC<RedAlertBannerProps> = ({
  alert,
  onDismiss,
}) => {
  const { trackVehicle } = useSimulation();

  if (!alert) return null;

  const { suspect, detection } = alert;
  const isRed = suspect.threatLevel === "CRITICAL_RED";

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 py-2 animate-in slide-in-from-top duration-300 pointer-events-auto">
      <div
        className={`max-w-6xl mx-auto rounded-xl p-3.5 border shadow-[0_0_40px_rgba(244,63,94,0.35)] backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
          isRed
            ? "bg-[#18080d]/95 border-rose-500/80"
            : "bg-[#181108]/95 border-amber-500/80"
        }`}
      >
        {/* Left Info Section */}
        <div className="flex items-center gap-3.5">
          <div
            className={`p-2.5 rounded-lg border animate-pulse ${
              isRed
                ? "bg-rose-600/30 text-rose-300 border-rose-500/60"
                : "bg-amber-600/30 text-amber-300 border-amber-500/60"
            }`}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider ${
                  isRed
                    ? "bg-rose-500 text-zinc-950 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                    : "bg-amber-500 text-zinc-950"
                }`}
              >
                HOT-CACHE MATCH: {suspect.threatLevel.replace("_", " ")}
              </span>
              <span className="font-mono text-sm font-black text-yellow-400 bg-black px-2 py-0.5 rounded border border-zinc-800">
                {suspect.plateNumber}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                ({suspect.firNumber})
              </span>
            </div>

            <div className="text-xs font-mono text-zinc-200 font-semibold flex items-center gap-2">
              <span>{suspect.reason}</span>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2.5">
              <span className="flex items-center gap-1 text-zinc-200">
                <MapPin className="w-3 h-3 text-white" />
                {detection.cameraName} ({detection.cameraId})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-yellow-300">
                <Clock className="w-3 h-3" />
                {detection.timestamp}
              </span>
              <span>•</span>
              <span className="text-emerald-400">
                Assigned Unit: {suspect.assignedUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => {
              trackVehicle(suspect.plateNumber);
              onDismiss();
            }}
            className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <Compass className="w-4 h-4" />
            <span>Track on GIS Map</span>
          </button>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
