import { VehicleDetection, VehicleTrajectory, RegisteredVehicleProfile, VehicleClass } from "../types/vehicle";
import { CITY_CAMERAS, getCameraById } from "./cameras";

export const REGISTERED_DATABASE: Record<string, RegisteredVehicleProfile> = {
  "DL 01 XY 9999": {
    plateNumber: "DL 01 XY 9999",
    registeredOwner: "Vikramaditya Oberoi",
    registeredMake: "Maruti Suzuki Swift",
    registeredColor: "Pearl White",
    registeredType: "Hatchback",
    registrationDate: "2021-08-14",
    rtoCode: "DL-01 (Mall Road, North Delhi)",
    status: "FLAGGED_THEFT",
  },
  "MH 12 AB 1234": {
    plateNumber: "MH 12 AB 1234",
    registeredOwner: "Rajesh Shinde",
    registeredMake: "Mahindra Scorpio-N",
    registeredColor: "Deep Ocean Blue",
    registeredType: "SUV",
    registrationDate: "2022-11-03",
    rtoCode: "MH-12 (Pune Central)",
    status: "CLEAN",
  },
  "HR 26 DQ 5520": {
    plateNumber: "HR 26 DQ 5520",
    registeredOwner: "Aman Singhania",
    registeredMake: "Hyundai Creta SX",
    registeredColor: "Midnight Black",
    registeredType: "SUV",
    registrationDate: "2023-03-19",
    rtoCode: "HR-26 (Gurgaon South)",
    status: "SUSPICIOUS_TRANSFER",
  },
  "KA 05 MJ 3491": {
    plateNumber: "KA 05 MJ 3491",
    registeredOwner: "Pooja Hegde",
    registeredMake: "Honda City V",
    registeredColor: "Lunar Silver",
    registeredType: "Sedan",
    registrationDate: "2020-05-22",
    rtoCode: "KA-05 (Jayanagar, Bengaluru)",
    status: "CLEAN",
  },
  "UP 16 BZ 7721": {
    plateNumber: "UP 16 BZ 7721",
    registeredOwner: "Dinesh Chaudhary",
    registeredMake: "Tata Nexon EV",
    registeredColor: "Flame Red",
    registeredType: "SUV",
    registrationDate: "2023-09-10",
    rtoCode: "UP-16 (Noida)",
    status: "CLEAN",
  },
  "DL 08 CA 4019": {
    plateNumber: "DL 08 CA 4019",
    registeredOwner: "Karan Malhotra",
    registeredMake: "Toyota Fortuner 4x4",
    registeredColor: "Super White",
    registeredType: "SUV",
    registrationDate: "2022-01-18",
    rtoCode: "DL-08 (Wazirpur)",
    status: "CLEAN",
  },
};

export const INITIAL_DETECTIONS: VehicleDetection[] = [
  {
    id: "DET-98201",
    plateNumber: "DL 01 XY 9999",
    plateConfidence: 98.4,
    vehicleType: "SUV",
    color: "Midnight Black",
    colorHex: "#111827",
    makeModel: "Mahindra Scorpio-N",
    cameraId: "CAM-05",
    cameraName: "AIIMS South Extension Flyover",
    timestamp: "10:22:15 AM",
    timestampRaw: Date.now() - 15000,
    speedKmh: 64,
    lane: "Lane 2 (Express)",
    direction: "Southbound",
    confidence: {
      total: 58.2, // Low total confidence because metadata doesn't match registered profile!
      ocr: 98.4,
      color: 24.0, // Black vs White!
      type: 42.0,  // SUV vs Hatchback!
      reIdEmbedding: 38.5,
      spatioTemporal: 88.0,
    },
    registeredProfile: REGISTERED_DATABASE["DL 01 XY 9999"],
    isFlagged: true,
    flagReason: "CRITICAL: Cloned Plate Detected (RTO registered as White Swift Hatchback)",
    anomalyType: "CLONED_PLATE",
  },
  {
    id: "DET-98200",
    plateNumber: "MH 12 AB 1234",
    plateConfidence: 44.5, // Muddy plate! OCR was partial
    isMuddyOrObscured: true,
    vehicleType: "SUV",
    color: "Deep Ocean Blue",
    colorHex: "#1e3a8a",
    makeModel: "Mahindra Scorpio-N",
    cameraId: "CAM-07",
    cameraName: "DND Flyway Mayur Vihar Toll Plaza",
    timestamp: "10:21:40 AM",
    timestampRaw: Date.now() - 50000,
    speedKmh: 58,
    lane: "Lane 1 (FasTag Fast Track)",
    direction: "Eastbound",
    confidence: {
      total: 89.6, // High multi-modal score despite muddy plate!
      ocr: 44.5,
      color: 96.0,
      type: 98.0,
      reIdEmbedding: 95.2,
      spatioTemporal: 97.4,
    },
    registeredProfile: REGISTERED_DATABASE["MH 12 AB 1234"],
    isFlagged: false,
    anomalyType: "MUDDY_PLATE_RESOLVED",
  },
  {
    id: "DET-98199",
    plateNumber: "HR 26 DQ 5520",
    plateConfidence: 99.1,
    vehicleType: "SUV",
    color: "Midnight Black",
    colorHex: "#0f172a",
    makeModel: "Hyundai Creta SX",
    cameraId: "CAM-10",
    cameraName: "Pari Chowk Greater Noida Interchange",
    timestamp: "10:20:05 AM",
    timestampRaw: Date.now() - 145000,
    speedKmh: 82,
    lane: "Lane 3",
    direction: "Eastbound",
    confidence: {
      total: 41.5, // Flags teleportation anomaly!
      ocr: 99.1,
      color: 95.0,
      type: 96.0,
      reIdEmbedding: 94.0,
      spatioTemporal: 4.2, // 52.4 km in 5 mins = 628 km/h! Kinematically impossible
    },
    registeredProfile: REGISTERED_DATABASE["HR 26 DQ 5520"],
    isFlagged: true,
    flagReason: "CRITICAL: Teleportation Anomaly (Traversed 52.4km in 5 min, calculated 628 km/h)",
    anomalyType: "TELEPORTATION",
  },
  {
    id: "DET-98198",
    plateNumber: "DL 01 XY 9999",
    plateConfidence: 97.8,
    vehicleType: "Hatchback",
    color: "Pearl White",
    colorHex: "#f8fafc",
    makeModel: "Maruti Suzuki Swift",
    cameraId: "CAM-02",
    cameraName: "Connaught Place Inner Circle Radial 3",
    timestamp: "10:14:30 AM",
    timestampRaw: Date.now() - 480000,
    speedKmh: 42,
    lane: "Lane 1",
    direction: "Northbound",
    confidence: {
      total: 96.8,
      ocr: 97.8,
      color: 96.5,
      type: 98.0,
      reIdEmbedding: 95.0,
      spatioTemporal: 96.5,
    },
    registeredProfile: REGISTERED_DATABASE["DL 01 XY 9999"],
    isFlagged: true,
    flagReason: "CONFLICT: Paired in Cloned Plate Investigation Dossier",
    anomalyType: "CLONED_PLATE",
  },
  {
    id: "DET-98197",
    plateNumber: "KA 05 MJ 3491",
    plateConfidence: 96.2,
    vehicleType: "Sedan",
    color: "Lunar Silver",
    colorHex: "#cbd5e1",
    makeModel: "Honda City V",
    cameraId: "CAM-03",
    cameraName: "Dhaula Kuan Arterial Interchange",
    timestamp: "10:12:10 AM",
    timestampRaw: Date.now() - 610000,
    speedKmh: 54,
    lane: "Lane 2",
    direction: "Eastbound",
    confidence: {
      total: 95.4,
      ocr: 96.2,
      color: 94.0,
      type: 96.0,
      reIdEmbedding: 95.1,
      spatioTemporal: 96.0,
    },
    registeredProfile: REGISTERED_DATABASE["KA 05 MJ 3491"],
    isFlagged: false,
  },
  {
    id: "DET-98196",
    plateNumber: "UP 16 BZ 7721",
    plateConfidence: 94.8,
    vehicleType: "SUV",
    color: "Flame Red",
    colorHex: "#dc2626",
    makeModel: "Tata Nexon EV",
    cameraId: "CAM-08",
    cameraName: "Noida Sector 18 Commercial Hub",
    timestamp: "10:08:45 AM",
    timestampRaw: Date.now() - 820000,
    speedKmh: 48,
    lane: "Lane 1",
    direction: "Southbound",
    confidence: {
      total: 94.1,
      ocr: 94.8,
      color: 92.5,
      type: 95.0,
      reIdEmbedding: 93.8,
      spatioTemporal: 94.5,
    },
    registeredProfile: REGISTERED_DATABASE["UP 16 BZ 7721"],
    isFlagged: false,
  },
  {
    id: "DET-98195",
    plateNumber: "DL 08 CA 4019",
    plateConfidence: 98.9,
    vehicleType: "SUV",
    color: "Super White",
    colorHex: "#f8fafc",
    makeModel: "Toyota Fortuner 4x4",
    cameraId: "CAM-04",
    cameraName: "Ring Road North Outer Bypass",
    timestamp: "10:04:12 AM",
    timestampRaw: Date.now() - 1090000,
    speedKmh: 68,
    lane: "Lane 3 (Fast Lane)",
    direction: "Northbound",
    confidence: {
      total: 97.5,
      ocr: 98.9,
      color: 97.0,
      type: 99.0,
      reIdEmbedding: 96.2,
      spatioTemporal: 96.5,
    },
    registeredProfile: REGISTERED_DATABASE["DL 08 CA 4019"],
    isFlagged: false,
  },
];

// Pre-computed realistic trajectories for search demo
export const MOCK_TRAJECTORIES: Record<string, VehicleTrajectory> = {
  "MH 12 AB 1234": {
    plateNumber: "MH 12 AB 1234",
    summary: {
      vehicleType: "SUV",
      color: "Deep Ocean Blue",
      makeModel: "Mahindra Scorpio-N",
      firstSpotted: "09:35:10 AM",
      lastSpotted: "10:21:40 AM",
      totalDistanceKm: 34.6,
      totalTimeMin: 46.5,
      avgSpeedKmh: 44.6,
      kinematicValidityScore: 99.2,
      predictedNextNode: {
        camera: getCameraById("CAM-08"),
        confidence: 94.2,
        etaMinutes: 6.5,
      },
    },
    points: [
      {
        sequence: 1,
        camera: getCameraById("CAM-01"),
        detection: {
          ...INITIAL_DETECTIONS[1],
          cameraId: "CAM-01",
          cameraName: "IGI Airport T3 Departure Flyover",
          timestamp: "09:35:10 AM",
          timestampRaw: Date.now() - 2800000,
          speedKmh: 52,
        },
        distanceFromPrevKm: 0,
        timeFromPrevMin: 0,
        speedBetweenKmh: 52,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 2,
        camera: getCameraById("CAM-03"),
        detection: {
          ...INITIAL_DETECTIONS[1],
          cameraId: "CAM-03",
          cameraName: "Dhaula Kuan Arterial Interchange",
          timestamp: "09:47:30 AM",
          timestampRaw: Date.now() - 2060000,
          speedKmh: 48,
        },
        distanceFromPrevKm: 8.4,
        timeFromPrevMin: 12.3,
        speedBetweenKmh: 41.0,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 3,
        camera: getCameraById("CAM-05"),
        detection: {
          ...INITIAL_DETECTIONS[1],
          cameraId: "CAM-05",
          cameraName: "AIIMS South Extension Flyover",
          timestamp: "10:02:15 AM",
          timestampRaw: Date.now() - 1175000,
          speedKmh: 56,
        },
        distanceFromPrevKm: 6.2,
        timeFromPrevMin: 14.75,
        speedBetweenKmh: 25.2,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 4,
        camera: getCameraById("CAM-06"),
        detection: {
          ...INITIAL_DETECTIONS[1],
          cameraId: "CAM-06",
          cameraName: "Lajpat Nagar Central Market Crossing",
          timestamp: "10:11:00 AM",
          timestampRaw: Date.now() - 650000,
          speedKmh: 45,
        },
        distanceFromPrevKm: 3.5,
        timeFromPrevMin: 8.75,
        speedBetweenKmh: 24.0,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 5,
        camera: getCameraById("CAM-07"),
        detection: INITIAL_DETECTIONS[1], // DND toll plaza
        distanceFromPrevKm: 16.5,
        timeFromPrevMin: 10.6,
        speedBetweenKmh: 93.4,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: true, // 93 km/h on DND Flyway (limit 80)
      },
    ],
  },
  "DL 01 XY 9999": {
    plateNumber: "DL 01 XY 9999",
    summary: {
      vehicleType: "Hatchback",
      color: "Pearl White (Original) / Divergent Black SUV (Cloned)",
      makeModel: "Multi-Modal Ambiguity: 2 Physical Vehicles",
      firstSpotted: "09:50:00 AM",
      lastSpotted: "10:22:15 AM",
      totalDistanceKm: 28.1,
      totalTimeMin: 32.2,
      avgSpeedKmh: 52.4,
      kinematicValidityScore: 42.1,
      predictedNextNode: {
        camera: getCameraById("CAM-07"),
        confidence: 68.0,
        etaMinutes: 12.0,
      },
    },
    points: [
      {
        sequence: 1,
        camera: getCameraById("CAM-04"),
        detection: {
          ...INITIAL_DETECTIONS[3],
          cameraId: "CAM-04",
          cameraName: "Ring Road North Outer Bypass",
          timestamp: "09:50:00 AM",
          timestampRaw: Date.now() - 1935000,
          speedKmh: 49,
        },
        distanceFromPrevKm: 0,
        timeFromPrevMin: 0,
        speedBetweenKmh: 49,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 2,
        camera: getCameraById("CAM-12"),
        detection: {
          ...INITIAL_DETECTIONS[3],
          cameraId: "CAM-12",
          cameraName: "Kashmere Gate ISBT North Transit",
          timestamp: "10:02:10 AM",
          timestampRaw: Date.now() - 1205000,
          speedKmh: 41,
        },
        distanceFromPrevKm: 5.6,
        timeFromPrevMin: 12.16,
        speedBetweenKmh: 27.6,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 3,
        camera: getCameraById("CAM-02"),
        detection: INITIAL_DETECTIONS[3], // Connaught place - White Swift
        distanceFromPrevKm: 4.8,
        timeFromPrevMin: 12.33,
        speedBetweenKmh: 23.3,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 4,
        camera: getCameraById("CAM-05"),
        detection: INITIAL_DETECTIONS[0], // AIIMS South Ex - Black Scorpio! [CLONE DETECTED]
        distanceFromPrevKm: 7.7,
        timeFromPrevMin: 7.75,
        speedBetweenKmh: 59.6,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
    ],
  },
  "HR 26 DQ 5520": {
    plateNumber: "HR 26 DQ 5520",
    summary: {
      vehicleType: "SUV",
      color: "Midnight Black",
      makeModel: "Hyundai Creta SX",
      firstSpotted: "09:30:15 AM",
      lastSpotted: "10:20:05 AM",
      totalDistanceKm: 76.5,
      totalTimeMin: 49.8,
      avgSpeedKmh: 92.1,
      kinematicValidityScore: 12.4, // Critically degraded due to jump
      predictedNextNode: {
        camera: getCameraById("CAM-09"),
        confidence: 88.0,
        etaMinutes: 8.0,
      },
    },
    points: [
      {
        sequence: 1,
        camera: getCameraById("CAM-11"),
        detection: {
          ...INITIAL_DETECTIONS[2],
          cameraId: "CAM-11",
          cameraName: "Cyber City Rapid Metro Corridor (Gurgaon)",
          timestamp: "09:30:15 AM",
          timestampRaw: Date.now() - 3000000,
          speedKmh: 62,
        },
        distanceFromPrevKm: 0,
        timeFromPrevMin: 0,
        speedBetweenKmh: 62,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 2,
        camera: getCameraById("CAM-01"),
        detection: {
          ...INITIAL_DETECTIONS[2],
          cameraId: "CAM-01",
          cameraName: "IGI Airport T3 Departure Flyover",
          timestamp: "09:42:10 AM",
          timestampRaw: Date.now() - 2280000,
          speedKmh: 60,
        },
        distanceFromPrevKm: 12.2,
        timeFromPrevMin: 11.9,
        speedBetweenKmh: 61.5,
        isImpossibleSpeed: false,
        isSpeedLimitViolated: false,
      },
      {
        sequence: 3,
        camera: getCameraById("CAM-10"),
        detection: INITIAL_DETECTIONS[2], // Pari Chowk Greater Noida [Teleportation jump!]
        distanceFromPrevKm: 52.4,
        timeFromPrevMin: 5.0, // 5 minutes!
        speedBetweenKmh: 628.8, // Impossible!
        isImpossibleSpeed: true,
        isSpeedLimitViolated: true,
      },
    ],
  },
};

// Quick generator for real-time live simulation ticks
const SAMPLE_PLATES = [
  "DL 03 CA 4821", "MH 02 EE 9012", "HR 29 AJ 7744", "UP 14 CD 3321",
  "KA 03 NB 1199", "DL 07 SB 6543", "TN 09 BK 2210", "TS 08 HG 8832",
  "MH 14 CC 4432", "GJ 01 LM 9981", "CH 01 BG 5519", "DL 04 TC 8731"
];

const SAMPLE_MAKES: Record<VehicleClass, string[]> = {
  SUV: ["Hyundai Creta", "Mahindra Scorpio-N", "Tata Harrier", "Kia Seltos", "Toyota Fortuner"],
  Sedan: ["Honda City", "Hyundai Verna", "Skoda Slavia", "Maruti Ciaz"],
  Hatchback: ["Maruti Swift", "Hyundai i20", "Tata Altroz", "Maruti Baleno"],
  Truck: ["Tata 407", "Ashok Leyland Dost", "Eicher Pro 2049"],
  Motorcycle: ["Royal Enfield Classic 350", "Bajaj Pulsar NS200", "TVS Apache RTR"],
  Bus: ["Tata Starbus", "Ashok Leyland Viking", "Volvo 9400"],
};

const SAMPLE_COLORS = [
  { name: "Pearl White", hex: "#f8fafc" },
  { name: "Midnight Black", hex: "#0f172a" },
  { name: "Silver Metallic", hex: "#94a3b8" },
  { name: "Deep Ocean Blue", hex: "#1e3a8a" },
  { name: "Crimson Red", hex: "#b91c1c" },
  { name: "Forest Green", hex: "#065f46" },
  { name: "Graphite Grey", hex: "#334155" },
];

export const generateRandomDetection = (): VehicleDetection => {
  const plate = SAMPLE_PLATES[Math.floor(Math.random() * SAMPLE_PLATES.length)];
  const vehicleTypes: VehicleClass[] = ["SUV", "Sedan", "Hatchback", "Truck", "Motorcycle"];
  const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  const makeList = SAMPLE_MAKES[type] || SAMPLE_MAKES.SUV;
  const make = makeList[Math.floor(Math.random() * makeList.length)];
  const colorObj = SAMPLE_COLORS[Math.floor(Math.random() * SAMPLE_COLORS.length)];
  const camera = CITY_CAMERAS[Math.floor(Math.random() * CITY_CAMERAS.length)];
  const speed = Math.floor(Math.random() * 45) + 35; // 35-80 km/h

  const ocrConf = Number((Math.random() * 8 + 92).toFixed(1));
  const colorConf = Number((Math.random() * 9 + 90).toFixed(1));
  const typeConf = Number((Math.random() * 5 + 95).toFixed(1));
  const reIdConf = Number((Math.random() * 7 + 91).toFixed(1));
  const stConf = Number((Math.random() * 6 + 93).toFixed(1));

  const totalConf = Number(
    (0.35 * ocrConf + 0.2 * colorConf + 0.15 * typeConf + 0.2 * reIdConf + 0.1 * stConf).toFixed(1)
  );

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return {
    id: `DET-${Math.floor(Math.random() * 89999 + 10000)}`,
    plateNumber: plate,
    plateConfidence: ocrConf,
    vehicleType: type,
    color: colorObj.name,
    colorHex: colorObj.hex,
    makeModel: make,
    cameraId: camera.id,
    cameraName: camera.name,
    timestamp: timeStr,
    timestampRaw: Date.now(),
    speedKmh: speed,
    lane: `Lane ${Math.floor(Math.random() * 3) + 1}`,
    direction: ["Northbound", "Southbound", "Eastbound", "Westbound"][Math.floor(Math.random() * 4)] as any,
    confidence: {
      total: totalConf,
      ocr: ocrConf,
      color: colorConf,
      type: typeConf,
      reIdEmbedding: reIdConf,
      spatioTemporal: stConf,
    },
    isFlagged: false,
  };
};
