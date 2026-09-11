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
    <header className="h-16 border-b border-white/[0.08] bg-black/95 backdrop-blur-xl px-5 flex items-center justify-between z-30 sticky top-0">
      {/* Left section: Identity & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.08] border border-white/20 text-white">
            <Radio className="w-4 h-4 animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm tracking-wider text-white uppercase">
                SENTINEL // RE-ID
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300 border border-white/15">
                DEFENSE V3.4
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono tracking-tight flex items-center gap-1.5">
              <span>SMART INDIA HACKATHON</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                12/12 CAMERAS ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle section: Sleek Telemetry Indicators */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-lg bg-zinc-950 border border-white/[0.08] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-white" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase text-zinc-400">Total Passes Logged</span>
            <span className="text-xs font-mono font-bold text-white">
              {totalSightingsCount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/[0.08]" />

        <div className="flex items-center gap-2.5">
          <ShieldAlert
            className={`w-4 h-4 ${criticalAlertsCount > 0 ? "text-rose-400 animate-pulse" : "text-zinc-400"}`}
          />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase text-zinc-400">Active Threat Level</span>
            <span
              className={`text-xs font-mono font-bold ${
                criticalAlertsCount > 0 ? "text-rose-400" : "text-zinc-200"
              }`}
            >
              {criticalAlertsCount > 0 ? `${criticalAlertsCount} HIGH-SEVERITY FLAGS` : "CONDITION NORMAL"}
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Simulation Controls, Hot Cache & Triggers */}
      <div className="flex items-center gap-3">
        {/* L1 Hot Cache Button */}
        <button
          onClick={() => setIsHotCacheDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-zinc-100 border border-white/20 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.06)]"
          title="Open In-Memory Hot Cache & Suspect Repository"
        >
          <Database className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="hidden sm:inline">L1 HOT CACHE</span>
        </button>

        {/* Live Clock */}
        <div className="hidden xl:flex flex-col text-right mr-1">
          <span className="text-[9px] font-mono text-zinc-400 uppercase">SYS TELEMETRY</span>
          <span className="text-xs font-mono font-bold text-white">{timeStr || "10:24:00 IST"}</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mute Radar Pings" : "Unmute Radar Pings"}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? "bg-white/[0.08] text-white border-white/20 hover:bg-white/[0.15]"
              : "bg-zinc-950 text-zinc-500 border-white/[0.06] hover:text-zinc-300"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Simulation Speed Buttons */}
        <div className="flex items-center bg-zinc-950 border border-white/[0.08] rounded-lg p-0.5">
          {[1, 2, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => setSimulationSpeed(speed)}
              className={`px-2 py-1 text-[10px] font-mono font-bold rounded-md transition-colors ${
                simulationSpeed === speed
                  ? "bg-white text-black font-black shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
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
              ? "bg-white/[0.08] text-white border-white/20 hover:bg-white/[0.15]"
              : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)]"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">INJECT</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          <div className="absolute right-0 mt-1.5 w-56 bg-zinc-950 border border-white/[0.12] rounded-xl shadow-2xl py-1.5 hidden group-hover:block z-50 backdrop-blur-xl">
            <div className="px-3.5 py-1 text-[10px] font-mono text-zinc-400 border-b border-white/[0.08] uppercase">
              Simulate Live Edge Incident
            </div>
            <button
              onClick={() => injectAnomaly("CLONED")}
              className="w-full text-left px-3.5 py-2.5 text-xs font-mono text-zinc-200 hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="font-bold text-rose-300">Cloned Plate</div>
                <div className="text-[10px] text-zinc-400">Swift vs Scorpio duplicate</div>
              </div>
            </button>
            <button
              onClick={() => injectAnomaly("TELEPORT")}
              className="w-full text-left px-3.5 py-2.5 text-xs font-mono text-zinc-200 hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-amber-300">Teleportation</div>
                <div className="text-[10px] text-zinc-400">52km in 5min (628 km/h)</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
