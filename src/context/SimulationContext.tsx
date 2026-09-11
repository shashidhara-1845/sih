"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { VehicleDetection, AnomalyIncident } from "../types/vehicle";
import { INITIAL_DETECTIONS, generateRandomDetection } from "../mock/vehicles";
import { INITIAL_ANOMALIES } from "../mock/anomalies";
import { CITY_CAMERAS } from "../mock/cameras";
import { RedAlertCacheService, CachedSuspect } from "../services/cacheService";

export type DashboardView = "feed" | "trajectory" | "anomalies" | "analytics";

interface SimulationContextType {
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  toggleSimulation: () => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  detections: VehicleDetection[];
  anomalies: AnomalyIncident[];
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  selectedPlateForTrajectory: string;
  setSelectedPlateForTrajectory: (plate: string) => void;
  selectedDetectionForModal: VehicleDetection | null;
  setSelectedDetectionForModal: (detection: VehicleDetection | null) => void;
  trackVehicle: (plateNumber: string) => void;
  injectAnomaly: (type: "CLONED" | "TELEPORT") => void;
  acknowledgeAnomaly: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  totalSightingsCount: number;
  criticalAlertsCount: number;
  activeRedAlert: { suspect: CachedSuspect; detection: VehicleDetection } | null;
  dismissRedAlert: () => void;
  isHotCacheDrawerOpen: boolean;
  setIsHotCacheDrawerOpen: (open: boolean) => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  toggleTheme: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [detections, setDetections] = useState<VehicleDetection[]>(INITIAL_DETECTIONS);
  const [anomalies, setAnomalies] = useState<AnomalyIncident[]>(INITIAL_ANOMALIES);
  const [activeView, setActiveView] = useState<DashboardView>("feed");
  const [selectedPlateForTrajectory, setSelectedPlateForTrajectory] = useState<string>("MH 12 AB 1234");
  const [selectedDetectionForModal, setSelectedDetectionForModal] = useState<VehicleDetection | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [totalSightingsCount, setTotalSightingsCount] = useState<number>(248912);
  const [activeRedAlert, setActiveRedAlert] = useState<{
    suspect: CachedSuspect;
    detection: VehicleDetection;
  } | null>(null);
  const [isHotCacheDrawerOpen, setIsHotCacheDrawerOpen] = useState<boolean>(false);

  // Initialize theme from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sentinel_theme") as "dark" | "light" | null;
      if (saved) {
        setTheme(saved);
      }
    } catch {}
  }, []);

  // Sync theme with HTML class and body
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
        document.body.style.backgroundColor = "#000000";
        document.body.style.color = "#f4f4f5";
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
        document.body.style.backgroundColor = "#f8fafc";
        document.body.style.color = "#09090b";
      }
      try {
        localStorage.setItem("sentinel_theme", theme);
      } catch {}
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const toggleSimulation = () => setIsSimulating((prev) => !prev);
  const dismissRedAlert = () => setActiveRedAlert(null);

  // Play audio ping on critical alerts if enabled
  const playAlertSound = useCallback((frequency: number = 880) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.6, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio context may be blocked prior to user interaction
    }
  }, [soundEnabled]);

  // Real-time detection generator interval with O(1) Hot Cache checking
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(800, 3000 / simulationSpeed);
    const interval = setInterval(() => {
      const newDetection = generateRandomDetection();

      // 1. O(1) Check against Hot Cache Watchlist
      const suspectMatch = RedAlertCacheService.checkSuspectMatch(newDetection.plateNumber);
      if (suspectMatch) {
        suspectMatch.lastInterceptedCamera = newDetection.cameraName;
        suspectMatch.lastInterceptedTime = newDetection.timestamp;
        setActiveRedAlert({ suspect: suspectMatch, detection: newDetection });
        playAlertSound(1150);
      }

      // 2. Record sighting in sliding window kinematics cache
      const cam = CITY_CAMERAS.find((c) => c.id === newDetection.cameraId) || CITY_CAMERAS[0];
      RedAlertCacheService.recordSighting({
        plateNumber: newDetection.plateNumber,
        cameraId: newDetection.cameraId,
        cameraName: newDetection.cameraName,
        lat: cam.lat,
        lng: cam.lng,
        timestampRaw: newDetection.timestampRaw,
        timestampFormatted: newDetection.timestamp,
        speedKmh: newDetection.speedKmh,
        vehicleType: newDetection.vehicleType,
        color: newDetection.color,
        makeModel: newDetection.makeModel,
      });

      setDetections((prev) => [newDetection, ...prev.slice(0, 49)]);
      setTotalSightingsCount((c) => c + 1);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, playAlertSound]);

  const trackVehicle = (plateNumber: string) => {
    setSelectedPlateForTrajectory(plateNumber);
    setActiveView("trajectory");
  };

  const acknowledgeAnomaly = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === "ACTIVE" ? "INVESTIGATING" : "RESOLVED" } : a))
    );
  };

  const injectAnomaly = (type: "CLONED" | "TELEPORT") => {
    playAlertSound(1250);
    const nowStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    if (type === "CLONED") {
      const plate = "DL 01 XY 9999";
      const cam1 = CITY_CAMERAS[1]; // Connaught Place
      const cam2 = CITY_CAMERAS[4]; // AIIMS South Ex

      const sightingA: VehicleDetection = {
        id: `DET-INJ-${Date.now()}-A`,
        plateNumber: plate,
        plateConfidence: 98.2,
        vehicleType: "Hatchback",
        color: "Pearl White",
        colorHex: "#f8fafc",
        makeModel: "Maruti Suzuki Swift",
        cameraId: cam1.id,
        cameraName: cam1.name,
        timestamp: nowStr,
        timestampRaw: Date.now(),
        speedKmh: 45,
        lane: "Lane 1",
        direction: "Northbound",
        confidence: {
          total: 96.4,
          ocr: 98.2,
          color: 96.0,
          type: 98.0,
          reIdEmbedding: 95.0,
          spatioTemporal: 96.0,
        },
        isFlagged: true,
        flagReason: "MATCH: Registered Owner Vehicle Profile",
        anomalyType: "CLONED_PLATE",
      };

      const sightingB: VehicleDetection = {
        id: `DET-INJ-${Date.now()}-B`,
        plateNumber: plate,
        plateConfidence: 98.7,
        vehicleType: "SUV",
        color: "Midnight Black",
        colorHex: "#0f172a",
        makeModel: "Mahindra Scorpio-N",
        cameraId: cam2.id,
        cameraName: cam2.name,
        timestamp: nowStr,
        timestampRaw: Date.now() + 1000,
        speedKmh: 68,
        lane: "Lane 2",
        direction: "Southbound",
        confidence: {
          total: 48.3,
          ocr: 98.7,
          color: 18.0,
          type: 38.0,
          reIdEmbedding: 32.0,
          spatioTemporal: 84.0,
        },
        isFlagged: true,
        flagReason: "CRITICAL: Counterfeit/Cloned Plate Detected in Real-time",
        anomalyType: "CLONED_PLATE",
      };

      setDetections((prev) => [sightingB, sightingA, ...prev.slice(0, 48)]);

      // Check Hot Cache and trigger Red Alert Banner
      const suspectMatch = RedAlertCacheService.checkSuspectMatch(plate);
      if (suspectMatch) {
        suspectMatch.lastInterceptedCamera = cam2.name;
        suspectMatch.lastInterceptedTime = nowStr;
        setActiveRedAlert({ suspect: suspectMatch, detection: sightingB });
      }

      const newAnomaly: AnomalyIncident = {
        id: `ANOM-LIVE-${Date.now().toString().slice(-4)}`,
        type: "CLONED_PLATE",
        title: "CRITICAL: Live Cloned Plate Intercepted",
        severity: "CRITICAL",
        plateNumber: plate,
        timestamp: nowStr,
        summary: `Simultaneous detection of identical plate '${plate}' with divergent vehicle silhouettes (White Hatchback vs Black SUV).`,
        details: `Real-time Deep Re-ID embedding divergence measured at 91.8%. Visual classification triggered high-priority alarm at ${cam2.name}.`,
        sightings: [sightingA, sightingB],
        status: "ACTIVE",
        assignedUnit: "PCR-Delta 14 (Fast Response)",
      };

      setAnomalies((prev) => [newAnomaly, ...prev]);
    } else {
      const plate = "HR 26 DQ 5520";
      const camStart = CITY_CAMERAS[0]; // IGI Airport
      const camEnd = CITY_CAMERAS[9];   // Pari Chowk Greater Noida (52km away!)

      const sightingStart: VehicleDetection = {
        id: `DET-INJ-${Date.now()}-T1`,
        plateNumber: plate,
        plateConfidence: 99.4,
        vehicleType: "SUV",
        color: "Midnight Black",
        colorHex: "#0f172a",
        makeModel: "Hyundai Creta SX",
        cameraId: camStart.id,
        cameraName: camStart.name,
        timestamp: nowStr,
        timestampRaw: Date.now() - 300000,
        speedKmh: 64,
        lane: "Lane 2",
        direction: "Eastbound",
        confidence: {
          total: 97.2,
          ocr: 99.4,
          color: 96.0,
          type: 98.0,
          reIdEmbedding: 96.5,
          spatioTemporal: 97.0,
        },
        isFlagged: false,
      };

      const sightingTeleport: VehicleDetection = {
        id: `DET-INJ-${Date.now()}-T2`,
        plateNumber: plate,
        plateConfidence: 99.0,
        vehicleType: "SUV",
        color: "Midnight Black",
        colorHex: "#0f172a",
        makeModel: "Hyundai Creta SX",
        cameraId: camEnd.id,
        cameraName: camEnd.name,
        timestamp: nowStr,
        timestampRaw: Date.now(),
        speedKmh: 75,
        lane: "Lane 3",
        direction: "Eastbound",
        confidence: {
          total: 39.8,
          ocr: 99.0,
          color: 94.0,
          type: 96.0,
          reIdEmbedding: 95.0,
          spatioTemporal: 3.5,
        },
        isFlagged: true,
        flagReason: "CRITICAL: Teleportation Velocity Violation (628 km/h)",
        anomalyType: "TELEPORTATION",
      };

      setDetections((prev) => [sightingTeleport, ...prev.slice(0, 49)]);

      const suspectMatch = RedAlertCacheService.checkSuspectMatch(plate);
      if (suspectMatch) {
        suspectMatch.lastInterceptedCamera = camEnd.name;
        suspectMatch.lastInterceptedTime = nowStr;
        setActiveRedAlert({ suspect: suspectMatch, detection: sightingTeleport });
      }

      const newAnomaly: AnomalyIncident = {
        id: `ANOM-LIVE-${Date.now().toString().slice(-4)}`,
        type: "TELEPORTATION",
        title: "CRITICAL: Live Teleportation Kinematic Anomaly",
        severity: "CRITICAL",
        plateNumber: plate,
        timestamp: nowStr,
        summary: `Vehicle traversed 52.4 km in 5 minutes (calculated 628.8 km/h across highway nodes).`,
        details: `Kinematic engine flagged physics violation between ${camStart.name} and ${camEnd.name}. Spatio-temporal plausibility score collapsed to 3.5%.`,
        sightings: [sightingStart, sightingTeleport],
        distanceKm: 52.4,
        timeDeltaMin: 5.0,
        calculatedVelocityKmh: 628.8,
        status: "ACTIVE",
        assignedUnit: "Noida Highway Flying Squad 02",
      };

      setAnomalies((prev) => [newAnomaly, ...prev]);
    }
  };

  const criticalAlertsCount = anomalies.filter((a) => a.severity === "CRITICAL" && a.status === "ACTIVE").length;

  return (
    <SimulationContext.Provider
      value={{
        isSimulating,
        setIsSimulating,
        toggleSimulation,
        simulationSpeed,
        setSimulationSpeed,
        detections,
        anomalies,
        activeView,
        setActiveView,
        selectedPlateForTrajectory,
        setSelectedPlateForTrajectory,
        selectedDetectionForModal,
        setSelectedDetectionForModal,
        trackVehicle,
        injectAnomaly,
        acknowledgeAnomaly,
        soundEnabled,
        setSoundEnabled,
        totalSightingsCount,
        criticalAlertsCount,
        activeRedAlert,
        dismissRedAlert,
        isHotCacheDrawerOpen,
        setIsHotCacheDrawerOpen,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
