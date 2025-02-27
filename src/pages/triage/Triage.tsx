
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TriageFormData {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  chiefComplaint: string;
}

const initialFormData: TriageFormData = {
  bloodPressure: "",
  heartRate: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  chiefComplaint: "",
};

const Triage = () => {
  const [formData, setFormData] = useState<TriageFormData>(initialFormData);
  const [priority, setPriority] = useState<string>("");
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePrioritySelect = (selectedPriority: string) => {
    setPriority(selectedPriority);
    toast({
      title: "Triage Priority Set",
      description: `Patient priority set to ${selectedPriority}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.bloodPressure || !formData.heartRate || !formData.temperature) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required vital signs.",
      });
      return;
    }

    // Here you would typically save the data to your backend
    console.log("Saving triage data:", { ...formData, priority });
    
    toast({
      title: "Success",
      description: "Triage data saved successfully",
    });
  };

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
              <Stethoscope className="h-5 w-5 text-primary" />
              Vital Signs
            </CardTitle>
            <CardDescription>Record patient's vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure">Blood Pressure (mmHg) *</Label>
                  <Input
                    id="bloodPressure"
                    placeholder="120/80"
                    value={formData.bloodPressure}
                    onChange={handleInputChange}
                    className="medical-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm) *</Label>
                  <Input
                    id="heartRate"
                    placeholder="Enter heart rate"
                    type="number"
                    value={formData.heartRate}
                    onChange={handleInputChange}
                    className="medical-input"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C) *</Label>
                  <Input
                    id="temperature"
                    placeholder="Enter temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="medical-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratoryRate">Respiratory Rate (bpm)</Label>
                  <Input
                    id="respiratoryRate"
                    placeholder="Enter respiratory rate"
                    type="number"
                    value={formData.respiratoryRate}
                    onChange={handleInputChange}
                    className="medical-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  placeholder="Enter O2 saturation"
                  type="number"
                  max="100"
                  value={formData.oxygenSaturation}
                  onChange={handleInputChange}
                  className="medical-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                <Input
                  id="chiefComplaint"
                  placeholder="Enter chief complaint"
                  value={formData.chiefComplaint}
                  onChange={handleInputChange}
                  className="medical-input"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
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
              <Button
                className={`w-full bg-red-500 hover:bg-red-600 text-white ${
                  priority === "Emergency" ? "ring-2 ring-red-700" : ""
                }`}
                onClick={() => handlePrioritySelect("Emergency")}
              >
                Emergency (Red)
              </Button>
              <Button
                className={`w-full bg-orange-500 hover:bg-orange-600 text-white ${
                  priority === "Urgent" ? "ring-2 ring-orange-700" : ""
                }`}
                onClick={() => handlePrioritySelect("Urgent")}
              >
                Urgent (Orange)
              </Button>
              <Button
                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white ${
                  priority === "Semi-Urgent" ? "ring-2 ring-yellow-700" : ""
                }`}
                onClick={() => handlePrioritySelect("Semi-Urgent")}
              >
                Semi-Urgent (Yellow)
              </Button>
              <Button
                className={`w-full bg-green-500 hover:bg-green-600 text-white ${
                  priority === "Non-Urgent" ? "ring-2 ring-green-700" : ""
                }`}
                onClick={() => handlePrioritySelect("Non-Urgent")}
              >
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
