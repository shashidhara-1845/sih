"use client";

import React from "react";
import { useSimulation } from "../../context/SimulationContext";
import { VehicleThumbnail } from "../common/VehicleThumbnail";
import { ConfidenceBadge } from "../common/ConfidenceBadge";
import { HsrpPlate } from "../common/HsrpPlate";
import {
  X,
  Cpu,
  Route,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

export const FusionInspectorModal: React.FC = () => {
  const {
    selectedDetectionForModal,
    setSelectedDetectionForModal,
    trackVehicle,
  } = useSimulation();

  if (!selectedDetectionForModal) return null;

  const d = selectedDetectionForModal;
  const reg = d.registeredProfile;

  const isColorMatch = reg
    ? reg.registeredColor.toLowerCase().includes(d.color.toLowerCase()) || d.confidence.color >= 80
    : true;
  const isTypeMatch = reg ? reg.registeredType.toLowerCase() === d.vehicleType.toLowerCase() : true;

  const weights = [
    { name: "OCR Character Token Matrix (w₁ = 0.35)", score: d.confidence.ocr, desc: "Levenshtein token distance & optical character probability" },
    { name: "Visual Re-ID Embedding (w₂ = 0.20)", score: d.confidence.reIdEmbedding, desc: "OSNet 512-dim visual contour & appearance cosine similarity" },
    { name: "Color Histogram Match (w₃ = 0.20)", score: d.confidence.color, desc: "CIELAB color space distribution distance (lighting invariant)" },
    { name: "Vehicle Body Geometry (w₄ = 0.15)", score: d.confidence.type, desc: "YOLOv8 silhouette aspect ratio & volumetric classification" },
    { name: "Spatio-Temporal Kinematics (w₅ = 0.10)", score: d.confidence.spatioTemporal, desc: "Physical velocity & road network graph feasibility" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200">
        {/* Header */}
        <div className="p-4 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-white/10 dark:text-white dark:border-white/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base font-bold text-zinc-900 dark:text-white">
                  MULTI-MODAL FORENSIC FUSION INSPECTOR
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 font-semibold">
                  {d.id}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                Bayesian Probabilistic Assessment Engine • Node: {d.cameraName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedDetectionForModal(null)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Hero: CCTV Frame + HSRP Plate + Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-zinc-50 dark:bg-black/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
            <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-48 shrink-0">
                <VehicleThumbnail
                  vehicleType={d.vehicleType}
                  colorHex={d.colorHex}
                  colorName={d.color}
                  plateNumber={d.plateNumber}
                  cameraId={d.cameraId}
                  timestamp={d.timestamp}
                  isMuddyOrObscured={d.isMuddyOrObscured}
                  className="h-28 w-full"
                />
              </div>

              <div className="space-y-2">
                <HsrpPlate
                  plateNumber={d.plateNumber}
                  isMuddyOrObscured={d.isMuddyOrObscured}
                  size="md"
                />
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                  {d.makeModel} • <span className="text-zinc-900 dark:text-white">{d.color}</span> ({d.vehicleType})
                </div>
                <div className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px] flex items-center gap-2">
                  <span>Speed: {d.speedKmh} km/h</span>
                  <span>•</span>
                  <span>Lane: {d.lane}</span>
                  <span>•</span>
                  <span>{d.direction}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-4">
              <ConfidenceBadge score={d.confidence.total} size="lg" showLabel={true} />
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center mt-2 font-mono">
                Bayesian Fusion Score
              </p>
            </div>
          </div>

          {/* Mathematical Formula Callout */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
            <div className="text-zinc-900 dark:text-white font-bold mb-1 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
              <span>MATHEMATICAL FORMULATION:</span>
              <code className="text-zinc-800 dark:text-zinc-200 bg-white dark:bg-black px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                P(Match) = Σ (wᵢ · Sᵢ)
              </code>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 text-[11px] leading-relaxed">
              Standard ANPR relies strictly on OCR, failing under mud, cloning, or weather. Sentinel balances character probabilities against OSNet 512-d feature vectors, CIELAB color distributions, and physical road kinematics.
            </p>
          </div>

          {/* Detailed Component Breakdown Bars */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Component Confidence Breakdown
            </h4>

            <div className="space-y-2">
              {weights.map((w, idx) => {
                const isDivergent = w.score < 60;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-800 dark:text-zinc-200 font-semibold">{w.name}</span>
                      <span
                        className={`font-mono font-bold ${
                          isDivergent ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {w.score.toFixed(1)}%
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-black overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDivergent
                            ? "bg-rose-500"
                            : w.score < 85
                            ? "bg-zinc-400"
                            : "bg-zinc-900 dark:bg-white"
                        }`}
                        style={{ width: `${w.score}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                      <span>{w.desc}</span>
                      {isDivergent ? (
                        <span className="text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> MISMATCH DETECTED
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RTO Profile vs Observed Camera Comparison Table */}
          {reg && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-zinc-900 dark:text-white" />
                <span>RTO Registration Profile vs. Camera Observation</span>
              </h4>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-zinc-100 text-zinc-700 border-b border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800">
                    <tr>
                      <th className="p-3">Attribute</th>
                      <th className="p-3">Official RTO Database</th>
                      <th className="p-3">Observed Camera Sighting</th>
                      <th className="p-3 text-right">Focal Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-black/60">
                    <tr>
                      <td className="p-3 text-zinc-500 dark:text-zinc-400">License Plate</td>
                      <td className="p-3 font-bold text-zinc-900 dark:text-yellow-400">{reg.plateNumber}</td>
                      <td className="p-3 font-bold text-zinc-900 dark:text-yellow-400">{d.plateNumber}</td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">MATCH (100%)</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-zinc-500 dark:text-zinc-400">Color</td>
                      <td className="p-3 text-zinc-800 dark:text-zinc-200">{reg.registeredColor}</td>
                      <td className="p-3 text-zinc-800 dark:text-zinc-200">{d.color}</td>
                      <td className="p-3 text-right">
                        {isColorMatch ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">MATCH</span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-500/40">
                            COLOR DIVERGENCE!
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-zinc-500 dark:text-zinc-400">Body Type</td>
                      <td className="p-3 text-zinc-800 dark:text-zinc-200">{reg.registeredType}</td>
                      <td className="p-3 text-zinc-800 dark:text-zinc-200">{d.vehicleType}</td>
                      <td className="p-3 text-right">
                        {isTypeMatch ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">MATCH</span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-500/40">
                            BODY MISMATCH!
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-zinc-500 dark:text-zinc-400">Make & Model</td>
                      <td className="p-3 text-zinc-800 dark:text-zinc-200">{reg.registeredMake}</td>
                      <td className="p-3 text-zinc-800 dark:text-zinc-200">{d.makeModel}</td>
                      <td className="p-3 text-right">
                        {reg.registeredMake.includes(d.makeModel) || d.makeModel.includes(reg.registeredMake) ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONSISTENT</span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-bold">SUSPECT PROFILE</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            Sensor: <span className="text-zinc-900 dark:text-white font-semibold">{d.cameraId}</span> • Logged: {d.timestamp}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedDetectionForModal(null)}
              className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setSelectedDetectionForModal(null);
                trackVehicle(d.plateNumber);
              }}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-xs dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <Route className="w-4 h-4" />
              <span>Plot Trajectory Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
