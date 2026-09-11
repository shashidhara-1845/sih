"use client";

import React from "react";
import { VehicleTrajectory } from "../../types/vehicle";
import {
  Clock,
  MapPin,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface TrajectoryTimelineProps {
  trajectory: VehicleTrajectory;
  selectedNodeSeq?: number;
  onSelectNode?: (seq: number) => void;
}

export const TrajectoryTimeline: React.FC<TrajectoryTimelineProps> = ({
  trajectory,
  selectedNodeSeq,
  onSelectNode,
}) => {
  const { summary, points } = trajectory;

  const isAnomalous = summary.kinematicValidityScore < 50;

  return (
    <div className="space-y-4">
      {/* Kinematic Plausibility Summary Card */}
      <div
        className={`p-4 rounded-xl border space-y-3 transition-colors duration-200 ${
          isAnomalous
            ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40 shadow-xs dark:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
            : "bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-zinc-800 shadow-xs dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-black text-zinc-950 dark:text-yellow-400 bg-zinc-100 dark:bg-black px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-800">
              {trajectory.plateNumber}
            </span>
            <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-300">
              {summary.makeModel}
            </span>
          </div>

          <div
            className={`px-2 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 ${
              isAnomalous
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 animate-pulse"
                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
            }`}
          >
            {isAnomalous ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PHYSICS ANOMALY ({summary.kinematicValidityScore}%)</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                <span>VALID ROUTE ({summary.kinematicValidityScore}%)</span>
              </>
            )}
          </div>
        </div>

        {/* Route Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-center font-mono">
          <div className="p-2 rounded bg-zinc-50 dark:bg-black/60 border border-zinc-200 dark:border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Total Distance</div>
            <div className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">{summary.totalDistanceKm} km</div>
          </div>
          <div className="p-2 rounded bg-zinc-50 dark:bg-black/60 border border-zinc-200 dark:border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Transit Time</div>
            <div className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">{summary.totalTimeMin} mins</div>
          </div>
          <div className="p-2 rounded bg-zinc-50 dark:bg-black/60 border border-zinc-200 dark:border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Avg Velocity</div>
            <div
              className={`text-xs font-bold mt-0.5 ${
                summary.avgSpeedKmh > 120 ? "text-rose-600 dark:text-rose-400" : "text-zinc-800 dark:text-zinc-200"
              }`}
            >
              {summary.avgSpeedKmh} km/h
            </div>
          </div>
        </div>

        {/* Predicted Next Sighting Node AI */}
        {summary.predictedNextNode && (
          <div className="p-2.5 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-start gap-2.5 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white shrink-0 mt-0.5" />
            <div>
              <div className="text-zinc-900 dark:text-white font-bold flex items-center gap-1.5">
                <span>AI TRAJECTORY PREDICTION:</span>
                <span className="text-zinc-600 dark:text-zinc-300">
                  {summary.predictedNextNode.confidence}% Confidence
                </span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-[11px] mt-0.5">
                Next anticipated sighting:{" "}
                <span className="text-zinc-950 dark:text-yellow-300 font-semibold underline decoration-zinc-400">
                  {summary.predictedNextNode.camera.name}
                </span>{" "}
                in ~{summary.predictedNextNode.etaMinutes} mins.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sequential Node Timeline */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between">
          <span>Sequential Camera Timeline ({points.length} Fixes)</span>
          <span className="text-[10px] text-zinc-500 font-normal">CHRONOLOGICAL ORDER</span>
        </h4>

        <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
          {points.map((point) => {
            const isFirst = point.sequence === 1;
            const isLast = point.sequence === points.length;
            const isSelected = selectedNodeSeq === point.sequence;

            return (
              <div
                key={point.sequence}
                onClick={() => onSelectNode && onSelectNode(point.sequence)}
                className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
                  point.isImpossibleSpeed
                    ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/60 shadow-xs dark:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    : isSelected
                    ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-white shadow-xs dark:shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                    : "bg-white dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs"
                }`}
              >
                {/* Node Sequence Circle on vertical track */}
                <div
                  className={`absolute -left-[27px] top-3.5 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2 ${
                    point.isImpossibleSpeed
                      ? "bg-rose-500 border-rose-300 text-white animate-pulse"
                      : isLast
                      ? "bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-200 dark:border-white dark:text-zinc-950"
                      : "bg-white border-zinc-900 text-zinc-950 dark:bg-white dark:border-zinc-300 dark:text-zinc-950"
                  }`}
                >
                  {point.sequence}
                </div>

                {/* Node Details Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                        {point.camera.id}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        {isFirst ? "ENTRY FIX" : isLast ? "LATEST FIX" : "INTERMEDIATE"}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 mt-0.5">
                      {point.camera.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-zinc-900 dark:text-yellow-400 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-zinc-400 dark:text-slate-400" />
                      <span>{point.detection.timestamp}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 dark:text-slate-400 mt-0.5">
                      Logged: {point.detection.speedKmh} km/h
                    </div>
                  </div>
                </div>

                {/* Spatio-temporal Delta from previous camera */}
                {!isFirst && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-slate-800/80 grid grid-cols-3 gap-1 text-[11px] font-mono">
                    <div>
                      <span className="text-zinc-500 dark:text-slate-400 text-[10px]">Distance (Δd):</span>
                      <div className="text-zinc-800 dark:text-slate-200 font-semibold">{point.distanceFromPrevKm} km</div>
                    </div>
                    <div>
                      <span className="text-zinc-500 dark:text-slate-400 text-[10px]">Elapsed (Δt):</span>
                      <div className="text-zinc-800 dark:text-slate-200 font-semibold">{point.timeFromPrevMin} mins</div>
                    </div>
                    <div>
                      <span className="text-zinc-500 dark:text-slate-400 text-[10px]">Inter-Node Speed:</span>
                      <div
                        className={`font-bold ${
                          point.isImpossibleSpeed
                            ? "text-rose-600 dark:text-rose-400"
                            : point.isSpeedLimitViolated
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {point.speedBetweenKmh.toFixed(1)} km/h
                      </div>
                    </div>
                  </div>
                )}

                {/* Alerts on node */}
                {point.isImpossibleSpeed && (
                  <div className="mt-2 px-2 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-[10px] font-mono text-rose-300 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                    <span>KINEMATIC VIOLATION: IMPOSSIBLE INTER-NODE VELOCITY</span>
                  </div>
                )}
                {point.isSpeedLimitViolated && !point.isImpossibleSpeed && (
                  <div className="mt-2 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>EXPRESSWAY SPEED LIMIT EXCEEDED (93.4 km/h vs 80 km/h)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
