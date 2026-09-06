"use client";

import React from "react";
import { useSimulation, DashboardView } from "../../context/SimulationContext";
import {
  Video,
  MapPin,
  AlertOctagon,
  BarChart3,
  Shield,
  ChevronRight,
  Target,
  Sparkles,
} from "lucide-react";

interface NavItem {
  id: DashboardView;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "default" | "danger" | "cyan";
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    detections,
    criticalAlertsCount,
    trackVehicle,
    selectedPlateForTrajectory,
  } = useSimulation();

  const navItems: NavItem[] = [
    {
      id: "feed",
      label: "Live Detection Feed",
      sublabel: "Real-time edge camera stream",
      icon: Video,
      badge: `${detections.length}`,
      badgeVariant: "cyan",
    },
    {
      id: "trajectory",
      label: "Trajectory Tracking",
      sublabel: "Spatial-temporal GIS route",
      icon: MapPin,
      badge: "ACTIVE",
      badgeVariant: "default",
    },
    {
      id: "anomalies",
      label: "Anomaly & Alert Center",
      sublabel: "Cloned & teleportation flags",
      icon: AlertOctagon,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} CRITICAL` : undefined,
      badgeVariant: "danger",
    },
    {
      id: "analytics",
      label: "Fusion Analytics",
      sublabel: "Probabilistic weights & stats",
      icon: BarChart3,
      badge: "AI CORE",
      badgeVariant: "default",
    },
  ];

  const watchlist = [
    { plate: "DL 01 XY 9999", reason: "Cloned Plate Suspect", priority: "HIGH" },
    { plate: "HR 26 DQ 5520", reason: "Teleportation Anomaly", priority: "CRITICAL" },
    { plate: "MH 12 AB 1234", reason: "Muddy Plate Disambiguated", priority: "MEDIUM" },
  ];

  return (
    <aside className="w-64 bg-[#050811] border-r border-white/[0.07] flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Nav Section */}
      <div className="p-3.5 space-y-4">
        {/* Defense Emblem / Classification Banner */}
        <div className="px-3 py-2.5 rounded-lg bg-slate-900/40 border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono uppercase font-bold text-slate-200">
              POLICE RE-ID GRID
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between group ${
                  isActive
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "hover:bg-white/[0.04] text-slate-400 border border-transparent hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-slate-900/80 text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-semibold tracking-tight ${
                        isActive ? "text-slate-100" : "text-slate-300"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{item.sublabel}</div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      item.badgeVariant === "danger"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                        : item.badgeVariant === "cyan"
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Suspect Watchlist Section at bottom */}
      <div className="p-3.5 border-t border-white/[0.07] bg-[#03060e]/80">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] font-mono uppercase font-bold text-slate-200">
              Active Watchlist
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400">SIH TARGETS</span>
        </div>

        <div className="space-y-1.5">
          {watchlist.map((item) => {
            const isSelected = selectedPlateForTrajectory === item.plate && activeView === "trajectory";
            return (
              <button
                key={item.plate}
                onClick={() => trackVehicle(item.plate)}
                className={`w-full text-left p-2 rounded-lg border transition-all text-xs flex items-center justify-between ${
                  isSelected
                    ? "bg-rose-950/40 border-rose-500/50 text-rose-200 shadow-sm"
                    : "bg-slate-900/40 border-white/[0.05] hover:border-white/[0.1] text-slate-300"
                }`}
              >
                <div>
                  <div className="font-mono font-bold text-yellow-400 tracking-wider text-xs">
                    {item.plate}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{item.reason}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* System architecture badge */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>AI Engine: OSNet + YOLOv8</span>
          <span className="text-cyan-400 font-bold">LATENCY 12ms</span>
        </div>
      </div>
    </aside>
  );
};
