import { AnomalyIncident } from "../types/vehicle";
import { INITIAL_DETECTIONS } from "./vehicles";

export const INITIAL_ANOMALIES: AnomalyIncident[] = [
  {
    id: "ANOM-2026-001",
    type: "CLONED_PLATE",
    title: "CRITICAL: Cloned License Plate Detected",
    severity: "CRITICAL",
    plateNumber: "DL 01 XY 9999",
    timestamp: "10:22:15 AM",
    summary: "Identical registration plate observed concurrently across 2 distinct vehicles with conflicting visual metadata.",
    details:
      "At 10:14 AM, CAM-02 (Connaught Place) captured a White Maruti Swift Hatchback. At 10:22 AM, CAM-05 (AIIMS South Ex) captured a Black Mahindra Scorpio-N SUV with the exact same plate string 'DL 01 XY 9999'. The visual Re-ID cosine distance is 0.89 and color histogram divergence is 91.2%, proving physical vehicle duplication / counterfeit plate relay.",
    sightings: [
      INITIAL_DETECTIONS[3], // Sighting 1: White Hatchback at Connaught Place
      INITIAL_DETECTIONS[0], // Sighting 2: Black SUV at AIIMS South Ex
    ],
    status: "ACTIVE",
    assignedUnit: "PCR-Delta 14 (South District Interceptor)",
  },
  {
    id: "ANOM-2026-002",
    type: "TELEPORTATION",
    title: "CRITICAL: Spatiotemporal Teleportation Anomaly",
    severity: "CRITICAL",
    plateNumber: "HR 26 DQ 5520",
    timestamp: "10:20:05 AM",
    summary: "Physical velocity violation: Vehicle traversed 52.4 km in 5.0 minutes (calculated 628.8 km/h).",
    details:
      "Plate 'HR 26 DQ 5520' (Hyundai Creta) was logged at CAM-01 (IGI Airport T3) at 10:15:05 AM and subsequently at CAM-10 (Pari Chowk Greater Noida) at 10:20:05 AM. Minimum geodesic road distance is 52.4 km. Kinematic plausibility score dropped to 4.2%. Max legal speed on expressway is 120 km/h.",
    sightings: [
      {
        ...INITIAL_DETECTIONS[2],
        id: "DET-98188",
        cameraId: "CAM-01",
        cameraName: "IGI Airport T3 Departure Flyover",
        timestamp: "10:15:05 AM",
        timestampRaw: Date.now() - 445000,
        speedKmh: 68,
      },
      INITIAL_DETECTIONS[2], // Greater Noida
    ],
    distanceKm: 52.4,
    timeDeltaMin: 5.0,
    calculatedVelocityKmh: 628.8,
    status: "ACTIVE",
    assignedUnit: "Noida Traffic HQ / Flying Squad 3",
  },
  {
    id: "ANOM-2026-003",
    type: "MUDDY_PLATE_RESOLVED",
    title: "RESOLVED: Muddy / Obscured Plate Disambiguated",
    severity: "MEDIUM",
    plateNumber: "MH 12 AB 1234",
    timestamp: "10:21:40 AM",
    summary: "OCR plate reader recorded partial OCR match (44.5%), but visual Re-ID & trajectory pipeline resolved identity with 89.6% confidence.",
    details:
      "Due to heavy road mud/dust on rear plate, raw OCR produced ambiguous character tokens 'MH 12 ?? 1234'. Rather than discarding or failing detection, the Multi-Modal Fusion Engine leveraged 5-point historical trajectory continuity, vehicle color histogram (Deep Ocean Blue), and deep silhouette embeddings to disambiguate the vehicle.",
    sightings: [INITIAL_DETECTIONS[1]],
    status: "RESOLVED",
  },
];
