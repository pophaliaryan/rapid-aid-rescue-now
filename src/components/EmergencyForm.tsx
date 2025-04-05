
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Ambulance, EmergencyRequest, Hospital } from '../utils/mockData';
import { dispatchAmbulance, generateEmergencyId } from '../utils/dispatchLogic';
import SeverityCalculator from './SeverityCalculator';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EmergencyFormProps {
  selectedLocation: [number, number] | null;
  onLocationSelect: (location: [number, number]) => void;
  onEmergencyCreated: (request: EmergencyRequest) => void;
}

const EmergencyForm: React.FC<EmergencyFormProps> = ({
  selectedLocation,
  onLocationSelect,
  onEmergencyCreated
}) => {
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    ambulance: Ambulance | null;
    hospital: Hospital | null;
    eta: number | null;
  } | null>(null);
  const [emergencyRequest, setEmergencyRequest] = useState<EmergencyRequest | null>(null);
  
  const { toast } = useToast();

  const handleLocationReset = () => {
    onLocationSelect([40, 40]); // Center of the map
  };

  const handleBookAmbulance = () => {
    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please select a location on the map",
        variant: "destructive"
      });
      return;
    }

    if (selectedSymptoms.length === 0) {
      toast({
        title: "Symptoms Required",
        description: "Please select at least one symptom",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = dispatchAmbulance({
        location: selectedLocation,
        symptoms: selectedSymptoms
      });

      setDispatchResult(result);
      
      if (!result.ambulance || !result.hospital) {
        toast({
          title: "Dispatch Failed",
          description: "No ambulances or hospitals available. Try again later.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Create the emergency request
      const newRequest: EmergencyRequest = {
        id: generateEmergencyId(),
        location: selectedLocation,
        symptoms: selectedSymptoms,
        severityScore: selectedSymptoms.length > 0 ? undefined : 5,
        timestamp: Date.now(),
        status: 'dispatched',
        ambulanceId: result.ambulance.id,
        hospitalId: result.hospital.id,
        eta: result.eta || undefined,
        patientName: patientName || undefined,
        contactNumber: contactNumber || undefined
      };

      setEmergencyRequest(newRequest);
      onEmergencyCreated(newRequest);

      toast({
        title: "Ambulance Dispatched",
        description: `Ambulance ${result.ambulance.id} is on its way. ETA: ${result.eta} minutes.`,
        variant: "default"
      });

      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {!emergencyRequest ? (
        <>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold">Request Emergency Assistance</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  <p className="text-sm">
                    {selectedLocation 
                      ? `Selected location: (${selectedLocation[0]}, ${selectedLocation[1]})` 
                      : 'Click on the map to select your location'}
                  </p>
                  {selectedLocation && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLocationReset}
                      className="ml-auto text-xs"
                    >
                      Reset
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="patientName" className="block text-sm font-medium">
                      <User className="inline mr-1 h-3 w-3" /> Patient Name (Optional)
                    </label>
                    <Input
                      id="patientName"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contactNumber" className="block text-sm font-medium">
                      <Phone className="inline mr-1 h-3 w-3" /> Contact Number (Optional)
                    </label>
                    <Input
                      id="contactNumber"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <SeverityCalculator
            selectedSymptoms={selectedSymptoms}
            onSymptomsChange={setSelectedSymptoms}
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleBookAmbulance} 
              disabled={!selectedLocation || isSubmitting || selectedSymptoms.length === 0}
              className={`bg-emergency hover:bg-emergency-hover h-12 px-6 text-lg font-semibold`}
            >
              {isSubmitting ? 'Dispatching...' : 'Book Ambulance Now'}
            </Button>
          </div>
        </>
      ) : (
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-emergency py-4 px-6">
            <h2 className="text-xl font-bold text-white">Ambulance Dispatched</h2>
            <p className="text-white/90">Help is on the way!</p>
          </div>
          
          <CardContent className="pt-4">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 mr-2 text-emergency" />
              <div>
                <p className="font-semibold">Estimated Time of Arrival</p>
                <p className="text-2xl font-bold">{emergencyRequest.eta} minutes</p>
              </div>
              
              <Badge className="ml-auto px-3 py-1 bg-medical">
                Ambulance {emergencyRequest.ambulanceId}
              </Badge>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>({emergencyRequest.location[0]}, {emergencyRequest.location[1]})</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="capitalize">{emergencyRequest.status}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <Badge className={emergencyRequest.severityScore >= 8 ? 'bg-emergency' : 
                  emergencyRequest.severityScore >= 6 ? 'bg-orange-500' : 'bg-yellow-500'}>
                  {emergencyRequest.severityScore >= 8 ? 'Critical' : 
                    emergencyRequest.severityScore >= 6 ? 'High' : 'Medium'}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p>Hospital {emergencyRequest.hospitalId?.replace('h', '')}</p>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <h4 className="font-medium mb-1">What to do while waiting:</h4>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Stay with the patient and keep them comfortable</li>
                <li>Monitor their condition and look for changes</li>
                <li>Clear space for emergency personnel to access</li>
                <li>Have ID and medical information ready if available</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencyForm;
