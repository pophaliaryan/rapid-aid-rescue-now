
export interface Zone {
  id: string;
  name: string;
  color: string;
  paths: [number, number][];
  hospitals: Hospital[];
}

export interface Hospital {
  id: string;
  name: string;
  location: [number, number];
  capacity: number;
  available: number;
}

export interface Ambulance {
  id: string;
  zoneId: string;
  status: 'available' | 'dispatched' | 'occupied';
  location: [number, number];
  hospitalId?: string;
  eta?: number;
}

export interface EmergencyRequest {
  id: string;
  location: [number, number];
  symptoms: string[];
  severityScore: number;
  timestamp: number;
  status: 'pending' | 'dispatched' | 'en-route' | 'arrived' | 'completed';
  ambulanceId?: string;
  hospitalId?: string;
  eta?: number;
  patientName?: string;
  contactNumber?: string;
}

export interface Symptom {
  id: string;
  name: string;
  severityWeight: number;
  description: string;
}

// Mock city zones
export const zones: Zone[] = [
  {
    id: 'z1',
    name: 'North District',
    color: '#FF5733',
    paths: [
      [10, 10], [40, 10], [40, 40], [10, 40]
    ],
    hospitals: [
      {
        id: 'h1',
        name: 'North General Hospital',
        location: [25, 25],
        capacity: 10,
        available: 8
      }
    ]
  },
  {
    id: 'z2',
    name: 'East District',
    color: '#33FF57',
    paths: [
      [40, 10], [70, 10], [70, 40], [40, 40]
    ],
    hospitals: [
      {
        id: 'h2',
        name: 'East Medical Center',
        location: [55, 25],
        capacity: 12,
        available: 5
      }
    ]
  },
  {
    id: 'z3',
    name: 'South District',
    color: '#3357FF',
    paths: [
      [10, 40], [40, 40], [40, 70], [10, 70]
    ],
    hospitals: [
      {
        id: 'h3',
        name: 'South Community Hospital',
        location: [25, 55],
        capacity: 8,
        available: 4
      }
    ]
  },
  {
    id: 'z4',
    name: 'West District',
    color: '#F3FF33',
    paths: [
      [40, 40], [70, 40], [70, 70], [40, 70]
    ],
    hospitals: [
      {
        id: 'h4',
        name: 'West Emergency Center',
        location: [55, 55],
        capacity: 15,
        available: 10
      }
    ]
  }
];

// Mock ambulances
export const ambulances: Ambulance[] = [
  { id: 'a1', zoneId: 'z1', status: 'available', location: [20, 15] },
  { id: 'a2', zoneId: 'z1', status: 'available', location: [30, 30] },
  { id: 'a3', zoneId: 'z2', status: 'available', location: [50, 15] },
  { id: 'a4', zoneId: 'z2', status: 'dispatched', location: [60, 25] },
  { id: 'a5', zoneId: 'z3', status: 'available', location: [20, 50] },
  { id: 'a6', zoneId: 'z3', status: 'occupied', location: [30, 60] },
  { id: 'a7', zoneId: 'z4', status: 'available', location: [50, 50] },
  { id: 'a8', zoneId: 'z4', status: 'available', location: [60, 65] },
];

// Common emergency symptoms
export const commonSymptoms: Symptom[] = [
  { id: 's1', name: 'Chest Pain', severityWeight: 9, description: 'Pain or discomfort in the chest' },
  { id: 's2', name: 'Difficulty Breathing', severityWeight: 9, description: 'Shortness of breath or breathing problems' },
  { id: 's3', name: 'Unconscious', severityWeight: 10, description: 'Not responsive or unconscious' },
  { id: 's4', name: 'Severe Bleeding', severityWeight: 8, description: 'Heavy blood loss from wound' },
  { id: 's5', name: 'Head Injury', severityWeight: 8, description: 'Trauma to the head' },
  { id: 's6', name: 'Fracture', severityWeight: 6, description: 'Broken or fractured bone' },
  { id: 's7', name: 'Burn', severityWeight: 7, description: 'Skin burn from heat, chemicals, or electricity' },
  { id: 's8', name: 'Stroke Symptoms', severityWeight: 9, description: 'Face drooping, arm weakness, speech difficulty' },
  { id: 's9', name: 'Seizure', severityWeight: 7, description: 'Convulsions or fits' },
  { id: 's10', name: 'Allergic Reaction', severityWeight: 8, description: 'Severe allergic reaction with swelling or breathing issues' },
  { id: 's11', name: 'Abdominal Pain', severityWeight: 6, description: 'Severe pain in the abdomen' },
  { id: 's12', name: 'Heart Palpitations', severityWeight: 7, description: 'Irregular or racing heartbeat' }
];

// Mock emergency requests
export const emergencyRequests: EmergencyRequest[] = [
  {
    id: 'e1',
    location: [22, 18],
    symptoms: ['s1', 's2'],
    severityScore: 9,
    timestamp: Date.now() - 60000, // 1 minute ago
    status: 'dispatched',
    ambulanceId: 'a2',
    hospitalId: 'h1',
    eta: 4,
    patientName: 'John Doe',
    contactNumber: '555-1234'
  },
  {
    id: 'e2',
    location: [52, 28],
    symptoms: ['s6', 's7'],
    severityScore: 7,
    timestamp: Date.now() - 180000, // 3 minutes ago
    status: 'en-route',
    ambulanceId: 'a4',
    hospitalId: 'h2',
    eta: 6,
    patientName: 'Jane Smith',
    contactNumber: '555-5678'
  },
  {
    id: 'e3',
    location: [25, 58],
    symptoms: ['s3'],
    severityScore: 10,
    timestamp: Date.now() - 300000, // 5 minutes ago
    status: 'arrived',
    ambulanceId: 'a6',
    hospitalId: 'h3',
    patientName: 'Mike Johnson',
    contactNumber: '555-9012'
  }
];
