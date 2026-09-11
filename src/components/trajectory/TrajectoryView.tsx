"use client";

import React, { useState, useMemo } from "react";
import { useSimulation } from "../../context/SimulationContext";
import { VehicleSearch } from "./VehicleSearch";
import { MapContainer } from "./MapContainer";
import { TrajectoryTimeline } from "./TrajectoryTimeline";
import { MOCK_TRAJECTORIES } from "../../mock/vehicles";
import { CITY_CAMERAS } from "../../mock/cameras";
import { VehicleTrajectory, TrajectoryPoint, VehicleDetection } from "../../types/vehicle";
import { Layers, ShieldAlert, Navigation } from "lucide-react";

export const TrajectoryView: React.FC = () => {
  const {
    selectedPlateForTrajectory,
    setSelectedPlateForTrajectory,
    detections,
  } = useSimulation();

  const [selectedNodeSeq, setSelectedNodeSeq] = useState<number | undefined>(undefined);

  // Retrieve or generate trajectory for the selected plate
  const activeTrajectory: VehicleTrajectory = useMemo(() => {
    const plate = selectedPlateForTrajectory || "MH 12 AB 1234";

    // Check if pre-configured
    if (MOCK_TRAJECTORIES[plate]) {
      return MOCK_TRAJECTORIES[plate];
    }

    // Find any sightings in current detection feed
    const matchingSightings = detections.filter((d) => d.plateNumber === plate);
    const baseDetection: VehicleDetection = matchingSightings[0] || {
      id: "DET-GEN",
      plateNumber: plate,
      plateConfidence: 95.5,
      vehicleType: "SUV",
      color: "Deep Ocean Blue",
      colorHex: "#1e3a8a",
      makeModel: "Mahindra Scorpio-N",
      cameraId: "CAM-01",
      cameraName: CITY_CAMERAS[0].name,
      timestamp: "10:15:00 AM",
      timestampRaw: Date.now(),
      speedKmh: 58,
      lane: "Lane 1",
      direction: "Eastbound",
      confidence: {
        total: 94.2,
        ocr: 95.5,
        color: 94.0,
        type: 96.0,
        reIdEmbedding: 93.0,
        spatioTemporal: 95.0,
      },
    };

    // Dynamically synthesize a 4-node trajectory across cameras
    const cameras = [CITY_CAMERAS[1], CITY_CAMERAS[2], CITY_CAMERAS[4], CITY_CAMERAS[6]];
    const points: TrajectoryPoint[] = cameras.map((cam, i) => {
      const minAgo = (cameras.length - 1 - i) * 11;
      const t = new Date(Date.now() - minAgo * 60000);
      const timeStr = t.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      return {
        sequence: i + 1,
        camera: cam,
        detection: {
          ...baseDetection,
          cameraId: cam.id,
          cameraName: cam.name,
          timestamp: timeStr,
          speedKmh: Math.floor(Math.random() * 25 + 45),
        },
        distanceFromPrevKm: i === 0 ? 0 : Number((Math.random() * 6 + 4).toFixed(1)),
        timeFromPrevMin: i === 0 ? 0 : 11,
        speedBetweenKmh: i === 0 ? 55 : Number((Math.random() * 20 + 40).toFixed(1)),
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      };
    });

    return {
      plateNumber: plate,
      summary: {
        vehicleType: baseDetection.vehicleType,
        color: baseDetection.color,
        makeModel: baseDetection.makeModel,
        firstSpotted: points[0].detection.timestamp,
        lastSpotted: points[points.length - 1].detection.timestamp,
        totalDistanceKm: 24.8,
        totalTimeMin: 33,
        avgSpeedKmh: 45.1,
        kinematicValidityScore: 96.5,
        predictedNextNode: {
          camera: CITY_CAMERAS[7],
          confidence: 91.0,
          etaMinutes: 8.5,
        },
      },
      points,
    };
  }, [selectedPlateForTrajectory, detections]);

  return (
    <div className="space-y-4">
      {/* Plate Search & Target Selector */}
      <VehicleSearch
        currentPlate={selectedPlateForTrajectory}
        onSearchPlate={(plate) => {
          setSelectedPlateForTrajectory(plate);
          setSelectedNodeSeq(undefined);
        }}
      />

      {/* Main Grid: Interactive Map + Sequential Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Interactive GIS Map (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <MapContainer
            trajectory={activeTrajectory}
            onSelectNode={(seq) => setSelectedNodeSeq(seq)}
          />

          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-white" />
              <span>
                Surveillance Corridors: <span className="text-zinc-200">Delhi-NCR Ring Road / DND Expressway</span>
              </span>
            </div>
            <div className="text-zinc-300 font-semibold">
              Live Path Interpolation: KALMAN FILTER ACTIVE
            </div>
          </div>
        </div>

        {/* Spatiotemporal Timeline (4 cols) */}
        <div className="lg:col-span-4">
          <TrajectoryTimeline
            trajectory={activeTrajectory}
            selectedNodeSeq={selectedNodeSeq}
            onSelectNode={(seq) => setSelectedNodeSeq(seq)}
          />
        </div>
      </div>
    </div>
  );
};
