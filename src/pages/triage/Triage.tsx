
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";

const Triage = () => {
  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Triage</h1>
        <p className="text-gray-500">Record vital signs and initial assessment</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-medical-600" />
              Vital Signs
            </CardTitle>
            <CardDescription>Record patient's vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                  <Input id="bloodPressure" placeholder="120/80" className="medical-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input id="heartRate" placeholder="Enter heart rate" type="number" className="medical-input" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input id="temperature" placeholder="Enter temperature" type="number" step="0.1" className="medical-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratoryRate">Respiratory Rate (bpm)</Label>
                  <Input id="respiratoryRate" placeholder="Enter respiratory rate" type="number" className="medical-input" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input id="oxygenSaturation" placeholder="Enter O2 saturation" type="number" max="100" className="medical-input" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Input id="chiefComplaint" placeholder="Enter chief complaint" className="medical-input" />
              </div>

              <Button className="w-full bg-medical-600 hover:bg-medical-700 text-white">
                Save Triage Data
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Triage Priority</CardTitle>
            <CardDescription>Set patient priority level based on assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full bg-emergency-600 hover:bg-emergency-700 text-white mb-2">
                Emergency (Red)
              </Button>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-2">
                Urgent (Orange)
              </Button>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white mb-2">
                Semi-Urgent (Yellow)
              </Button>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Non-Urgent (Green)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Triage;
