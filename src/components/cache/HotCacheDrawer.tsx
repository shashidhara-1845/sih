"use client";

import React, { useState } from "react";
import { RedAlertCacheService, CachedSuspect } from "../../services/cacheService";
import { VehicleClass } from "../../types/vehicle";
import { useSimulation } from "../../context/SimulationContext";
import {
  Database,
  Cpu,
  Plus,
  Trash2,
  X,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Clock,
  Compass,
  AlertOctagon,
} from "lucide-react";

interface HotCacheDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotCacheDrawer: React.FC<HotCacheDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { trackVehicle } = useSimulation();

  const [suspects, setSuspects] = useState<CachedSuspect[]>(
    RedAlertCacheService.getAllSuspects()
  );
  const [metrics, setMetrics] = useState(RedAlertCacheService.getMetrics());

  // Form state for hot-loading a new suspect
  const [plateInput, setPlateInput] = useState("");
  const [threatInput, setThreatInput] = useState<"CRITICAL_RED" | "HIGH_AMBER" | "WATCHLIST">("CRITICAL_RED");
  const [makeInput, setMakeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [typeInput, setTypeInput] = useState<VehicleClass>("SUV");
  const [reasonInput, setReasonInput] = useState("");
  const [firInput, setFirInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const refreshList = () => {
    setSuspects(RedAlertCacheService.getAllSuspects());
    setMetrics(RedAlertCacheService.getMetrics());
  };

  const handleAddSuspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateInput.trim() || !reasonInput.trim()) return;

    const newSuspect: CachedSuspect = {
      plateNumber: plateInput.trim().toUpperCase(),
      threatLevel: threatInput,
      reason: reasonInput.trim(),
      firNumber: firInput.trim() || `FIR-2026/URGENT/${Math.floor(Math.random() * 8999 + 1000)}`,
      registeredMake: makeInput.trim() || "Unspecified Model",
      registeredColor: colorInput.trim() || "Unspecified Color",
      registeredType: typeInput,
      ownerName: "Under Active Investigation",
      assignedUnit: "District Interceptor Patrol",
      addedAt: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      totalHits: 0,
    };

    RedAlertCacheService.addSuspect(newSuspect);
    refreshList();

    setSuccessMsg(`✓ Plate ${newSuspect.plateNumber} hot-loaded into L1 memory!`);
    setTimeout(() => setSuccessMsg(""), 4000);

    // Reset form
    setPlateInput("");
    setReasonInput("");
    setMakeInput("");
    setColorInput("");
    setFirInput("");
  };

  const handleRemoveSuspect = (plate: string) => {
    RedAlertCacheService.removeSuspect(plate);
    refreshList();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.06)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-white/10 text-white border border-white/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base font-bold text-white uppercase">
                  L1 HOT CACHE // SUSPECT RED ALERT REPOSITORY
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold">
                  RAM IN-MEMORY
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Sub-millisecond O(1) hash lookup table for immediate threat interception
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Cache Telemetry Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black p-3.5 rounded-xl border border-zinc-800 font-mono">
            <div className="p-2 rounded bg-zinc-900/50 border border-zinc-800/80 text-center">
              <div className="text-[10px] text-zinc-400 uppercase">Lookup Latency</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">
                {metrics.avgLatencyMs} ms
              </div>
              <div className="text-[9px] text-zinc-500">O(1) Memory Time</div>
            </div>

            <div className="p-2 rounded bg-zinc-900/50 border border-zinc-800/80 text-center">
              <div className="text-[10px] text-zinc-400 uppercase">Cache Hit Ratio</div>
              <div className="text-base font-bold text-white mt-0.5">
                {metrics.hitRatio}%
              </div>
              <div className="text-[9px] text-zinc-500">Fast-Path Intercepts</div>
            </div>

            <div className="p-2 rounded bg-zinc-900/50 border border-zinc-800/80 text-center">
              <div className="text-[10px] text-zinc-400 uppercase">Cached Suspects</div>
              <div className="text-base font-bold text-yellow-400 mt-0.5">
                {suspects.length} Targets
              </div>
              <div className="text-[9px] text-zinc-500">Hot in RAM</div>
            </div>

            <div className="p-2 rounded bg-zinc-900/50 border border-zinc-800/80 text-center">
              <div className="text-[10px] text-zinc-400 uppercase">Eviction Policy</div>
              <div className="text-xs font-bold text-zinc-200 mt-1">
                SLIDING 30M LRU
              </div>
              <div className="text-[9px] text-zinc-500">Auto-Garbage Collected</div>
            </div>
          </div>

          {/* Form: Hot-Load Suspect Car */}
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-white" />
                <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                  Hot-Load New Suspect Car into Active Cache
                </h4>
              </div>
              {successMsg && (
                <span className="text-xs font-mono text-emerald-400 font-bold animate-pulse">
                  {successMsg}
                </span>
              )}
            </div>

            <form onSubmit={handleAddSuspect} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    required
                    value={plateInput}
                    onChange={(e) => setPlateInput(e.target.value)}
                    placeholder="e.g. DL 03 CA 4821"
                    className="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-yellow-400 font-bold focus:border-white focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                    Threat Priority *
                  </label>
                  <select
                    value={threatInput}
                    onChange={(e) => setThreatInput(e.target.value as any)}
                    className="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-zinc-200 focus:border-white focus:outline-none"
                  >
                    <option value="CRITICAL_RED">CRITICAL RED (Immediate Intercept)</option>
                    <option value="HIGH_AMBER">HIGH AMBER (Stolen / Wanted)</option>
                    <option value="WATCHLIST">WATCHLIST (Routine Monitor)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value as any)}
                    className="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-zinc-200 focus:border-white focus:outline-none"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                    Make & Model
                  </label>
                  <input
                    type="text"
                    value={makeInput}
                    onChange={(e) => setMakeInput(e.target.value)}
                    placeholder="e.g. Tata Nexon EV"
                    className="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-zinc-200 focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="e.g. Flame Red"
                    className="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-zinc-200 focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                    FIR / Warrant Case No.
                  </label>
                  <input
                    type="text"
                    value={firInput}
                    onChange={(e) => setFirInput(e.target.value)}
                    placeholder="e.g. FIR-2026/DL/4412"
                    className="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-zinc-200 focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                  Reason for Flagging / Incident Details *
                </label>
                <input
                  type="text"
                  required
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="e.g. Escaped toll barrier after hit-and-run on Ring Road"
                  className="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-zinc-200 focus:border-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-white hover:bg-zinc-200 text-zinc-950 font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Hot-Load into RAM Cache</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Cached Targets List */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>Active Cached Suspect Vehicles ({suspects.length} in Memory)</span>
              <span className="text-[10px] text-zinc-500">SYNCED ACROSS ALL 12 CAMERAS</span>
            </h4>

            <div className="space-y-2">
              {suspects.map((s) => {
                const isRed = s.threatLevel === "CRITICAL_RED";
                return (
                  <div
                    key={s.plateNumber}
                    className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isRed
                        ? "bg-rose-950/20 border-rose-500/40"
                        : "bg-zinc-900/40 border-zinc-800"
                    }`}
                  >
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-yellow-400 bg-black px-2 py-0.5 rounded border border-zinc-800">
                          {s.plateNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isRed
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          }`}
                        >
                          {s.threatLevel.replace("_", " ")}
                        </span>
                        <span className="text-zinc-400 text-[11px] hidden sm:inline">
                          {s.registeredMake} ({s.registeredColor})
                        </span>
                      </div>

                      <div className="text-zinc-200">{s.reason}</div>

                      <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-3 pt-0.5">
                        <span>Case: {s.firNumber}</span>
                        <span>•</span>
                        <span>Loaded At: {s.addedAt}</span>
                        <span>•</span>
                        <span className="text-zinc-300">Hits Today: {s.totalHits}</span>
                        {s.lastInterceptedCamera && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-300">
                              Last Seen: {s.lastInterceptedCamera}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          trackVehicle(s.plateNumber);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono border border-zinc-700 transition-colors flex items-center gap-1"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Map</span>
                      </button>

                      <button
                        onClick={() => handleRemoveSuspect(s.plateNumber)}
                        title="Evict Suspect from Cache (Apprehended)"
                        className="p-1.5 rounded bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors border border-zinc-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex justify-between items-center text-xs font-mono text-zinc-400">
          <div>
            Cache Implementation: <span className="text-white font-medium">Hash Table + Redis In-Memory Pattern</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
