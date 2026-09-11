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
      <div className="bg-rose-50/80 dark:bg-[#120a10]/90 border border-rose-300 dark:border-rose-500/40 rounded-xl p-4 shadow-sm dark:shadow-[0_0_20px_rgba(244,63,94,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-rose-500/15 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-base font-black tracking-wide text-zinc-900 dark:text-slate-100 uppercase">
                ANOMALY & THREAT DISPATCH CENTER
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50 font-bold">
                {criticalAlertsCount} HIGH-SEVERITY ALARMS
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-slate-400 font-mono mt-0.5">
              Automated multi-modal cross-check: Flagging counterfeit plates, physical teleportation & cloned registrations
            </p>
          </div>
        </div>

        {/* Quick Demo Injection Triggers */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => injectAnomaly("CLONED")}
            className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Simulate Cloned Plate</span>
          </button>
          <button
            onClick={() => injectAnomaly("TELEPORT")}
            className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Simulate Teleportation</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-xs font-mono transition-colors duration-200">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 dark:text-zinc-400">Filter Incident Scope:</span>
          {["ALL", "CRITICAL", "ACTIVE", "RESOLVED"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === f
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border border-zinc-950 dark:border-white font-bold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="text-zinc-500 dark:text-zinc-400 hidden sm:block">
          Active Surveillance Stream: <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED</span>
        </div>
      </div>

      {/* Incidents Stack */}
      <div className="space-y-4">
        {filteredAnomalies.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-zinc-950/40 border border-zinc-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <div className="text-sm font-mono text-zinc-300 font-bold">All Incidents Clear</div>
            <p className="text-xs text-zinc-400 font-mono">
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
                className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px] font-mono font-bold">
                      SYSTEM RESOLVED
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-200">{incident.title}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{incident.timestamp}</span>
                </div>
                <p className="text-xs font-mono text-zinc-300 leading-relaxed">{incident.details}</p>
                <div className="pt-2 text-xs font-mono text-white flex items-center justify-between">
                  <span>Plate: <span className="text-yellow-400 font-bold">{incident.plateNumber}</span></span>
                  <span className="text-zinc-500">Resolved by Multi-Modal Re-ID Engine</span>
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
