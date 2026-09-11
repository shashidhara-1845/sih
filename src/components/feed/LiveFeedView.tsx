"use client";

import React, { useState, useMemo } from "react";
import { useSimulation } from "../../context/SimulationContext";
import { VehicleCard } from "./VehicleCard";
import { VehicleClass } from "../../types/vehicle";
import {
  Search,
  AlertOctagon,
  Layers,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

export const LiveFeedView: React.FC = () => {
  const { detections } = useSimulation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("ALL");
  const [flaggedOnly, setFlaggedOnly] = useState<boolean>(false);

  // Filter detections
  const filteredDetections = useMemo(() => {
    return detections.filter((d) => {
      // Plate/camera/make query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPlate = d.plateNumber.toLowerCase().includes(q);
        const matchesMake = d.makeModel.toLowerCase().includes(q);
        const matchesColor = d.color.toLowerCase().includes(q);
        const matchesCam = d.cameraName.toLowerCase().includes(q) || d.cameraId.toLowerCase().includes(q);
        if (!matchesPlate && !matchesMake && !matchesColor && !matchesCam) {
          return false;
        }
      }

      // Vehicle type filter
      if (selectedType !== "ALL" && d.vehicleType !== selectedType) {
        return false;
      }

      // Confidence filter
      if (confidenceFilter === "HIGH" && d.confidence.total < 85) return false;
      if (confidenceFilter === "REVIEW" && (d.confidence.total < 65 || d.confidence.total >= 85)) return false;
      if (confidenceFilter === "ANOMALY" && d.confidence.total >= 65) return false;

      // Flagged filter
      if (flaggedOnly && !d.isFlagged) return false;

      return true;
    });
  }, [detections, searchQuery, selectedType, confidenceFilter, flaggedOnly]);

  const vehicleTypes: (VehicleClass | "ALL")[] = ["ALL", "SUV", "Sedan", "Hatchback", "Truck", "Motorcycle"];

  return (
    <div className="space-y-4">
      {/* Top Controls & Filter Bar */}
      <div className="glass-panel rounded-2xl p-4.5 space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search input with sleek glass design */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by license plate (e.g. DL 01 XY 9999), model, or camera ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-white/[0.08] rounded-xl text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900/20 dark:focus:ring-white/20 transition-all"
            />
          </div>

          {/* Status & Flagged Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFlaggedOnly(!flaggedOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all border ${
                flaggedOnly
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.06] hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
              <span>Flagged Only</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/[0.08] text-xs font-mono text-zinc-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
              <span>Live Feed ({filteredDetections.length} matches)</span>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-zinc-200 dark:border-white/[0.06]">
          {/* Vehicle Type Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mr-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-zinc-900 dark:text-white" />
              <span>Type:</span>
            </span>
            {vehicleTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedType === t
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border border-zinc-950 dark:border-white font-bold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Confidence Filter Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-zinc-900 dark:text-white" />
              <span>Confidence:</span>
            </span>
            {[
              { id: "ALL", label: "All" },
              { id: "HIGH", label: "≥85% Match" },
              { id: "REVIEW", label: "65-84%" },
              { id: "ANOMALY", label: "<65% Flagged" },
            ].map((cf) => (
              <button
                key={cf.id}
                onClick={() => setConfidenceFilter(cf.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  confidenceFilter === cf.id
                    ? "bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white border border-zinc-900 dark:border-white/20 font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {cf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Ticker Ribbon */}
      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
          <span>Surveillance grid: 12 high-definition AI optical nodes streaming</span>
        </div>
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
          Click any card to open <span className="text-zinc-900 dark:text-white font-semibold">Forensic Fusion Inspector</span>
        </div>
      </div>

      {/* Detection Cards Grid */}
      {filteredDetections.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-950/40 border border-zinc-800 space-y-3">
          <AlertOctagon className="w-8 h-8 text-zinc-600 mx-auto" />
          <div className="text-sm font-mono text-zinc-300 font-bold">No Detections Found</div>
          <p className="text-xs text-zinc-400 font-mono">
            No vehicle observations matched your search or active filter combination.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedType("ALL");
              setConfidenceFilter("ALL");
              setFlaggedOnly(false);
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono hover:bg-zinc-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDetections.map((detection) => (
            <VehicleCard key={detection.id} detection={detection} />
          ))}
        </div>
      )}
    </div>
  );
};
