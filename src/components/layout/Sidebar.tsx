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
  badgeVariant?: "default" | "danger" | "titanium";
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
      badgeVariant: "titanium",
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
    <aside className="w-64 bg-white/95 dark:bg-[#050507] border-r border-zinc-200 dark:border-white/[0.08] flex flex-col justify-between shrink-0 select-none z-20 transition-colors duration-200">
      {/* Top Nav Section */}
      <div className="p-3.5 space-y-4">
        {/* Defense Emblem / Classification Banner */}
        <div className="px-3 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-900 dark:text-white" />
            <span className="text-[11px] font-mono uppercase font-bold text-zinc-900 dark:text-zinc-200">
              POLICE RE-ID GRID
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group ${
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm dark:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                    : "hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 border border-transparent hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white"
                        : "bg-zinc-100 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-semibold tracking-tight ${
                        isActive ? "text-white dark:text-zinc-950" : "text-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] line-clamp-1 ${
                        isActive ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-500"
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive
                        ? "bg-white/20 text-white dark:bg-zinc-900 dark:text-white"
                        : item.badgeVariant === "danger"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 animate-pulse"
                        : item.badgeVariant === "titanium"
                        ? "bg-zinc-100 dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-white/10"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
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
      <div className="p-3.5 border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-black/70">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-800 dark:text-zinc-200">
              Active Watchlist
            </span>
          </div>
          <span className="text-[9px] font-mono text-zinc-500">SIH TARGETS</span>
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
                    ? "bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-500/50 dark:text-rose-200 shadow-sm"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-xs"
                }`}
              >
                <div>
                  <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 tracking-wider text-xs">
                    {item.plate}
                  </div>
                  <div className="text-[10px] text-zinc-500 line-clamp-1">{item.reason}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* System architecture badge */}
        <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
          <span>AI Engine: OSNet + YOLOv8</span>
          <span className="text-zinc-900 dark:text-white font-bold">12ms LATENCY</span>
        </div>
      </div>
    </aside>
  );
};
