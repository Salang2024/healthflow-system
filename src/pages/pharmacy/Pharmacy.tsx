
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePdf, FileSpreadsheet, Package2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF, generateExcel } from "@/utils/fileExport";

// Define type for prescription status
type PrescriptionStatus = "pending" | "processing" | "ready" | "paid" | "dispensed";

// Define type for a medication
interface Medication {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  price: number;
}

// Define type for a prescription
interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  status: PrescriptionStatus;
  medications: Medication[];
  dispensedBy?: string;
  dispensedDate?: string;
}

// Sample prescription data
const initialPrescriptions: Prescription[] = [
  {
    id: "RX2023001",
    patientName: "John Doe",
    patientId: "P10023",
    doctorName: "Dr. Sarah Smith",
    date: "2023-05-15",
    status: "pending" as PrescriptionStatus,
    medications: [
      { id: "MED001", name: "Amoxicillin", dosage: "500mg 3x daily", quantity: 30, price: 15.99 },
      { id: "MED002", name: "Ibuprofen", dosage: "400mg as needed", quantity: 20, price: 8.50 }
    ]
  },
  {
    id: "RX2023002",
    patientName: "Jane Smith",
    patientId: "P10024",
    doctorName: "Dr. Michael Johnson",
    date: "2023-05-16",
    status: "ready" as PrescriptionStatus,
    medications: [
      { id: "MED003", name: "Lisinopril", dosage: "10mg daily", quantity: 30, price: 12.75 },
      { id: "MED004", name: "Simvastatin", dosage: "20mg daily", quantity: 30, price: 18.25 }
    ]
  },
  {
    id: "RX2023003",
    patientName: "Robert Brown",
    patientId: "P10025",
    doctorName: "Dr. Lisa Chen",
    date: "2023-05-16",
    status: "paid" as PrescriptionStatus,
    medications: [
      { id: "MED005", name: "Metformin", dosage: "500mg 2x daily", quantity: 60, price: 14.50 }
    ]
  },
  {
    id: "RX2023004",
    patientName: "Emily Davis",
    patientId: "P10026",
    doctorName: "Dr. James Wilson",
    date: "2023-05-17",
    status: "dispensed" as PrescriptionStatus,
    medications: [
      { id: "MED006", name: "Atorvastatin", dosage: "40mg daily", quantity: 30, price: 22.99 },
      { id: "MED007", name: "Hydrochlorothiazide", dosage: "25mg daily", quantity: 30, price: 10.25 }
    ],
    dispensedBy: "Pharmacist Johnson",
    dispensedDate: "2023-05-18"
  }
];

const Pharmacy = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProcessPrescription = (id: string) => {
    setPrescriptions(prevPrescriptions =>
      prevPrescriptions.map(prescription =>
        prescription.id === id
          ? { ...prescription, status: "processing" as PrescriptionStatus }
          : prescription
      )
    );
    toast({
      title: "Processing Prescription",
      description: `Prescription ${id} is now being processed.`,
    });
  };

  const handleMarkAsReady = (id: string) => {
    setPrescriptions(prevPrescriptions =>
      prevPrescriptions.map(prescription =>
        prescription.id === id
          ? { ...prescription, status: "ready" as PrescriptionStatus }
          : prescription
      )
    );
    toast({
      title: "Prescription Ready",
      description: `Prescription ${id} is ready for payment and pickup.`,
    });
  };

  const handleMarkAsPaid = (id: string) => {
    setPrescriptions(prevPrescriptions =>
      prevPrescriptions.map(prescription =>
        prescription.id === id
          ? { ...prescription, status: "paid" as PrescriptionStatus }
          : prescription
      )
    );
    toast({
      title: "Payment Received",
      description: `Payment received for prescription ${id}.`,
    });
  };

  const handleDispenseMedication = (id: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    setPrescriptions(prevPrescriptions =>
      prevPrescriptions.map(prescription =>
        prescription.id === id
          ? { 
              ...prescription, 
              status: "dispensed" as PrescriptionStatus,
              dispensedBy: "Pharmacist on Duty",
              dispensedDate: currentDate
            }
          : prescription
      )
    );
    toast({
      title: "Medication Dispensed",
      description: `Prescription ${id} has been dispensed to the patient.`,
    });
  };

  const handlePrescriptionSelect = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
  };

  const calculateTotal = (medications: Medication[]) => {
    return medications.reduce((total, med) => total + (med.price * med.quantity), 0);
  };

  const downloadPrescriptionPDF = (prescription: Prescription) => {
    generatePDF(prescription);
    toast({
      title: "PDF Generated",
      description: `Prescription ${prescription.id} PDF downloaded.`,
    });
  };

  const downloadPrescriptionExcel = (prescription: Prescription) => {
    generateExcel(prescription);
    toast({
      title: "Excel Generated",
      description: `Prescription ${prescription.id} Excel data downloaded.`,
    });
  };

  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pharmacy Management</h1>
        <p className="text-gray-500">Process prescriptions and dispense medications</p>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Prescriptions</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search prescriptions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="ready">Ready</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="dispensed">Dispensed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="divide-y">
                    {filteredPrescriptions.length > 0 ? (
                      filteredPrescriptions.map(prescription => (
                        <div key={prescription.id} className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors" onClick={() => handlePrescriptionSelect(prescription)}>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{prescription.patientName}</div>
                              <div className="text-sm text-gray-500">RX: {prescription.id} | {prescription.date}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                prescription.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                prescription.status === "processing" ? "bg-blue-100 text-blue-800" :
                                prescription.status === "ready" ? "bg-green-100 text-green-800" :
                                prescription.status === "paid" ? "bg-purple-100 text-purple-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">No prescriptions found</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="pending">
                  <div className="divide-y">
                    {filteredPrescriptions.filter(p => p.status === "pending").length > 0 ? (
                      filteredPrescriptions
                        .filter(p => p.status === "pending")
                        .map(prescription => (
                          <div key={prescription.id} className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors" onClick={() => handlePrescriptionSelect(prescription)}>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{prescription.patientName}</div>
                                <div className="text-sm text-gray-500">RX: {prescription.id} | {prescription.date}</div>
                              </div>
                              <Button size="sm" onClick={(e) => { e.stopPropagation(); handleProcessPrescription(prescription.id); }}>
                                Process
                              </Button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">No pending prescriptions</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="ready">
                  <div className="divide-y">
                    {filteredPrescriptions.filter(p => p.status === "ready").length > 0 ? (
                      filteredPrescriptions
                        .filter(p => p.status === "ready")
                        .map(prescription => (
                          <div key={prescription.id} className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors" onClick={() => handlePrescriptionSelect(prescription)}>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{prescription.patientName}</div>
                                <div className="text-sm text-gray-500">RX: {prescription.id} | {prescription.date}</div>
                              </div>
                              <Button size="sm" onClick={(e) => { e.stopPropagation(); handleMarkAsPaid(prescription.id); }}>
                                Mark as Paid
                              </Button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">No ready prescriptions</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="paid">
                  <div className="divide-y">
                    {filteredPrescriptions.filter(p => p.status === "paid").length > 0 ? (
                      filteredPrescriptions
                        .filter(p => p.status === "paid")
                        .map(prescription => (
                          <div key={prescription.id} className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors" onClick={() => handlePrescriptionSelect(prescription)}>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{prescription.patientName}</div>
                                <div className="text-sm text-gray-500">RX: {prescription.id} | {prescription.date}</div>
                              </div>
                              <Button size="sm" variant="default" className="bg-medical-600 hover:bg-medical-700" onClick={(e) => { e.stopPropagation(); handleDispenseMedication(prescription.id); }}>
                                <Package2 className="mr-1 h-4 w-4" />
                                Dispense
                              </Button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">No paid prescriptions</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="dispensed">
                  <div className="divide-y">
                    {filteredPrescriptions.filter(p => p.status === "dispensed").length > 0 ? (
                      filteredPrescriptions
                        .filter(p => p.status === "dispensed")
                        .map(prescription => (
                          <div key={prescription.id} className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors" onClick={() => handlePrescriptionSelect(prescription)}>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{prescription.patientName}</div>
                                <div className="text-sm text-gray-500">RX: {prescription.id} | {prescription.date}</div>
                                <div className="text-xs text-medical-600">Dispensed on: {prescription.dispensedDate}</div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); downloadPrescriptionPDF(prescription); }}>
                                  <FilePdf className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); downloadPrescriptionExcel(prescription); }}>
                                  <FileSpreadsheet className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">No dispensed prescriptions</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/3">
          {selectedPrescription ? (
            <Card>
              <CardHeader>
                <CardTitle>Prescription Details</CardTitle>
                <CardDescription>
                  ID: {selectedPrescription.id} | Patient: {selectedPrescription.patientName} ({selectedPrescription.patientId})
                  <div className="mt-1">
                    Prescribed by: {selectedPrescription.doctorName} on {selectedPrescription.date}
                  </div>
                  {selectedPrescription.status === 'dispensed' && (
                    <div className="mt-2 text-medical-600 font-medium">
                      Dispensed by: {selectedPrescription.dispensedBy} on {selectedPrescription.dispensedDate}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Medications</h4>
                    <div className="space-y-2">
                      {selectedPrescription.medications.map(medication => (
                        <div key={medication.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{medication.name}</div>
                          <div className="text-sm text-gray-500">Dosage: {medication.dosage}</div>
                          <div className="text-sm flex justify-between mt-2">
                            <span>Quantity: {medication.quantity}</span>
                            <span>${medication.price.toFixed(2)} each</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-semibold text-lg">${calculateTotal(selectedPrescription.medications).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {selectedPrescription.status === "pending" && (
                  <Button onClick={() => handleProcessPrescription(selectedPrescription.id)}>Process</Button>
                )}
                {selectedPrescription.status === "processing" && (
                  <Button onClick={() => handleMarkAsReady(selectedPrescription.id)}>Mark as Ready</Button>
                )}
                {selectedPrescription.status === "ready" && (
                  <Button onClick={() => handleMarkAsPaid(selectedPrescription.id)}>Mark as Paid</Button>
                )}
                {selectedPrescription.status === "paid" && (
                  <Button className="bg-medical-600 hover:bg-medical-700" onClick={() => handleDispenseMedication(selectedPrescription.id)}>
                    <Package2 className="mr-2 h-4 w-4" />
                    Dispense Medication
                  </Button>
                )}
                {selectedPrescription.status === "dispensed" && (
                  <div className="flex w-full space-x-2">
                    <Button variant="outline" className="flex-1" onClick={() => downloadPrescriptionPDF(selectedPrescription)}>
                      <FilePdf className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => downloadPrescriptionExcel(selectedPrescription)}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Download Excel
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Prescription Details</CardTitle>
                <CardDescription>Select a prescription to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Package2 className="h-12 w-12 mb-4 text-gray-300" />
                  <p>No prescription selected</p>
                  <p className="text-sm mt-1">Click on a prescription from the list to view its details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
