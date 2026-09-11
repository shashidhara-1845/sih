"use client";

import React, { useState } from "react";
import { useSimulation } from "../../context/SimulationContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Cpu,
  BarChart3,
  Sliders,
  Sparkles,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export const AnalyticsView: React.FC = () => {
  const { theme } = useSimulation();

  // Configurable weights simulator
  const [weights, setWeights] = useState({
    ocr: 35,
    reId: 20,
    color: 20,
    type: 15,
    spatioTemporal: 10,
  });

  const hourlyData = [
    { hour: "06:00", detections: 4200, anomalies: 3 },
    { hour: "07:00", detections: 8900, anomalies: 8 },
    { hour: "08:00", detections: 18400, anomalies: 19 },
    { hour: "09:00", detections: 24800, anomalies: 27 },
    { hour: "10:00", detections: 28900, anomalies: 34 },
    { hour: "11:00", detections: 23100, anomalies: 22 },
    { hour: "12:00", detections: 19500, anomalies: 14 },
    { hour: "13:00", detections: 17200, anomalies: 12 },
    { hour: "14:00", detections: 18900, anomalies: 16 },
  ];

  const comparisonData = [
    { condition: "Optimal Angle / Clean", standardAnprOcr: 98, sentinelMultiModal: 99 },
    { condition: "Muddy / Obscured Plate", standardAnprOcr: 44, sentinelMultiModal: 91 },
    { condition: "Night IR Illumination", standardAnprOcr: 72, sentinelMultiModal: 94 },
    { condition: "Cloned Plate Detection", standardAnprOcr: 12, sentinelMultiModal: 98 },
    { condition: "High Speed (>100 km/h)", standardAnprOcr: 68, sentinelMultiModal: 92 },
  ];

  const anomalyDistribution = [
    { name: "Cloned Registrations", value: 38, color: "#f43f5e" },
    { name: "Teleportation / Speed Violations", value: 29, color: "#f59e0b" },
    { name: "Muddy Plates Disambiguated", value: 24, color: "#e4e4e7" },
    { name: "Stolen Vehicle Watchlist Hits", value: 9, color: "#10b981" },
  ];

  const isDark = theme === "dark";
  const gridStroke = isDark ? "#27272a" : "#e4e4e7";
  const axisStroke = isDark ? "#71717a" : "#a1a1aa";
  const standardBarColor = isDark ? "#52525b" : "#94a3b8";
  const sentinelBarColor = isDark ? "#ffffff" : "#09090b";
  const tooltipBg = isDark ? "#09090b" : "#ffffff";
  const tooltipBorder = isDark ? "#27272a" : "#e4e4e7";
  const tooltipText = isDark ? "#ffffff" : "#09090b";
  const areaStroke = isDark ? "#ffffff" : "#09090b";
  const areaGradientColor = isDark ? "#ffffff" : "#09090b";

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-white/10 dark:text-white dark:border-white/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-mono text-base font-black tracking-wide text-zinc-900 dark:text-white uppercase">
              FUSION ENGINE ANALYTICS & TUNER
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
              Empirical Re-ID Performance Metrics, Multi-Modal Accuracy Gain & Weight Hyperparameter Tuning
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-xs font-mono dark:text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>FUSION GAIN: +41.8% ACCURACY OVER RAW OCR</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Standard ANPR OCR vs Sentinel Multi-Modal Re-ID */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white" />
              <h3 className="font-mono text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200">
                Standard ANPR (OCR Only) vs. Sentinel Multi-Modal Fusion
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">SUCCESS RATE (%)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="condition" stroke={axisStroke} tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke={axisStroke} tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: 8, fontSize: 12, fontFamily: "monospace", color: tooltipText }}
                  formatter={(val: any) => [`${val}%`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
                <Bar dataKey="standardAnprOcr" name="Standard ANPR (OCR Only)" fill={standardBarColor} radius={[4, 4, 0, 0]} />
                <Bar dataKey="sentinelMultiModal" name="Sentinel Multi-Modal Fusion" fill={sentinelBarColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 text-center">
            Notice the drastic advantage under muddy plates and counterfeit cloned plate scenarios.
          </div>
        </div>

        {/* Chart 2: Hourly Detection Throughput & Anomaly Surge */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-900 dark:text-white" />
              <h3 className="font-mono text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200">
                City Camera Detection Volume (Hourly Scan Rate)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">PASSES / HR</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={areaGradientColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={areaGradientColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="hour" stroke={axisStroke} tick={{ fontSize: 10 }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: 8, fontSize: 12, fontFamily: "monospace", color: tooltipText }}
                />
                <Area type="monotone" dataKey="detections" stroke={areaStroke} fillOpacity={1} fill="url(#colorDetections)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 text-center">
            Peak surveillance throughput logged at 10:00 AM (28.9K scans across 12 smart nodes).
          </div>
        </div>
      </div>

      {/* Interactive Weight Hyperparameter Tuner */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs dark:shadow-2xl transition-colors duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-zinc-900 dark:text-white" />
            <h3 className="font-mono text-sm font-bold uppercase text-zinc-900 dark:text-white">
              Interactive Probabilistic Weight Tuner (Hackathon Experimentation)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
            Current Σ Weights: {weights.ocr + weights.reId + weights.color + weights.type + weights.spatioTemporal}%
          </span>
        </div>

        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Adjust the relative weight coefficients ($w_1$ to $w_5$) of the multi-modal fusion formula to observe how the AI balances OCR reliability against visual embeddings and kinematics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {/* Slider 1: OCR */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-700 dark:text-zinc-300">w₁: Plate OCR</span>
              <span className="text-zinc-900 dark:text-white font-bold">{weights.ocr}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weights.ocr}
              onChange={(e) => setWeights({ ...weights, ocr: Number(e.target.value) })}
              className="w-full accent-zinc-950 dark:accent-white cursor-pointer"
            />
            <div className="text-[10px] text-zinc-500 font-mono">Plate character tokens</div>
          </div>

          {/* Slider 2: Re-ID */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-700 dark:text-zinc-300">w₂: Deep Re-ID</span>
              <span className="text-zinc-900 dark:text-white font-bold">{weights.reId}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={weights.reId}
              onChange={(e) => setWeights({ ...weights, reId: Number(e.target.value) })}
              className="w-full accent-zinc-950 dark:accent-white cursor-pointer"
            />
            <div className="text-[10px] text-zinc-500 font-mono">ResNet/OSNet 512-d feature</div>
          </div>

          {/* Slider 3: Color */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-700 dark:text-zinc-300">w₃: Color Hist</span>
              <span className="text-zinc-900 dark:text-white font-bold">{weights.color}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={weights.color}
              onChange={(e) => setWeights({ ...weights, color: Number(e.target.value) })}
              className="w-full accent-zinc-950 dark:accent-white cursor-pointer"
            />
            <div className="text-[10px] text-zinc-500 font-mono">HSV histogram distance</div>
          </div>

          {/* Slider 4: Type */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-700 dark:text-zinc-300">w₄: Body Type</span>
              <span className="text-zinc-900 dark:text-white font-bold">{weights.type}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={weights.type}
              onChange={(e) => setWeights({ ...weights, type: Number(e.target.value) })}
              className="w-full accent-zinc-950 dark:accent-white cursor-pointer"
            />
            <div className="text-[10px] text-zinc-500 font-mono">YOLOv8 silhouette class</div>
          </div>

          {/* Slider 5: Kinematics */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-700 dark:text-zinc-300">w₅: Spatio-Temp</span>
              <span className="text-zinc-900 dark:text-white font-bold">{weights.spatioTemporal}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={weights.spatioTemporal}
              onChange={(e) => setWeights({ ...weights, spatioTemporal: Number(e.target.value) })}
              className="w-full accent-zinc-950 dark:accent-white cursor-pointer"
            />
            <div className="text-[10px] text-zinc-500 font-mono">Graph distance velocity</div>
          </div>
        </div>
      </div>
    </div>
  );
};
