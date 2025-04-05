
import React from 'react';
import { zones, ambulances, EmergencyRequest, Ambulance } from '../utils/mockData';
import { AmbulanceIcon, Stethoscope } from 'lucide-react';

interface CityMapProps {
  selectedLocation: [number, number] | null;
  onLocationSelect: (location: [number, number]) => void;
  activeEmergency: EmergencyRequest | null;
  dispatchedAmbulance: Ambulance | null;
}

const CityMap: React.FC<CityMapProps> = ({ 
  selectedLocation, 
  onLocationSelect,
  activeEmergency,
  dispatchedAmbulance
}) => {
  // Map dimensions
  const mapWidth = 80;
  const mapHeight = 80;
  
  // Handle click on map to select location
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - svgRect.left) / svgRect.width * mapWidth);
    const y = Math.round((e.clientY - svgRect.top) / svgRect.height * mapHeight);
    
    onLocationSelect([x, y]);
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-gray-100 relative">
      <div className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded text-xs">
        <h3 className="font-semibold mb-1">Map Legend</h3>
        <div className="flex items-center space-x-1 mb-1">
          <div className="w-3 h-3 rounded-full bg-emergency"></div>
          <span>Emergency Location</span>
        </div>
        <div className="flex items-center space-x-1 mb-1">
          <AmbulanceIcon className="w-3 h-3 text-medical" />
          <span>Available Ambulance</span>
        </div>
        <div className="flex items-center space-x-1">
          <Stethoscope className="w-3 h-3 text-green-600" />
          <span>Hospital</span>
        </div>
      </div>
      
      <svg 
        width="100%" 
        height="400" 
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        onClick={handleMapClick}
        className="cursor-crosshair"
      >
        {/* Render zones */}
        {zones.map(zone => (
          <polygon 
            key={zone.id}
            points={zone.paths.map(point => point.join(',')).join(' ')}
            fill={zone.color}
            fillOpacity="0.3"
            stroke={zone.color}
            strokeWidth="0.5"
            className="map-zone"
          />
        ))}
        
        {/* Render zone names */}
        {zones.map(zone => {
          const centerX = zone.paths.reduce((sum, point) => sum + point[0], 0) / zone.paths.length;
          const centerY = zone.paths.reduce((sum, point) => sum + point[1], 0) / zone.paths.length;
          
          return (
            <text
              key={`text-${zone.id}`}
              x={centerX}
              y={centerY}
              textAnchor="middle"
              fill="#000"
              fontSize="2"
              fontWeight="bold"
            >
              {zone.name}
            </text>
          );
        })}
        
        {/* Render hospitals */}
        {zones.flatMap(zone => 
          zone.hospitals.map(hospital => (
            <g key={hospital.id}>
              <circle
                cx={hospital.location[0]}
                cy={hospital.location[1]}
                r="1.5"
                fill="#10b981"
              />
              <text
                x={hospital.location[0]}
                y={hospital.location[1] - 2}
                textAnchor="middle"
                fill="#000"
                fontSize="1.5"
              >
                {hospital.name}
              </text>
            </g>
          ))
        )}
        
        {/* Render ambulances */}
        {ambulances.map(ambulance => (
          <g 
            key={ambulance.id} 
            className={`ambulance-icon ${dispatchedAmbulance?.id === ambulance.id ? 'animate-pulse-emergency' : ''}`}
          >
            <rect
              x={ambulance.location[0] - 1}
              y={ambulance.location[1] - 0.75}
              width="2"
              height="1.5"
              rx="0.5"
              fill={ambulance.status === 'available' ? '#007AFF' : 
                  ambulance.status === 'dispatched' ? '#FF3B30' : '#8E9196'}
            />
            <text
              x={ambulance.location[0]}
              y={ambulance.location[1] + 1.5}
              textAnchor="middle"
              fill="#000"
              fontSize="1"
            >
              {ambulance.id}
            </text>
          </g>
        ))}
        
        {/* Render selected location */}
        {selectedLocation && (
          <g>
            <circle
              cx={selectedLocation[0]}
              cy={selectedLocation[1]}
              r="1"
              fill="#FF3B30"
              stroke="#000"
              strokeWidth="0.2"
            />
            <circle
              cx={selectedLocation[0]}
              cy={selectedLocation[1]}
              r="2"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="0.2"
              opacity="0.7"
              className="animate-ping"
            />
          </g>
        )}
        
        {/* Render emergency location if there's an active emergency */}
        {activeEmergency && (
          <g>
            <circle
              cx={activeEmergency.location[0]}
              cy={activeEmergency.location[1]}
              r="1.5"
              fill="#FF3B30"
              stroke="#000"
              strokeWidth="0.2"
            />
            <circle
              cx={activeEmergency.location[0]}
              cy={activeEmergency.location[1]}
              r="3"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="0.5"
              opacity="0.7"
              className="animate-ping"
            />
          </g>
        )}
        
        {/* Render path from ambulance to emergency */}
        {activeEmergency && dispatchedAmbulance && (
          <line
            x1={dispatchedAmbulance.location[0]}
            y1={dispatchedAmbulance.location[1]}
            x2={activeEmergency.location[0]}
            y2={activeEmergency.location[1]}
            stroke="#FF3B30"
            strokeWidth="0.3"
            strokeDasharray="0.5,0.5"
          />
        )}
      </svg>
    </div>
  );
};

export default CityMap;
