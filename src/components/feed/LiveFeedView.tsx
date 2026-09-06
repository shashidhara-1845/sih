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
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by license plate (e.g. DL 01 XY 9999), model, or camera ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          {/* Status & Flagged Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFlaggedOnly(!flaggedOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all border ${
                flaggedOnly
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "bg-slate-900/60 text-slate-400 border-white/[0.06] hover:text-slate-200"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Flagged Only</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06] text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Feed ({filteredDetections.length} matches)</span>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/[0.06]">
          {/* Vehicle Type Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 mr-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Type:</span>
            </span>
            {vehicleTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedType === t
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Confidence Filter Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
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
                    ? "bg-slate-800 text-slate-100 border border-white/[0.12] font-bold"
                    : "text-slate-400 hover:text-slate-300 hover:bg-white/[0.04]"
                }`}
              >
                {cf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Ticker Ribbon */}
      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/40 border border-white/[0.05] text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Surveillance grid: 12 high-definition AI optical nodes streaming</span>
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          Click any card to open <span className="text-cyan-400 font-semibold">Forensic Fusion Inspector</span>
        </div>
      </div>

      {/* Detection Cards Grid */}
      {filteredDetections.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-white/[0.06] space-y-3">
          <AlertOctagon className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="text-sm font-mono text-slate-300 font-bold">No Detections Found</div>
          <p className="text-xs text-slate-400 font-mono">
            No vehicle observations matched your search or active filter combination.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedType("ALL");
              setConfidenceFilter("ALL");
              setFlaggedOnly(false);
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-mono hover:bg-cyan-500/25 transition-colors"
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
