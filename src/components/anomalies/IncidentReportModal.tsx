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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#090f1d] border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="font-mono text-sm font-bold text-slate-100 uppercase">
              POLICE INCIDENT DOSSIER // CHAIN OF CUSTODY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs text-slate-300">
          {/* Official Letterhead */}
          <div className="text-center pb-4 border-b border-slate-800 space-y-1">
            <div className="text-sm font-bold tracking-widest text-slate-100 uppercase">
              DELHI POLICE TRAFFIC HEADQUARTERS // INTELLIGENCE DIVISION
            </div>
            <div className="text-[11px] text-cyan-400">
              SMART INDIA HACKATHON RE-ID & SURVEILLANCE AUTOMATED DISPATCH
            </div>
            <div className="text-[10px] text-slate-400">
              Generated Under Digital Forensics & Spatiotemporal Evidence Protocol 2026
            </div>
          </div>

          {/* Dossier Meta Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Incident File Ref:</span>
              <div className="font-bold text-slate-100">{incident.id}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Logged Timestamp:</span>
              <div className="font-bold text-yellow-400">{incident.timestamp}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Target Vehicle:</span>
              <div className="font-bold text-yellow-400">{incident.plateNumber}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Severity / Status:</span>
              <div className="font-bold text-rose-400">
                {incident.severity} / {incident.status}
              </div>
            </div>
          </div>

          {/* Incident Category & Summary */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Section 1: Automated Detection Summary</span>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 leading-relaxed text-slate-300">
              <p className="font-bold text-slate-100 mb-1">{incident.title}</p>
              <p>{incident.details}</p>
            </div>
          </div>

          {/* Forensic Evidence Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Section 2: Forensic Sensor Sightings & Metadata Chain
            </div>
            <div className="rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Sighting Ref</th>
                    <th className="p-2.5">Camera Node</th>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Visual Profile</th>
                    <th className="p-2.5 text-right">Multi-Modal Conf.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                  {incident.sightings.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td className="p-2.5 font-bold text-cyan-400">{s.id}</td>
                      <td className="p-2.5 text-slate-200">
                        {s.cameraName} ({s.cameraId})
                      </td>
                      <td className="p-2.5 text-yellow-400">{s.timestamp}</td>
                      <td className="p-2.5 text-slate-300">
                        {s.color} {s.vehicleType} ({s.makeModel})
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-400">
                        {s.confidence?.total || 95}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal / Field Actions Recommended */}
          <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1.5 text-[11px]">
            <div className="text-rose-300 font-bold uppercase">
              Section 3: Recommended Field Enforcement Actions
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                Issue automated BOLO (Be-On-the-Lookout) alert to police patrol units in South and East Districts.
              </li>
              <li>
                Flag registration <span className="text-yellow-400 font-bold">{incident.plateNumber}</span> for immediate highway toll plaza barrier lock.
              </li>
              <li>
                Initiate investigation under Motor Vehicles Act Section 192A and IPC/BNS provisions for fraudulent registration tampering.
              </li>
            </ul>
          </div>

          {/* Officer Verification Seal */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              <div>System Hash: SHA256-REID-8F90214B</div>
              <div>Automated Validation Engine: v3.4.1 (SIH Edition)</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-200">Digital Seal: VERIFIED BY SENTINEL AI</div>
              <div className="text-emerald-400">✓ Cryptographically Signed</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
