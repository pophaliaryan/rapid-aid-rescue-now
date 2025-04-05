
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Hospital, EmergencyRequest, Ambulance, zones, commonSymptoms } from '../utils/mockData';

interface HospitalDashboardProps {
  hospital: Hospital;
  emergencies: EmergencyRequest[];
}

const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  hospital,
  emergencies
}) => {
  const incomingEmergencies = emergencies.filter(
    e => e.hospitalId === hospital.id && 
    (e.status === 'dispatched' || e.status === 'en-route')
  );
  
  const arrivedEmergencies = emergencies.filter(
    e => e.hospitalId === hospital.id && e.status === 'arrived'
  );

  // Get symptom names from IDs
  const getSymptomNames = (symptomIds: string[]) => {
    return symptomIds.map(id => 
      commonSymptoms.find(s => s.id === id)?.name || 'Unknown'
    ).join(', ');
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-medical py-3 px-6">
          <h2 className="text-xl font-bold text-white">{hospital.name}</h2>
          <p className="text-white/90 text-sm">
            Hospital Dashboard
          </p>
        </div>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-green-800">Available Beds</h4>
                <p className="text-2xl font-bold text-green-700">{hospital.available} / {hospital.capacity}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-blue-800">Incoming Patients</h4>
                <p className="text-2xl font-bold text-blue-700">{incomingEmergencies.length}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-100">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-orange-800">Recent Arrivals</h4>
                <p className="text-2xl font-bold text-orange-700">{arrivedEmergencies.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Incoming Patients</h3>
          {incomingEmergencies.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Symptoms</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomingEmergencies.map((emergency) => (
                    <TableRow key={emergency.id}>
                      <TableCell>{formatTime(emergency.timestamp)}</TableCell>
                      <TableCell>
                        {emergency.patientName || 'Unknown'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {getSymptomNames(emergency.symptoms)}
                      </TableCell>
                      <TableCell>
                        <Badge className={emergency.severityScore >= 8 ? 'bg-emergency' : 
                          emergency.severityScore >= 6 ? 'bg-orange-500' : 'bg-yellow-500'}>
                          {emergency.severityScore}/10
                        </Badge>
                      </TableCell>
                      <TableCell>{emergency.eta} min</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500">
                          {emergency.status === 'dispatched' ? 'Dispatched' : 'En Route'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No incoming patients at this time</p>
          )}
          
          {arrivedEmergencies.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">Recent Arrivals</h3>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Symptoms</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {arrivedEmergencies.map((emergency) => (
                      <TableRow key={emergency.id}>
                        <TableCell>{formatTime(emergency.timestamp)}</TableCell>
                        <TableCell>
                          {emergency.patientName || 'Unknown'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {getSymptomNames(emergency.symptoms)}
                        </TableCell>
                        <TableCell>
                          <Badge className={emergency.severityScore >= 8 ? 'bg-emergency' : 
                            emergency.severityScore >= 6 ? 'bg-orange-500' : 'bg-yellow-500'}>
                            {emergency.severityScore}/10
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Arrived</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalDashboard;
