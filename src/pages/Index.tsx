
import React, { useState } from 'react';
import { 
  ambulances, 
  EmergencyRequest, 
  Ambulance, 
  Hospital, 
  zones, 
  emergencyRequests as mockEmergencies 
} from '../utils/mockData';
import CityMap from '../components/CityMap';
import EmergencyForm from '../components/EmergencyForm';
import AmbulanceTracker from '../components/AmbulanceTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AmbulanceIcon, HeartPulse, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRequest | null>(null);
  const [dispatchedAmbulance, setDispatchedAmbulance] = useState<Ambulance | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLocationSelect = (location: [number, number]) => {
    setSelectedLocation(location);
    
    toast({
      title: "Location Selected",
      description: `Selected coordinates: (${location[0]}, ${location[1]})`,
    });
  };
  
  const handleEmergencyCreated = (request: EmergencyRequest) => {
    setActiveEmergency(request);
    
    // Find the dispatched ambulance
    const ambulance = ambulances.find(a => a.id === request.ambulanceId) || null;
    setDispatchedAmbulance(ambulance);
    
    // Find the selected hospital
    const zone = zones.find(z => z.id === ambulance?.zoneId);
    if (zone) {
      const hospital = zone.hospitals.find(h => h.id === request.hospitalId) || null;
      setSelectedHospital(hospital);
    }
  };

  const viewHospitalDashboard = () => {
    if (selectedHospital) {
      navigate(`/hospital/${selectedHospital.id}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AmbulanceIcon className="h-8 w-8 text-emergency" />
              <h1 className="ml-2 text-2xl font-bold">
                Rapid<span className="text-emergency">Aid</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => navigate('/hospital-dashboard')}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Hospital View
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/5">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <HeartPulse className="w-5 h-5 mr-2 text-emergency" />
                  Emergency Response System
                </h2>
                <CityMap 
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  activeEmergency={activeEmergency}
                  dispatchedAmbulance={dispatchedAmbulance}
                />
              </div>
              
              {activeEmergency && dispatchedAmbulance && (
                <AmbulanceTracker 
                  emergency={activeEmergency} 
                  ambulance={dispatchedAmbulance}
                  hospital={selectedHospital}
                />
              )}
            </div>
          </div>
          
          <div className="md:w-2/5">
            <EmergencyForm
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              onEmergencyCreated={handleEmergencyCreated}
            />
            
            {activeEmergency && selectedHospital && (
              <div className="mt-4 bg-medical-light rounded-lg border border-medical/20 p-4">
                <div className="flex items-start">
                  <Building2 className="w-5 h-5 text-medical mt-1 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-medical">{selectedHospital.name}</h3>
                    <p className="text-sm mb-2">
                      The hospital has been notified and is preparing for arrival.
                    </p>
                    <Button 
                      variant="outline" 
                      className="text-sm border-medical text-medical hover:bg-medical hover:text-white"
                      onClick={viewHospitalDashboard}
                    >
                      View Hospital Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
