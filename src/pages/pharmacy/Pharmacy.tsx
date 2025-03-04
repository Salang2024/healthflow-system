
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pill, 
  Search, 
  ChevronDown, 
  Filter, 
  FileCheck, 
  Clock, 
  Check, 
  X, 
  CreditCard 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for prescriptions
const initialPrescriptions = [
  {
    id: 'P001',
    patientName: 'John Smith',
    patientId: 'PT10045',
    doctorName: 'Dr. Williams',
    date: '2023-09-15',
    status: 'pending',
    medications: [
      { id: 'M1', name: 'Amoxicillin 500mg', dosage: '1 tab TID', quantity: 21, price: 12.50 },
      { id: 'M2', name: 'Paracetamol 500mg', dosage: '1 tab QID PRN', quantity: 20, price: 5.00 },
    ]
  },
  {
    id: 'P002',
    patientName: 'Emma Johnson',
    patientId: 'PT10062',
    doctorName: 'Dr. Martinez',
    date: '2023-09-15',
    status: 'pending',
    medications: [
      { id: 'M3', name: 'Losartan 50mg', dosage: '1 tab OD', quantity: 30, price: 18.75 },
    ]
  },
  {
    id: 'P003',
    patientName: 'Michael Brown',
    patientId: 'PT10078',
    doctorName: 'Dr. Smith',
    date: '2023-09-14',
    status: 'approved',
    medications: [
      { id: 'M4', name: 'Metformin 500mg', dosage: '1 tab BD', quantity: 60, price: 15.20 },
      { id: 'M5', name: 'Aspirin 81mg', dosage: '1 tab OD', quantity: 30, price: 4.50 },
    ]
  },
  {
    id: 'P004',
    patientName: 'Sarah Wilson',
    patientId: 'PT10103',
    doctorName: 'Dr. Johnson',
    date: '2023-09-14',
    status: 'paid',
    medications: [
      { id: 'M6', name: 'Atorvastatin 20mg', dosage: '1 tab OD', quantity: 30, price: 22.40 },
    ]
  },
];

type PrescriptionStatus = 'pending' | 'approved' | 'rejected' | 'paid';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  price: number;
}

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  status: PrescriptionStatus;
  medications: Medication[];
  rejectionReason?: string;
}

const Pharmacy = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (status: PrescriptionStatus) => {
    // Filter prescriptions by status
    return prescriptions.filter(prescription => 
      prescription.status === status && 
      (searchTerm === '' || 
       prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const pendingPrescriptions = handleStatusFilter('pending');
  const approvedPrescriptions = handleStatusFilter('approved');
  const paidPrescriptions = handleStatusFilter('paid');

  const calculateTotal = (medications: Medication[]) => {
    return medications.reduce((sum, med) => sum + (med.price * med.quantity), 0).toFixed(2);
  };

  const handleApprovePrescription = (id: string) => {
    setPrescriptions(prev => 
      prev.map(prescription => 
        prescription.id === id 
          ? { ...prescription, status: 'approved' } 
          : prescription
      )
    );
    toast({
      title: "Prescription Approved",
      description: "Patient can now proceed to payment",
    });
    setSelectedPrescription(null);
  };

  const handleRejectPrescription = (id: string) => {
    if (!rejectionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for rejection",
      });
      return;
    }

    setPrescriptions(prev => 
      prev.map(prescription => 
        prescription.id === id 
          ? { ...prescription, status: 'rejected', rejectionReason } 
          : prescription
      )
    );
    toast({
      title: "Prescription Rejected",
      description: "The prescription has been rejected",
    });
    setSelectedPrescription(null);
    setRejectionReason('');
  };

  const handleProcessPayment = (id: string) => {
    setPrescriptions(prev => 
      prev.map(prescription => 
        prescription.id === id 
          ? { ...prescription, status: 'paid' } 
          : prescription
      )
    );
    toast({
      title: "Payment Processed",
      description: "Medication is ready for dispensing",
    });
    setSelectedPrescription(null);
  };

  const PrescriptionTable = ({ prescriptions, onSelect }: { prescriptions: Prescription[], onSelect: (p: Prescription) => void }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2 text-left">Doctor</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Items</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription) => (
              <tr key={prescription.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{prescription.id}</td>
                <td className="px-4 py-2">
                  <div>{prescription.patientName}</div>
                  <div className="text-xs text-gray-500">{prescription.patientId}</div>
                </td>
                <td className="px-4 py-2">{prescription.doctorName}</td>
                <td className="px-4 py-2">{prescription.date}</td>
                <td className="px-4 py-2">{prescription.medications.length}</td>
                <td className="px-4 py-2">${calculateTotal(prescription.medications)}</td>
                <td className="px-4 py-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelect(prescription)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                No prescriptions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pharmacy</h1>
        <p className="text-gray-500">Manage medication prescriptions and dispensing</p>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-medical-600" />
                Prescription Management
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search patient ID/name..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Pending ({pendingPrescriptions.length})</span>
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span>Approved ({approvedPrescriptions.length})</span>
                </TabsTrigger>
                <TabsTrigger value="paid" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Paid ({paidPrescriptions.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <PrescriptionTable 
                  prescriptions={pendingPrescriptions} 
                  onSelect={setSelectedPrescription} 
                />
              </TabsContent>
              
              <TabsContent value="approved">
                <PrescriptionTable 
                  prescriptions={approvedPrescriptions} 
                  onSelect={setSelectedPrescription} 
                />
              </TabsContent>
              
              <TabsContent value="paid">
                <PrescriptionTable 
                  prescriptions={paidPrescriptions} 
                  onSelect={setSelectedPrescription} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {selectedPrescription && (
          <Card>
            <CardHeader>
              <CardTitle>Prescription Details</CardTitle>
              <CardDescription>
                <div className="flex justify-between">
                  <span>ID: {selectedPrescription.id} | Patient: {selectedPrescription.patientName} ({selectedPrescription.patientId})</span>
                  <span>Prescribed by: {selectedPrescription.doctorName} on {selectedPrescription.date}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Medications</h3>
                <table className="w-full border-collapse mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Medication</th>
                      <th className="px-4 py-2 text-left">Dosage</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Unit Price</th>
                      <th className="px-4 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrescription.medications.map((med) => (
                      <tr key={med.id} className="border-b">
                        <td className="px-4 py-2">{med.name}</td>
                        <td className="px-4 py-2">{med.dosage}</td>
                        <td className="px-4 py-2">{med.quantity}</td>
                        <td className="px-4 py-2">${med.price.toFixed(2)}</td>
                        <td className="px-4 py-2">${(med.price * med.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan={4} className="px-4 py-2 text-right">Total:</td>
                      <td className="px-4 py-2">${calculateTotal(selectedPrescription.medications)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPrescription(null)}
                >
                  Close
                </Button>
                
                {selectedPrescription.status === 'pending' && (
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter reason for rejection..."
                        className="w-60"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                      <Button 
                        variant="destructive" 
                        onClick={() => handleRejectPrescription(selectedPrescription.id)}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                    <Button 
                      className="bg-medical-600 hover:bg-medical-700 text-white flex items-center gap-2"
                      onClick={() => handleApprovePrescription(selectedPrescription.id)}
                    >
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                )}
                
                {selectedPrescription.status === 'approved' && (
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                    onClick={() => handleProcessPayment(selectedPrescription.id)}
                  >
                    <CreditCard className="h-4 w-4" /> Process Payment
                  </Button>
                )}
                
                {selectedPrescription.status === 'paid' && (
                  <div className="flex items-center text-medical-600">
                    <Check className="h-5 w-5 mr-2" /> Payment Completed
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Pharmacy;
