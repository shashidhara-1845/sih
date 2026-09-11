"use client";

import React from "react";

interface HsrpPlateProps {
  plateNumber: string;
  isMuddyOrObscured?: boolean;
  size?: "sm" | "md" | "lg";
  isCommercial?: boolean;
  className?: string;
}

export const HsrpPlate: React.FC<HsrpPlateProps> = ({
  plateNumber,
  isMuddyOrObscured = false,
  size = "md",
  isCommercial = false,
  className = "",
}) => {
  // Dimension styles
  const sizeStyles = {
    sm: "h-6 text-[10px] px-1",
    md: "h-8 text-xs px-1.5",
    lg: "h-10 text-sm px-2",
  };

  const rivetSize = size === "lg" ? "w-2 h-2" : size === "md" ? "w-1.5 h-1.5" : "w-1 h-1";

  return (
    <div
      className={`relative inline-flex items-center rounded-sm font-mono font-black select-none overflow-hidden shadow-md border-2 border-slate-900 ${
        isCommercial
          ? "bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 text-slate-950"
          : "bg-gradient-to-b from-slate-100 via-white to-slate-200 text-slate-950"
      } ${sizeStyles[size]} ${className}`}
      style={{
        boxShadow: "0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.2)",
      }}
    >
      {/* Corner Rivet Screws */}
      <div className={`absolute top-0.5 left-0.5 ${rivetSize} rounded-full bg-slate-400 border border-slate-600 shadow-inner`} />
      <div className={`absolute top-0.5 right-0.5 ${rivetSize} rounded-full bg-slate-400 border border-slate-600 shadow-inner`} />

      {/* Authentic Blue Left IND Strip */}
      <div className="h-full bg-[#003893] px-1.5 flex flex-col items-center justify-center -ml-1.5 mr-2 text-white border-r border-slate-800/40">
        {/* Ashoka Chakra Hologram Symbol */}
        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-sky-200 animate-spin-slow">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <path d="M 12 3 L 12 21 M 3 12 L 21 12 M 5.6 5.6 L 18.4 18.4 M 5.6 18.4 L 18.4 5.6" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="text-[7px] font-black tracking-tighter leading-none mt-0.5 text-white/90">
          IND
        </span>
      </div>

      {/* Embossed Registration Plate Characters */}
      <div className="relative flex items-center tracking-widest font-black pr-1">
        {isMuddyOrObscured ? (
          <div className="relative">
            <span className="tracking-widest">
              {plateNumber.slice(0, 5)}
              <span className="text-slate-500 blur-[1px]">??</span>
              {plateNumber.slice(-4)}
            </span>
            {/* Road mud splatter graphic overlay */}
            <div
              className="absolute inset-0 bg-amber-950/60 mix-blend-multiply pointer-events-none rounded"
              style={{
                backgroundImage: "radial-gradient(circle at 55% 45%, #78350f 0%, #451a03 40%, transparent 70%)",
                opacity: 0.85,
              }}
            />
          </div>
        ) : (
          <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {plateNumber}
          </span>
        )}
      </div>

      {/* Muddy Plate Label Badge if obscured */}
      {isMuddyOrObscured && (
        <span className="ml-1 text-[8px] font-sans font-bold bg-amber-800 text-amber-200 px-1 py-0.2 rounded uppercase">
          MUD
        </span>
      )}
    </div>
  );
};
