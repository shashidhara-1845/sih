"use client";

import React from "react";

interface ConfidenceBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  score,
  size = "md",
  showLabel = true,
}) => {
  // Color styling based on score
  let strokeColor = "#10b981";
  let textColor = "text-emerald-400";
  let badgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let statusText = "VERIFIED MATCH";

  if (score < 65) {
    strokeColor = "#f43f5e";
    textColor = "text-rose-400";
    badgeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/30";
    statusText = "ANOMALY DETECTED";
  } else if (score < 85) {
    strokeColor = "#f59e0b";
    textColor = "text-amber-400";
    badgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    statusText = "PROBABLE MATCH";
  }

  const radius = size === "lg" ? 26 : size === "md" ? 18 : 13;
  const strokeWidth = size === "lg" ? 3.5 : size === "md" ? 3 : 2.2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center">
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span
          className={`absolute font-mono font-bold ${
            size === "lg" ? "text-sm" : size === "md" ? "text-[11px]" : "text-[9px]"
          } ${textColor}`}
        >
          {score.toFixed(0)}%
        </span>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
            Fusion Match
          </span>
          <span className={`text-[10px] font-semibold tracking-wide border px-1.5 py-0.5 rounded ${badgeStyle}`}>
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};
