
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Stethoscope, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClinicalNotes {
  subjectiveData: string;
  objectiveData: string;
  assessment: string;
  plan: string;
  diagnosis: string;
  investigations: string;
  prescriptions: string;
  remarks: string;
}

const initialNotes: ClinicalNotes = {
  subjectiveData: "",
  objectiveData: "",
  assessment: "",
  plan: "",
  diagnosis: "",
  investigations: "",
  prescriptions: "",
  remarks: "",
};

const Doctor = () => {
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNotes>(initialNotes);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setClinicalNotes((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!clinicalNotes.diagnosis || !clinicalNotes.plan) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Diagnosis and treatment plan are required.",
      });
      return;
    }

    // Here you would typically save the data to your backend
    console.log("Saving clinical notes:", clinicalNotes);
    
    toast({
      title: "Success",
      description: "Clinical notes saved successfully",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctor's Consultation</h1>
        <p className="text-gray-500">Record patient consultation details and treatment plan</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="h-5 w-5 text-primary" />
              Clinical Assessment
            </CardTitle>
            <CardDescription>Document patient examination and findings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjectiveData">Patient History (S)</Label>
                <Input
                  id="subjectiveData"
                  placeholder="Enter patient's history and complaints"
                  value={clinicalNotes.subjectiveData}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectiveData">Clinical Findings (O)</Label>
                <Input
                  id="objectiveData"
                  placeholder="Enter examination findings"
                  value={clinicalNotes.objectiveData}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment">Assessment (A)</Label>
                <Input
                  id="assessment"
                  placeholder="Enter clinical assessment"
                  value={clinicalNotes.assessment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Treatment Plan (P)</Label>
                <Input
                  id="plan"
                  placeholder="Enter treatment plan"
                  value={clinicalNotes.plan}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-primary" />
              Diagnosis & Orders
            </CardTitle>
            <CardDescription>Record diagnosis, investigations and prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Input
                  id="diagnosis"
                  placeholder="Enter diagnosis"
                  value={clinicalNotes.diagnosis}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investigations">Investigations</Label>
                <Input
                  id="investigations"
                  placeholder="Enter required investigations"
                  value={clinicalNotes.investigations}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescriptions">Prescriptions</Label>
                <Input
                  id="prescriptions"
                  placeholder="Enter medications"
                  value={clinicalNotes.prescriptions}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Additional Remarks</Label>
                <Input
                  id="remarks"
                  placeholder="Enter any additional notes"
                  value={clinicalNotes.remarks}
                  onChange={handleInputChange}
                />
              </div>

              <Button type="submit">
                Save Clinical Notes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Doctor;
