"use client";

import React, { useState } from "react";
import { AnomalyIncident } from "../../types/vehicle";
import { VehicleThumbnail } from "../common/VehicleThumbnail";
import { HsrpPlate } from "../common/HsrpPlate";
import { useSimulation } from "../../context/SimulationContext";
import {
  AlertTriangle,
  Clock,
  MapPin,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ClonedPlateCardProps {
  incident: AnomalyIncident;
  onOpenReport: (incident: AnomalyIncident) => void;
}

export const ClonedPlateCard: React.FC<ClonedPlateCardProps> = ({
  incident,
  onOpenReport,
}) => {
  const { trackVehicle, acknowledgeAnomaly } = useSimulation();
  const [dispatched, setDispatched] = useState(false);

  const sightingA = incident.sightings[0];
  const sightingB = incident.sightings[1];

  const handleDispatch = () => {
    setDispatched(true);
    acknowledgeAnomaly(incident.id);
  };

  return (
    <div className="bg-[#12070d]/90 border border-rose-500/40 rounded-2xl p-5 shadow-[0_0_35px_rgba(244,63,94,0.15)] space-y-4 backdrop-blur-xl">
      {/* Alert Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 text-[10px] font-mono font-bold">
                CRITICAL FORENSIC ALARM
              </span>
              <span className="font-mono text-xs text-slate-400">{incident.id}</span>
            </div>
            <h3 className="font-mono text-base font-bold text-slate-100 mt-1">
              {incident.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="font-mono text-xs text-slate-400">{incident.timestamp}</span>
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              incident.status === "ACTIVE"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            }`}
          >
            {incident.status}
          </span>
        </div>
      </div>

      {/* Forensic Explanation Synopsis */}
      <div className="text-xs font-mono text-slate-300 bg-black/40 p-3.5 rounded-xl border border-white/[0.06] leading-relaxed">
        {incident.summary}
      </div>

      {/* Side-by-Side Sighting Comparison */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center justify-between">
          <span>Concurrent Sighting Visual Evidence</span>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span>IDENTICAL STRING:</span>
            <span className="font-bold">{incident.plateNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sighting A (Legitimate / Registered Profile) */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                SIGHTING 1 (RTO LEDGER MATCH)
              </span>
              <span className="text-xs font-mono text-yellow-400 font-bold">{sightingA?.timestamp}</span>
            </div>

            {sightingA && (
              <VehicleThumbnail
                vehicleType={sightingA.vehicleType}
                colorHex={sightingA.colorHex}
                colorName={sightingA.color}
                plateNumber={sightingA.plateNumber}
                cameraId={sightingA.cameraId}
                timestamp={sightingA.timestamp}
                className="h-32 w-full"
              />
            )}

            <div className="space-y-1.5 text-xs font-mono pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Observed Make:</span>
                <span className="text-slate-100 font-semibold">{sightingA?.makeModel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Visual Body:</span>
                <span className="text-emerald-400 font-semibold">{sightingA?.vehicleType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vehicle Color:</span>
                <span className="text-slate-200 font-semibold">{sightingA?.color}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[11px]">
                <span className="text-slate-400">Camera Node:</span>
                <span className="text-cyan-300 truncate max-w-[190px]">{sightingA?.cameraName}</span>
              </div>
            </div>
          </div>

          {/* Sighting B (Counterfeit / Cloned Plate Sighting) */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold animate-pulse">
                SIGHTING 2 (CLONED / FAKE)
              </span>
              <span className="text-xs font-mono text-yellow-400 font-bold">{sightingB?.timestamp}</span>
            </div>

            {sightingB && (
              <VehicleThumbnail
                vehicleType={sightingB.vehicleType}
                colorHex={sightingB.colorHex}
                colorName={sightingB.color}
                plateNumber={sightingB.plateNumber}
                cameraId={sightingB.cameraId}
                timestamp={sightingB.timestamp}
                className="h-32 w-full"
              />
            )}

            <div className="space-y-1.5 text-xs font-mono pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Observed Make:</span>
                <span className="text-rose-300 font-bold">{sightingB?.makeModel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Visual Body:</span>
                <span className="text-rose-400 font-bold">{sightingB?.vehicleType} (MISMATCH!)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vehicle Color:</span>
                <span className="text-rose-400 font-bold">{sightingB?.color} (MISMATCH!)</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[11px]">
                <span className="text-slate-400">Camera Node:</span>
                <span className="text-rose-300 truncate max-w-[190px]">{sightingB?.cameraName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Probabilistic AI Proof Matrix */}
      <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
        <div>
          <div className="text-[10px] text-slate-400 uppercase">OCR Match</div>
          <div className="text-emerald-400 font-bold mt-0.5">100.0% (Identical)</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase">OSNet Re-ID Dist.</div>
          <div className="text-rose-400 font-bold mt-0.5">0.89 (Divergent)</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase">Color Similarity</div>
          <div className="text-rose-400 font-bold mt-0.5">18.4% (Different)</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase">Clone Probability</div>
          <div className="text-rose-400 font-black mt-0.5">99.6% (CONFIRMED)</div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
        <div className="text-xs font-mono text-slate-400">
          Assigned Response Unit:{" "}
          <span className="text-cyan-300 font-semibold">{incident.assignedUnit || "PCR-Delta 14 Interceptor"}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenReport(incident)}
            className="px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-white/[0.08] transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate FIR Dossier</span>
          </button>

          <button
            onClick={() => trackVehicle(incident.plateNumber)}
            className="px-3.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30 transition-colors flex items-center gap-1.5"
          >
            <span>Plot Map Trajectory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDispatch}
            disabled={dispatched}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-md ${
              dispatched
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]"
            }`}
          >
            {dispatched ? "UNIT DISPATCHED ✓" : "DISPATCH INTERCEPTOR"}
          </button>
        </div>
      </div>
    </div>
  );
};
