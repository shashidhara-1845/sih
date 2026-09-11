"use client";

import React, { useState, useEffect } from "react";
import { useSimulation } from "../../context/SimulationContext";
import {
  Play,
  Pause,
  AlertTriangle,
  Radio,
  Volume2,
  VolumeX,
  Zap,
  Activity,
  ShieldAlert,
  Server,
  Database,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    isSimulating,
    toggleSimulation,
    simulationSpeed,
    setSimulationSpeed,
    injectAnomaly,
    soundEnabled,
    setSoundEnabled,
    totalSightingsCount,
    criticalAlertsCount,
    setIsHotCacheDrawerOpen,
    theme,
    toggleTheme,
  } = useSimulation();

  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-white/[0.08] bg-white/95 dark:bg-black/95 backdrop-blur-xl px-5 flex items-center justify-between z-30 sticky top-0 transition-colors duration-200">
      {/* Left section: Identity & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/[0.08] border border-zinc-300 dark:border-white/20 text-zinc-900 dark:text-white">
            <Radio className="w-4 h-4 animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm tracking-wider text-zinc-950 dark:text-white uppercase">
                SENTINEL // RE-ID
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/15">
                DEFENSE V3.4
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono tracking-tight flex items-center gap-1.5">
              <span>SMART INDIA HACKATHON</span>
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <span className="text-zinc-700 dark:text-zinc-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                12/12 CAMERAS ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle section: Sleek Telemetry Indicators */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/[0.08] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-zinc-900 dark:text-white" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Total Passes Logged</span>
            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white">
              {totalSightingsCount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-200 dark:bg-white/[0.08]" />

        <div className="flex items-center gap-2.5">
          <ShieldAlert
            className={`w-4 h-4 ${criticalAlertsCount > 0 ? "text-rose-500 animate-pulse" : "text-zinc-400"}`}
          />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Active Threat Level</span>
            <span
              className={`text-xs font-mono font-bold ${
                criticalAlertsCount > 0 ? "text-rose-500" : "text-zinc-700 dark:text-zinc-200"
              }`}
            >
              {criticalAlertsCount > 0 ? `${criticalAlertsCount} HIGH-SEVERITY FLAGS` : "CONDITION NORMAL"}
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Simulation Controls, Hot Cache & Triggers */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Arctic White Light Mode" : "Switch to Monochrome Titanium Dark Mode"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all shadow-sm ${
            theme === "dark"
              ? "bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-zinc-700 hover:border-zinc-600"
              : "bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-300 shadow-sm"
          }`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span className="hidden sm:inline text-zinc-200">LIGHT</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-zinc-800" />
              <span className="hidden sm:inline text-zinc-900">DARK</span>
            </>
          )}
        </button>

        {/* L1 Hot Cache Button */}
        <button
          onClick={() => setIsHotCacheDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-white/20 text-xs font-mono font-bold transition-all shadow-sm"
          title="Open In-Memory Hot Cache & Suspect Repository"
        >
          <Database className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
          <span className="hidden sm:inline">L1 HOT CACHE</span>
        </button>

        {/* Live Clock */}
        <div className="hidden xl:flex flex-col text-right mr-1">
          <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase">SYS TELEMETRY</span>
          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white">{timeStr || "10:24:00 IST"}</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mute Radar Pings" : "Unmute Radar Pings"}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? "bg-zinc-100 dark:bg-white/[0.08] text-zinc-900 dark:text-white border-zinc-300 dark:border-white/20 hover:bg-zinc-200 dark:hover:bg-white/[0.15]"
              : "bg-zinc-50 dark:bg-zinc-950 text-zinc-400 border-zinc-200 dark:border-white/[0.06] hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Simulation Speed Buttons */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/[0.08] rounded-lg p-0.5">
          {[1, 2, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => setSimulationSpeed(speed)}
              className={`px-2 py-1 text-[10px] font-mono font-bold rounded-md transition-colors ${
                simulationSpeed === speed
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-black font-black shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Simulation Toggle Button */}
        <button
          onClick={toggleSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border shadow-sm ${
            isSimulating
              ? "bg-zinc-900 text-white border-zinc-800 dark:bg-white/[0.08] dark:text-white dark:border-white/20 dark:hover:bg-white/[0.15]"
              : "bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700"
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden md:inline">SIM: LIVE</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span className="hidden md:inline">SIM: PAUSED</span>
            </>
          )}
        </button>

        {/* Quick Anomaly Injection Trigger Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40 dark:hover:bg-rose-500/25 transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden md:inline">INJECT</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/[0.12] rounded-xl shadow-2xl py-1.5 hidden group-hover:block z-50 backdrop-blur-xl">
            <div className="px-3.5 py-1 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-white/[0.08] uppercase">
              Simulate Live Edge Incident
            </div>
            <button
              onClick={() => injectAnomaly("CLONED")}
              className="w-full text-left px-3.5 py-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <div className="font-bold text-rose-600 dark:text-rose-300">Cloned Plate</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Swift vs Scorpio duplicate</div>
              </div>
            </button>
            <button
              onClick={() => injectAnomaly("TELEPORT")}
              className="w-full text-left px-3.5 py-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <div className="font-bold text-amber-600 dark:text-amber-300">Teleportation</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">52km in 5min (628 km/h)</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
