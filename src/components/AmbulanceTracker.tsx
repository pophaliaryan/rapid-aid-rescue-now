
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Ambulance, EmergencyRequest, Hospital } from '../utils/mockData';
import { AmbulanceIcon, Clock, HeartPulse, MapPin, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AmbulanceTrackerProps {
  emergency: EmergencyRequest;
  ambulance: Ambulance | null;
  hospital: Hospital | null;
}

const AmbulanceTracker: React.FC<AmbulanceTrackerProps> = ({
  emergency,
  ambulance,
  hospital
}) => {
  // Calculate progress based on emergency status
  const calculateProgress = () => {
    switch (emergency.status) {
      case 'pending': return 0;
      case 'dispatched': return 25;
      case 'en-route': return 50;
      case 'arrived': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  // Get status label
  const getStatusLabel = () => {
    switch (emergency.status) {
      case 'pending': return 'Pending';
      case 'dispatched': return 'Ambulance Dispatched';
      case 'en-route': return 'En Route to Hospital';
      case 'arrived': return 'Arrived at Hospital';
      case 'completed': return 'Service Completed';
      default: return 'Unknown';
    }
  };

  // Generate ETA text
  const getETAText = () => {
    if (emergency.status === 'completed') return 'Service completed';
    if (emergency.status === 'arrived') return 'Arrived at hospital';
    return emergency.eta ? `${emergency.eta} minutes` : 'Calculating...';
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <AmbulanceIcon className="w-5 h-5 mr-2 text-medical" />
            Ambulance Tracker
          </h3>
          <Badge className={
            emergency.status === 'completed' ? 'bg-green-500' :
            emergency.status === 'arrived' ? 'bg-green-500' :
            emergency.status === 'en-route' ? 'bg-yellow-500' :
            'bg-emergency'
          }>
            {getStatusLabel()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Dispatched</span>
            <span>En Route</span>
            <span>Arrived</span>
            <span>Completed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">ETA</p>
              <p className="text-lg font-semibold">{getETAText()}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Building2 className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Destination</p>
              <p className="text-lg font-semibold">{hospital?.name || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <HeartPulse className="w-4 h-4 text-emergency mt-0.5" />
            <div>
              <p className="text-sm font-medium">Priority</p>
              <Badge className={emergency.severityScore >= 8 ? 'bg-emergency' : 
                emergency.severityScore >= 6 ? 'bg-orange-500' : 'bg-yellow-500'}>
                {emergency.severityScore >= 8 ? 'Critical' : 
                  emergency.severityScore >= 6 ? 'High' : 'Medium'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="space-y-3 text-sm">
          <div className="flex">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <p className="flex-1">
              <span className="font-medium">Pickup Location:</span> {' '}
              ({emergency.location[0]}, {emergency.location[1]})
            </p>
          </div>
          
          {emergency.patientName && (
            <div className="flex">
              <svg 
                className="w-4 h-4 mr-2 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p><span className="font-medium">Patient:</span> {emergency.patientName}</p>
            </div>
          )}
          
          {emergency.contactNumber && (
            <div className="flex">
              <svg 
                className="w-4 h-4 mr-2 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p><span className="font-medium">Contact:</span> {emergency.contactNumber}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AmbulanceTracker;
