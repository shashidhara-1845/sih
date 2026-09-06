export type VehicleClass = "SUV" | "Sedan" | "Hatchback" | "Truck" | "Motorcycle" | "Bus";

export interface CameraNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zone: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  fps: number;
  resolution: string;
  totalSightingsToday: number;
}

export interface MultiModalScore {
  total: number;
  ocr: number;
  color: number;
  type: number;
  reIdEmbedding: number;
  spatioTemporal: number;
}

export interface RegisteredVehicleProfile {
  plateNumber: string;
  registeredOwner: string;
  registeredMake: string;
  registeredColor: string;
  registeredType: VehicleClass;
  registrationDate: string;
  rtoCode: string;
  status: "CLEAN" | "FLAGGED_THEFT" | "SUSPICIOUS_TRANSFER" | "IMPOUND_ORDER";
}

export interface VehicleDetection {
  id: string;
  plateNumber: string;
  plateConfidence: number;
  isMuddyOrObscured?: boolean;
  vehicleType: VehicleClass;
  color: string;
  colorHex: string;
  makeModel: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  timestampRaw: number;
  speedKmh: number;
  lane: string;
  direction: "Northbound" | "Southbound" | "Eastbound" | "Westbound";
  confidence: MultiModalScore;
  registeredProfile?: RegisteredVehicleProfile;
  isFlagged?: boolean;
  flagReason?: string;
  anomalyType?: "CLONED_PLATE" | "TELEPORTATION" | "MUDDY_PLATE_RESOLVED" | "SPEEDING";
}

export interface TrajectoryPoint {
  sequence: number;
  camera: CameraNode;
  detection: VehicleDetection;
  distanceFromPrevKm: number;
  timeFromPrevMin: number;
  speedBetweenKmh: number;
  isImpossibleSpeed: boolean;
  isSpeedLimitViolated: boolean;
}

export interface VehicleTrajectory {
  plateNumber: string;
  summary: {
    vehicleType: VehicleClass;
    color: string;
    makeModel: string;
    firstSpotted: string;
    lastSpotted: string;
    totalDistanceKm: number;
    totalTimeMin: number;
    avgSpeedKmh: number;
    kinematicValidityScore: number;
    predictedNextNode?: {
      camera: CameraNode;
      confidence: number;
      etaMinutes: number;
    };
  };
  points: TrajectoryPoint[];
}

export interface AnomalyIncident {
  id: string;
  type: "CLONED_PLATE" | "TELEPORTATION" | "MUDDY_PLATE_RESOLVED";
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  plateNumber: string;
  timestamp: string;
  summary: string;
  details: string;
  sightings: VehicleDetection[];
  distanceKm?: number;
  timeDeltaMin?: number;
  calculatedVelocityKmh?: number;
  status: "ACTIVE" | "INVESTIGATING" | "RESOLVED";
  assignedUnit?: string;
}
