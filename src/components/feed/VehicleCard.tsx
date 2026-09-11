"use client";

import React from "react";
import { VehicleDetection } from "../../types/vehicle";
import { VehicleThumbnail } from "../common/VehicleThumbnail";
import { ConfidenceBadge } from "../common/ConfidenceBadge";
import { HsrpPlate } from "../common/HsrpPlate";
import { useSimulation } from "../../context/SimulationContext";
import {
  MapPin,
  Clock,
  Gauge,
  Compass,
  AlertCircle,
  ArrowUpRight,
  Cpu,
} from "lucide-react";

interface VehicleCardProps {
  detection: VehicleDetection;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ detection }) => {
  const { setSelectedDetectionForModal, trackVehicle } = useSimulation();

  return (
    <div
      onClick={() => setSelectedDetectionForModal(detection)}
      className={`group relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
        detection.isFlagged
          ? "bg-[#18080c]/85 border-rose-500/40 hover:border-rose-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]"
          : "bg-zinc-950/80 border-zinc-800/80 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.07)]"
      }`}
    >
      {/* Flagged Anomaly Alert Banner Strip */}
      {detection.isFlagged && (
        <div className="bg-rose-500 text-white text-[10px] font-mono font-bold px-3 py-1 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-1.5 truncate">
            <AlertCircle className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="truncate">{detection.flagReason || "ANOMALY DETECTED"}</span>
          </div>
          <span className="text-[9px] uppercase px-1.5 py-0.2 bg-black/40 rounded font-black tracking-wider">
            PRIORITY
          </span>
        </div>
      )}

      {/* CCTV Camera Capture Thumbnail */}
      <div className="p-3 pb-2">
        <VehicleThumbnail
          vehicleType={detection.vehicleType}
          colorHex={detection.colorHex}
          colorName={detection.color}
          plateNumber={detection.plateNumber}
          cameraId={detection.cameraId}
          timestamp={detection.timestamp}
          isMuddyOrObscured={detection.isMuddyOrObscured}
        />
      </div>

      {/* Card Body */}
      <div className="px-3.5 pb-3 space-y-3">
        {/* Top: HSRP Plate & Multi-modal Confidence */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <HsrpPlate
              plateNumber={detection.plateNumber}
              isMuddyOrObscured={detection.isMuddyOrObscured}
              size="md"
            />
            <div className="text-xs font-semibold text-zinc-200 mt-1.5 flex items-center gap-1.5">
              <span>{detection.makeModel}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 font-normal">{detection.vehicleType}</span>
            </div>
          </div>

          <ConfidenceBadge score={detection.confidence.total} size="md" showLabel={false} />
        </div>

        {/* Location & Speed Meta Strip */}
        <div className="py-2 border-y border-white/[0.06] grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            <span className="truncate text-zinc-200 font-medium" title={detection.cameraName}>
              {detection.cameraName.split(" ")[0]} ({detection.cameraId})
            </span>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="text-zinc-300">{detection.timestamp}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="text-zinc-200 font-medium">{detection.speedKmh} km/h</span>
            <span className="text-[10px] text-zinc-500">({detection.lane})</span>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <Compass className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="text-zinc-300">{detection.direction}</span>
          </div>
        </div>

        {/* Multi-modal Fusion Breakdown */}
        <div className="bg-black/60 rounded-lg p-2.5 border border-white/[0.06] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400 font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3 text-white" />
              <span>Multi-Modal Fusion</span>
            </span>
            <span className="text-white font-bold">{detection.confidence.total}%</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono">
            <div className="flex flex-col">
              <span className="text-zinc-400">OCR</span>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden mt-0.5">
                <div className="h-full bg-white rounded-full" style={{ width: `${detection.confidence.ocr}%` }} />
              </div>
              <span className="text-zinc-300 font-semibold mt-0.5">{detection.confidence.ocr}%</span>
            </div>

            <div className="flex flex-col">
              <span className="text-zinc-400">Re-ID</span>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden mt-0.5">
                <div
                  className={`h-full rounded-full ${
                    detection.confidence.reIdEmbedding < 60 ? "bg-rose-500" : "bg-zinc-200"
                  }`}
                  style={{ width: `${detection.confidence.reIdEmbedding}%` }}
                />
              </div>
              <span className="text-zinc-300 font-semibold mt-0.5">{detection.confidence.reIdEmbedding}%</span>
            </div>

            <div className="flex flex-col">
              <span className="text-zinc-400">Color</span>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden mt-0.5">
                <div
                  className={`h-full rounded-full ${
                    detection.confidence.color < 60 ? "bg-rose-500" : "bg-zinc-300"
                  }`}
                  style={{ width: `${detection.confidence.color}%` }}
                />
              </div>
              <span className="text-zinc-300 font-semibold mt-0.5">{detection.confidence.color}%</span>
            </div>

            <div className="flex flex-col">
              <span className="text-zinc-400">Kinematics</span>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden mt-0.5">
                <div
                  className={`h-full rounded-full ${
                    detection.confidence.spatioTemporal < 60 ? "bg-rose-500" : "bg-zinc-400"
                  }`}
                  style={{ width: `${detection.confidence.spatioTemporal}%` }}
                />
              </div>
              <span className="text-zinc-300 font-semibold mt-0.5">{detection.confidence.spatioTemporal}%</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDetectionForModal(detection);
            }}
            className="flex-1 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium transition-all text-center border border-zinc-700/80"
          >
            Inspect Forensic Score
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              trackVehicle(detection.plateNumber);
            }}
            className="px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 border border-white text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm"
            title="Track Route on GIS Map"
          >
            <span>Track</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
