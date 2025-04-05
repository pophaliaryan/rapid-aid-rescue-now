
import { Ambulance, EmergencyRequest, Hospital, Zone, zones, ambulances } from './mockData';

// Calculate distance between two points (simplified for 2D coordinates)
export function calculateDistance(
  point1: [number, number], 
  point2: [number, number]
): number {
  const xDiff = point2[0] - point1[0];
  const yDiff = point2[1] - point1[1];
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

// Find zone containing a location point
export function findZoneForLocation(location: [number, number]): Zone | undefined {
  // Simple implementation - in a real system this would use geofencing or polygon containment
  for (const zone of zones) {
    const [minX, minY] = zone.paths[0];
    const [maxX, maxY] = zone.paths[2];
    
    if (
      location[0] >= minX && 
      location[0] <= maxX && 
      location[1] >= minY && 
      location[1] <= maxY
    ) {
      return zone;
    }
  }
  return undefined;
}

// Calculate estimated time of arrival (ETA) in minutes
export function calculateETA(
  ambulanceLocation: [number, number], 
  emergencyLocation: [number, number],
  trafficFactor: number = 1.0 // 1.0 is normal traffic, >1.0 is heavy traffic
): number {
  // Simple distance-based calculation, assuming 1 unit = 1 km and average speed of 40 km/h
  const distance = calculateDistance(ambulanceLocation, emergencyLocation);
  const avgSpeedKmPerMinute = 0.67; // 40 km/h = 0.67 km/min
  const estimatedTime = distance / avgSpeedKmPerMinute * trafficFactor;
  
  // Round to nearest minute with minimum of 1 minute
  return Math.max(1, Math.round(estimatedTime));
}

// Calculate severity score based on reported symptoms
export function calculateSeverityScore(symptomIds: string[]): number {
  if (symptomIds.length === 0) return 5; // Default medium priority
  
  // This would normally use a trained model, but for MVP we use a rule-based system
  let totalSeverity = 0;
  let unconsciousCount = 0;
  let chestPainCount = 0;
  let breathingCount = 0;
  
  symptomIds.forEach(id => {
    switch(id) {
      case 's1': // Chest pain
        totalSeverity += 9;
        chestPainCount++;
        break;
      case 's2': // Difficulty breathing
        totalSeverity += 9;
        breathingCount++;
        break;
      case 's3': // Unconscious
        totalSeverity += 10;
        unconsciousCount++;
        break;
      case 's4': // Severe bleeding
        totalSeverity += 8;
        break;
      case 's5': // Head injury
        totalSeverity += 8;
        break;
      case 's6': // Fracture
        totalSeverity += 6;
        break;
      case 's7': // Burn
        totalSeverity += 7;
        break;
      case 's8': // Stroke symptoms
        totalSeverity += 9;
        break;
      case 's9': // Seizure
        totalSeverity += 7;
        break;
      case 's10': // Allergic reaction
        totalSeverity += 8;
        break;
      default:
        totalSeverity += 5; // Default for other symptoms
    }
  });
  
  // Critical conditions check (prioritize certain combinations)
  if (unconsciousCount > 0 && (chestPainCount > 0 || breathingCount > 0)) {
    return 10; // Max severity
  }
  
  // Calculate average severity and round
  const avgSeverity = totalSeverity / symptomIds.length;
  return Math.min(10, Math.round(avgSeverity));
}

// Find optimal hospital based on capacity and proximity
export function findOptimalHospital(
  emergencyLocation: [number, number], 
  severityScore: number,
  zone: Zone
): Hospital | undefined {
  // Start with hospitals in the same zone
  let hospitals = [...zone.hospitals];
  
  // Add hospitals from adjacent zones if needed (in real implementation)
  // For MVP we just use hospitals in the same zone
  
  // Sort hospitals by a weighted score of availability and proximity
  hospitals.sort((h1, h2) => {
    const dist1 = calculateDistance(emergencyLocation, h1.location);
    const dist2 = calculateDistance(emergencyLocation, h2.location);
    
    // Calculate scores - higher availability and closer proximity is better
    const score1 = (h1.available / h1.capacity) * 0.7 + (1 / dist1) * 0.3;
    const score2 = (h2.available / h2.capacity) * 0.7 + (1 / dist2) * 0.3;
    
    return score2 - score1; // Higher score first
  });
  
  // Return best hospital if available, otherwise return the closest one
  if (hospitals.length > 0) {
    return hospitals[0];
  }
  
  // Fallback - find any hospital with capacity
  return undefined;
}

// Main dispatch function to assign optimal ambulance to emergency
export function dispatchAmbulance(
  emergencyRequest: Partial<EmergencyRequest>,
): {ambulance: Ambulance | null, hospital: Hospital | null, eta: number | null} {
  if (!emergencyRequest.location) {
    console.error("Emergency location is required for dispatch");
    return {ambulance: null, hospital: null, eta: null};
  }

  // Find the zone for the emergency
  const zone = findZoneForLocation(emergencyRequest.location);
  if (!zone) {
    console.error("No zone found for the emergency location");
    return {ambulance: null, hospital: null, eta: null};
  }
  
  // Calculate severity if not provided
  const severityScore = emergencyRequest.severityScore || 
    (emergencyRequest.symptoms ? calculateSeverityScore(emergencyRequest.symptoms) : 5);
  
  // Get available ambulances
  let availableAmbulances = [...ambulances].filter(a => a.status === 'available');
  
  // If no ambulances available, return null
  if (availableAmbulances.length === 0) {
    console.error("No available ambulances");
    return {ambulance: null, hospital: null, eta: null};
  }
  
  // Sort ambulances by a weighted score of proximity and same zone priority
  availableAmbulances.sort((a1, a2) => {
    const dist1 = calculateDistance(emergencyRequest.location!, a1.location);
    const dist2 = calculateDistance(emergencyRequest.location!, a2.location);
    
    // Same zone gets priority
    const zoneBonus1 = a1.zoneId === zone.id ? 0.3 : 0;
    const zoneBonus2 = a2.zoneId === zone.id ? 0.3 : 0;
    
    // Calculate scores - closer is better, same zone is better
    const score1 = (1 / dist1) * 0.7 + zoneBonus1;
    const score2 = (1 / dist2) * 0.7 + zoneBonus2;
    
    return score2 - score1; // Higher score first
  });
  
  // Select best ambulance
  const selectedAmbulance = availableAmbulances[0];
  
  // Find optimal hospital
  const selectedHospital = findOptimalHospital(
    emergencyRequest.location,
    severityScore,
    zone
  );
  
  // Calculate ETA
  const eta = calculateETA(selectedAmbulance.location, emergencyRequest.location);
  
  // In a real system, we would update ambulance status, but for MVP simulation
  // we just return the selection
  return {
    ambulance: selectedAmbulance,
    hospital: selectedHospital || null,
    eta: eta
  };
}

// Function to get mock traffic data - in a real system this would come from API
export function getTrafficFactor(zone: Zone): number {
  // Mock implementation - random traffic factor between 1.0 and 1.5
  return 1.0 + Math.random() * 0.5;
}

// Function to generate a unique ID for new emergency requests
export function generateEmergencyId(): string {
  return `e${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
