
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { zones, emergencyRequests } from '../utils/mockData';
import HospitalDashboard from '../components/HospitalDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2 } from 'lucide-react';

const HospitalDashboardPage = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  
  // Flatten hospitals from all zones
  const allHospitals = zones.flatMap(zone => zone.hospitals);
  
  // If hospitalId is provided, find that hospital, otherwise use the first one
  const defaultHospital = hospitalId 
    ? allHospitals.find(h => h.id === hospitalId) 
    : allHospitals[0];
  
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(defaultHospital?.id || 'h1');
  
  const selectedHospital = allHospitals.find(h => h.id === selectedHospitalId);
  
  if (!selectedHospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Hospital Not Found</h2>
          <p className="mb-4">The requested hospital was not found in our system.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-medical" />
              <h1 className="ml-2 text-2xl font-bold">
                Hospital <span className="text-medical">Dashboard</span>
              </h1>
            </div>
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dispatch
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4 md:px-6">
        <Tabs defaultValue={selectedHospitalId} onValueChange={setSelectedHospitalId}>
          <TabsList className="mb-4">
            {allHospitals.map(hospital => (
              <TabsTrigger key={hospital.id} value={hospital.id}>
                {hospital.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {allHospitals.map(hospital => (
            <TabsContent key={hospital.id} value={hospital.id}>
              <HospitalDashboard 
                hospital={hospital} 
                emergencies={emergencyRequests} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default HospitalDashboardPage;
