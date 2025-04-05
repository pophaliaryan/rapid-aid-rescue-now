
import React from 'react';
import { Symptom, commonSymptoms } from '../utils/mockData';
import { calculateSeverityScore } from '../utils/dispatchLogic';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface SeverityCalculatorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
}

const SeverityCalculator: React.FC<SeverityCalculatorProps> = ({
  selectedSymptoms,
  onSymptomsChange,
}) => {
  const handleSymptomToggle = (symptomId: string) => {
    const updatedSymptoms = selectedSymptoms.includes(symptomId)
      ? selectedSymptoms.filter(id => id !== symptomId)
      : [...selectedSymptoms, symptomId];
    
    onSymptomsChange(updatedSymptoms);
  };

  const severityScore = calculateSeverityScore(selectedSymptoms);
  
  const getSeverityLabel = (score: number) => {
    if (score >= 9) return { label: 'Critical', color: 'bg-emergency text-white' };
    if (score >= 7) return { label: 'High', color: 'bg-orange-500 text-white' };
    if (score >= 5) return { label: 'Medium', color: 'bg-yellow-500 text-black' };
    return { label: 'Low', color: 'bg-green-500 text-white' };
  };
  
  const severityInfo = getSeverityLabel(severityScore);

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Report Symptoms</h3>
          <div className="flex items-center">
            <span className="mr-2 text-sm">Priority:</span>
            <Badge className={`${severityInfo.color} px-3 py-1`}>
              {severityInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-3">
          Select all symptoms that apply to the emergency situation:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {commonSymptoms.map((symptom) => (
            <div key={symptom.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`symptom-${symptom.id}`} 
                checked={selectedSymptoms.includes(symptom.id)}
                onCheckedChange={() => handleSymptomToggle(symptom.id)}
              />
              <Label 
                htmlFor={`symptom-${symptom.id}`}
                className="text-sm cursor-pointer"
              >
                {symptom.name}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityCalculator;
