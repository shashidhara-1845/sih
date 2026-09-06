"use client";

import React, { useState } from "react";
import { Search, Compass, AlertTriangle, ShieldCheck } from "lucide-react";

interface VehicleSearchProps {
  currentPlate: string;
  onSearchPlate: (plate: string) => void;
}

export const VehicleSearch: React.FC<VehicleSearchProps> = ({
  currentPlate,
  onSearchPlate,
}) => {
  const [inputVal, setInputVal] = useState(currentPlate);

  const presets = [
    {
      plate: "MH 12 AB 1234",
      label: "MH 12 AB 1234",
      type: "CLEAN ROUTE",
      desc: "5-Camera Corridor Fix (Muddy plate auto-resolved)",
      color: "border-emerald-500/40 text-emerald-300 bg-emerald-950/30",
    },
    {
      plate: "DL 01 XY 9999",
      label: "DL 01 XY 9999",
      type: "CLONED PLATE",
      desc: "Conflicting Swift vs Scorpio Sighting Path",
      color: "border-rose-500/40 text-rose-300 bg-rose-950/30",
    },
    {
      plate: "HR 26 DQ 5520",
      label: "HR 26 DQ 5520",
      type: "TELEPORTATION",
      desc: "52km in 5min (628 km/h Impossible Traversal)",
      color: "border-amber-500/40 text-amber-300 bg-amber-950/30",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearchPlate(inputVal.trim().toUpperCase());
    }
  };

  return (
    <div className="bg-[#0b1122]/90 border border-slate-800 rounded-xl p-4 space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter license plate to plot trajectory (e.g. MH 12 AB 1234)..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-yellow-400 font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 uppercase tracking-wider"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Compass className="w-4 h-4" />
          <span>Track Trajectory</span>
        </button>
      </form>

      {/* Preset demo targets */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[10px] font-mono uppercase text-slate-400">
          Hackathon Demo Presets:
        </span>
        {presets.map((p) => (
          <button
            key={p.plate}
            onClick={() => {
              setInputVal(p.plate);
              onSearchPlate(p.plate);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all flex items-center gap-2 ${p.color} hover:brightness-125 ${
              currentPlate === p.plate ? "ring-1 ring-cyan-400 font-bold" : ""
            }`}
          >
            <span className="font-bold">{p.label}</span>
            <span className="text-[10px] opacity-75">({p.type})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
