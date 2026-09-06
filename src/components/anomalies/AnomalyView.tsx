"use client";

import React, { useState } from "react";
import { useSimulation } from "../../context/SimulationContext";
import { ClonedPlateCard } from "./ClonedPlateCard";
import { TeleportCard } from "./TeleportCard";
import { IncidentReportModal } from "./IncidentReportModal";
import { AnomalyIncident } from "../../types/vehicle";
import {
  ShieldAlert,
  AlertTriangle,
  Zap,
  Filter,
  CheckCircle2,
  Bell,
  Sparkles,
  Info,
} from "lucide-react";

export const AnomalyView: React.FC = () => {
  const { anomalies, injectAnomaly, criticalAlertsCount } = useSimulation();

  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedIncidentForReport, setSelectedIncidentForReport] = useState<AnomalyIncident | null>(null);

  const filteredAnomalies = anomalies.filter((a) => {
    if (activeFilter === "CRITICAL" && a.severity !== "CRITICAL") return false;
    if (activeFilter === "ACTIVE" && a.status !== "ACTIVE") return false;
    if (activeFilter === "RESOLVED" && a.status !== "RESOLVED") return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#120a10]/90 border border-rose-500/40 rounded-xl p-4 shadow-[0_0_20px_rgba(244,63,94,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-base font-black tracking-wide text-slate-100 uppercase">
                ANOMALY & THREAT DISPATCH CENTER
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 font-bold">
                {criticalAlertsCount} HIGH-SEVERITY ALARMS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Automated multi-modal cross-check: Flagging counterfeit plates, physical teleportation & cloned registrations
            </p>
          </div>
        </div>

        {/* Quick Demo Injection Triggers */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => injectAnomaly("CLONED")}
            className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/50 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Cloned Plate</span>
          </button>
          <button
            onClick={() => injectAnomaly("TELEPORT")}
            className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Teleportation</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Filter Incident Scope:</span>
          {["ALL", "CRITICAL", "ACTIVE", "RESOLVED"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === f
                  ? "bg-slate-800 text-cyan-300 border border-slate-700 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="text-slate-400 hidden sm:block">
          Active Surveillance Stream: <span className="text-emerald-400">CONNECTED</span>
        </div>
      </div>

      {/* Incidents Stack */}
      <div className="space-y-4">
        {filteredAnomalies.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <div className="text-sm font-mono text-slate-300 font-bold">All Incidents Clear</div>
            <p className="text-xs text-slate-400 font-mono">
              No anomalies matching the current filter state.
            </p>
          </div>
        ) : (
          filteredAnomalies.map((incident) => {
            if (incident.type === "CLONED_PLATE") {
              return (
                <ClonedPlateCard
                  key={incident.id}
                  incident={incident}
                  onOpenReport={(inc) => setSelectedIncidentForReport(inc)}
                />
              );
            }

            if (incident.type === "TELEPORTATION") {
              return (
                <TeleportCard
                  key={incident.id}
                  incident={incident}
                  onOpenReport={(inc) => setSelectedIncidentForReport(inc)}
                />
              );
            }

            // Muddy / Other Anomaly Card
            return (
              <div
                key={incident.id}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      SYSTEM RESOLVED
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">{incident.title}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{incident.timestamp}</span>
                </div>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">{incident.details}</p>
                <div className="pt-2 text-xs font-mono text-cyan-400 flex items-center justify-between">
                  <span>Plate: {incident.plateNumber}</span>
                  <span className="text-slate-400">Resolved by Multi-Modal Re-ID Engine</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Incident Report Modal */}
      <IncidentReportModal
        incident={selectedIncidentForReport}
        onClose={() => setSelectedIncidentForReport(null)}
      />
    </div>
  );
};
