"use client";

import React from "react";
import { VehicleClass } from "../../types/vehicle";
import { HsrpPlate } from "./HsrpPlate";

interface VehicleThumbnailProps {
  vehicleType: VehicleClass;
  colorHex: string;
  colorName: string;
  plateNumber: string;
  cameraId: string;
  timestamp: string;
  isMuddyOrObscured?: boolean;
  className?: string;
  showOverlay?: boolean;
}

export const VehicleThumbnail: React.FC<VehicleThumbnailProps> = ({
  vehicleType,
  colorHex,
  colorName,
  plateNumber,
  cameraId,
  timestamp,
  isMuddyOrObscured = false,
  className = "w-full h-40",
  showOverlay = true,
}) => {
  // Realistic vehicle front-quarter wire/shading rendering
  const renderRealisticVehicle = () => {
    switch (vehicleType) {
      case "SUV":
        return (
          <g className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
            {/* Ground Ambient Occlusion */}
            <ellipse cx="140" cy="108" rx="85" ry="14" fill="rgba(0,0,0,0.85)" />
            {/* Wheels */}
            <ellipse cx="78" cy="102" rx="16" ry="18" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
            <ellipse cx="78" cy="102" rx="8" ry="10" fill="#334155" />
            <ellipse cx="198" cy="102" rx="16" ry="18" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
            <ellipse cx="198" cy="102" rx="8" ry="10" fill="#334155" />
            {/* SUV Heavy Chassis */}
            <path
              d="M 52 96 L 56 68 L 92 52 L 180 52 L 216 66 L 226 94 L 218 104 L 182 104 L 176 96 L 98 96 L 92 104 L 58 104 Z"
              fill={colorHex}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
            />
            {/* Roof Rails */}
            <line x1="98" y1="48" x2="176" y2="48" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            {/* Windshield with polarized glass gradient */}
            <path d="M 94 54 L 178 54 L 196 68 L 74 68 Z" fill="url(#windshieldGrad)" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.6" />
            {/* Chrome Front Grill */}
            <path d="M 54 74 L 72 74 L 70 90 L 54 88 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
            {/* Headlights with volumetric LED glow */}
            <polygon points="52,70 64,70 62,78 52,76" fill="#fef08a" opacity="0.9" />
            <polygon points="214,70 224,70 224,76 216,78" fill="#fef08a" opacity="0.9" />
            {/* Headlight Beams illuminating road */}
            <polygon points="52,74 0,60 0,110 52,78" fill="url(#headlightBeam)" opacity="0.45" />
          </g>
        );
      case "Hatchback":
        return (
          <g className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
            <ellipse cx="135" cy="108" rx="80" ry="12" fill="rgba(0,0,0,0.85)" />
            <ellipse cx="76" cy="103" rx="14" ry="16" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <ellipse cx="76" cy="103" rx="7" ry="9" fill="#334155" />
            <ellipse cx="192" cy="103" rx="14" ry="16" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <ellipse cx="192" cy="103" rx="7" ry="9" fill="#334155" />
            {/* Hatchback Compact Aero Body */}
            <path
              d="M 54 96 L 60 72 L 96 56 L 158 56 L 202 70 L 214 96 L 206 104 L 176 104 L 172 96 L 96 96 L 92 104 L 60 104 Z"
              fill={colorHex}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
            />
            <path d="M 98 58 L 156 58 L 178 70 L 76 70 Z" fill="url(#windshieldGrad)" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />
            <polygon points="54,72 66,72 64,80 54,78" fill="#fef08a" opacity="0.9" />
            <polygon points="54,76 0,64 0,110 54,80" fill="url(#headlightBeam)" opacity="0.4" />
          </g>
        );
      case "Sedan":
      default:
        return (
          <g className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
            <ellipse cx="138" cy="108" rx="85" ry="12" fill="rgba(0,0,0,0.85)" />
            <ellipse cx="74" cy="103" rx="14" ry="16" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <ellipse cx="74" cy="103" rx="7" ry="9" fill="#334155" />
            <ellipse cx="196" cy="103" rx="14" ry="16" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <ellipse cx="196" cy="103" rx="7" ry="9" fill="#334155" />
            {/* Sleek Long Sedan Body */}
            <path
              d="M 46 96 L 54 74 L 84 70 L 108 55 L 168 55 L 194 70 L 222 76 L 226 96 L 214 104 L 180 104 L 176 96 L 94 96 L 90 104 L 52 104 Z"
              fill={colorHex}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
            />
            <path d="M 110 57 L 166 57 L 184 70 L 92 70 Z" fill="url(#windshieldGrad)" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />
            <polygon points="46,74 58,74 56,82 46,80" fill="#fef08a" opacity="0.9" />
            <polygon points="46,78 0,66 0,110 46,82" fill="url(#headlightBeam)" opacity="0.4" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-[#02050e] border border-white/[0.09] select-none ${className}`}
    >
      {/* CCTV Lens Vignette & Realistic Asphalt Road Perspective */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#091122] to-[#040817]" />
      
      {/* Perspective Highway Lane Markings */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-dashed border-r border-dashed border-white/40 rotate-[12deg] origin-top" />
        <div className="absolute right-1/4 top-0 bottom-0 w-0.5 bg-dashed border-r border-dashed border-white/40 -rotate-[12deg] origin-top" />
      </div>

      {/* CCTV CRT Scanlines & Optical Vignette */}
      <div className="absolute inset-0 cctv-scanline opacity-25 pointer-events-none" />
      <div className="absolute inset-0 cctv-vignette pointer-events-none" />

      {/* AI Detection Crosshairs & Bounding Box */}
      <div className="absolute inset-3 border border-cyan-500/40 rounded pointer-events-none transition-all duration-300">
        {/* Precision Corner Reticles */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* AI Tag on top of bounding box */}
        <div className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-500/60 text-[9px] font-mono text-cyan-300 font-bold tracking-tight">
          AI FIX: {vehicleType} [98.2%]
        </div>
      </div>

      {/* Center: Realistic Vehicle SVG with automotive lighting gradients */}
      <div className="relative w-full h-full flex items-center justify-center pt-2">
        <svg viewBox="0 0 280 130" className="w-full h-full">
          <defs>
            <linearGradient id="windshieldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="headlightBeam" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {renderRealisticVehicle()}
        </svg>
      </div>

      {/* Official Indian HSRP License Plate Mounted on Bumper */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
        <HsrpPlate
          plateNumber={plateNumber}
          isMuddyOrObscured={isMuddyOrObscured}
          size="sm"
        />
      </div>

      {/* High-Tech CCTV Camera Telemetry Overlay */}
      {showOverlay && (
        <>
          {/* Top Telemetry */}
          <div className="absolute top-1.5 left-2.5 flex items-center gap-2 text-[9px] font-mono text-cyan-300/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold">{cameraId}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">85mm f/1.4</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">60 FPS</span>
          </div>

          <div className="absolute top-1.5 right-2.5 text-[9px] font-mono text-slate-400 font-medium">
            {timestamp}:24
          </div>

          {/* Bottom Coordinates & Optical Spec */}
          <div className="absolute bottom-1.5 left-2.5 text-[8px] font-mono text-slate-400 opacity-75 hidden sm:block">
            LAT 28.5684° N • LNG 77.2144° E
          </div>
        </>
      )}
    </div>
  );
};
