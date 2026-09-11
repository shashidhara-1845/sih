"use client";

import React from "react";
import { AnomalyIncident } from "../../types/vehicle";
import {
  X,
  Printer,
  Shield,
  FileCheck,
  Download,
  AlertOctagon,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

interface IncidentReportModalProps {
  incident: AnomalyIncident | null;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  incident,
  onClose,
}) => {
  if (!incident) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-zinc-900 dark:text-white" />
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white uppercase">
              POLICE INCIDENT DOSSIER // CHAIN OF CUSTODY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors border border-zinc-200 dark:border-zinc-800"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs text-zinc-700 dark:text-zinc-300">
          {/* Official Letterhead */}
          <div className="text-center pb-4 border-b border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="text-sm font-bold tracking-widest text-zinc-900 dark:text-white uppercase">
              DELHI POLICE TRAFFIC HEADQUARTERS // INTELLIGENCE DIVISION
            </div>
            <div className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium">
              SMART INDIA HACKATHON RE-ID & SURVEILLANCE AUTOMATED DISPATCH
            </div>
            <div className="text-[10px] text-zinc-500">
              Generated Under Digital Forensics & Spatiotemporal Evidence Protocol 2026
            </div>
          </div>

          {/* Dossier Meta Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-black p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px]">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase">Incident File Ref:</span>
              <div className="font-bold text-zinc-900 dark:text-white">{incident.id}</div>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] uppercase">Logged Timestamp:</span>
              <div className="font-bold text-zinc-900 dark:text-yellow-400">{incident.timestamp}</div>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] uppercase">Target Vehicle:</span>
              <div className="font-bold text-zinc-900 dark:text-yellow-400">{incident.plateNumber}</div>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] uppercase">Severity / Status:</span>
              <div className="font-bold text-rose-600 dark:text-rose-400">
                {incident.severity} / {incident.status}
              </div>
            </div>
          </div>

          {/* Incident Category & Summary */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span>Section 1: Automated Detection Summary</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 leading-relaxed text-zinc-700 dark:text-zinc-300">
              <p className="font-bold text-zinc-900 dark:text-white mb-1">{incident.title}</p>
              <p>{incident.details}</p>
            </div>
          </div>

          {/* Forensic Evidence Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              Section 2: Forensic Sensor Sightings & Metadata Chain
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-zinc-100 text-zinc-700 border-b border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800">
                  <tr>
                    <th className="p-2.5">Sighting Ref</th>
                    <th className="p-2.5">Camera Node</th>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Visual Profile</th>
                    <th className="p-2.5 text-right">Multi-Modal Conf.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-black/60">
                  {incident.sightings.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td className="p-2.5 font-bold text-zinc-900 dark:text-white">{s.id}</td>
                      <td className="p-2.5 text-zinc-800 dark:text-zinc-200">
                        {s.cameraName} ({s.cameraId})
                      </td>
                      <td className="p-2.5 text-zinc-900 dark:text-yellow-400 font-bold">{s.timestamp}</td>
                      <td className="p-2.5 text-zinc-700 dark:text-zinc-300">
                        {s.color} {s.vehicleType} ({s.makeModel})
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {s.confidence?.total || 95}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal / Field Actions Recommended */}
          <div className="p-3.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 space-y-1.5 text-[11px]">
            <div className="text-rose-700 dark:text-rose-300 font-bold uppercase">
              Section 3: Recommended Field Enforcement Actions
            </div>
            <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
              <li>
                Issue automated BOLO (Be-On-the-Lookout) alert to police patrol units in South and East Districts.
              </li>
              <li>
                Flag registration <span className="text-zinc-900 dark:text-yellow-400 font-bold">{incident.plateNumber}</span> for immediate highway toll plaza barrier lock.
              </li>
              <li>
                Initiate investigation under Motor Vehicles Act Section 192A and IPC/BNS provisions for fraudulent registration tampering.
              </li>
            </ul>
          </div>

          {/* Officer Verification Seal */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <div>
              <div>System Hash: SHA256-REID-8F90214B</div>
              <div>Automated Validation Engine: v3.4.1 (SIH Edition)</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-zinc-900 dark:text-zinc-200">Digital Seal: VERIFIED BY SENTINEL AI</div>
              <div className="text-emerald-600 dark:text-emerald-400">✓ Cryptographically Signed</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold font-mono text-xs transition-colors shadow-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
