"use client";

import React, { useState } from "react";
import { AnomalyIncident } from "../../types/vehicle";
import { useSimulation } from "../../context/SimulationContext";
import {
  Zap,
  Clock,
  Gauge,
  MapPin,
  AlertTriangle,
  ArrowRight,
  FileText,
  Radio,
  Flame,
} from "lucide-react";

interface TeleportCardProps {
  incident: AnomalyIncident;
  onOpenReport: (incident: AnomalyIncident) => void;
}

export const TeleportCard: React.FC<TeleportCardProps> = ({
  incident,
  onOpenReport,
}) => {
  const { trackVehicle, acknowledgeAnomaly } = useSimulation();
  const [acknowledged, setAcknowledged] = useState(false);

  const sighting1 = incident.sightings[0];
  const sighting2 = incident.sightings[1];

  const handleAcknowledge = () => {
    setAcknowledged(true);
    acknowledgeAnomaly(incident.id);
  };

  return (
    <div className="bg-[#150f0b]/90 border border-amber-500/50 rounded-xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.15)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 text-[10px] font-mono font-bold">
                PHYSICS / KINEMATIC VIOLATION
              </span>
              <span className="font-mono text-xs text-slate-400">{incident.id}</span>
            </div>
            <h3 className="font-mono text-base font-bold text-slate-100 mt-0.5">
              {incident.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="font-mono text-xs text-slate-400">{incident.timestamp}</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              incident.status === "ACTIVE"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            }`}
          >
            {incident.status}
          </span>
        </div>
      </div>

      {/* Synopsis */}
      <div className="text-xs font-mono text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
        {incident.summary}
      </div>

      {/* Impossible Velocity Breakdown Box */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-300 font-bold uppercase flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Calculated Inter-Node Velocity</span>
          </span>
          <span className="text-rose-400 font-black text-sm bg-slate-950 px-2.5 py-0.5 rounded border border-rose-500/40">
            {incident.calculatedVelocityKmh} KM/H
          </span>
        </div>

        {/* Visual Velocity Gauge comparison */}
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Speed Limit: 120 km/h</span>
            <span className="text-rose-400 font-bold">524% EXCEEDED (SUPERSONIC PROBABILITY)</span>
          </div>
          <div className="h-3 rounded-full bg-slate-900 overflow-hidden relative">
            {/* Permissible range mark */}
            <div className="absolute top-0 bottom-0 left-0 w-1/5 bg-emerald-500/50 border-r border-emerald-400" />
            {/* Speeding bar */}
            <div className="h-full bg-gradient-to-r from-amber-500 to-rose-600 w-full animate-pulse" />
          </div>
        </div>

        {/* Node A to Node B Hop details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-amber-500/20 font-mono text-xs">
          <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400">Origin Node (10:15 AM)</span>
            <div className="text-slate-100 font-bold mt-0.5 truncate">{sighting1?.cameraName}</div>
            <div className="text-cyan-400 text-[10px] mt-0.5">{sighting1?.cameraId}</div>
          </div>

          <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400">Destination Node (10:20 AM)</span>
            <div className="text-slate-100 font-bold mt-0.5 truncate">{sighting2?.cameraName}</div>
            <div className="text-cyan-400 text-[10px] mt-0.5">{sighting2?.cameraId}</div>
          </div>

          <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400">Delta Parameters</span>
            <div className="text-yellow-400 font-bold mt-0.5">
              {incident.distanceKm} km in {incident.timeDeltaMin} mins
            </div>
            <div className="text-rose-400 text-[10px] font-bold mt-0.5">PHYSICAL IMPOSSIBILITY</div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
        <div className="text-xs font-mono text-slate-400">
          Target Plate: <span className="text-yellow-400 font-bold">{incident.plateNumber}</span> • Patrol:{" "}
          <span className="text-cyan-300">{incident.assignedUnit || "Expressway Flying Squad"}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenReport(incident)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate Dossier</span>
          </button>

          <button
            onClick={() => trackVehicle(incident.plateNumber)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono border border-cyan-500/40 transition-colors flex items-center gap-1.5"
          >
            <span>Plot Trajectory Jump</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleAcknowledge}
            disabled={acknowledged}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              acknowledged
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            }`}
          >
            {acknowledged ? "ACKNOWLEDGED ✓" : "ACKNOWLEDGE ALERT"}
          </button>
        </div>
      </div>
    </div>
  );
};
