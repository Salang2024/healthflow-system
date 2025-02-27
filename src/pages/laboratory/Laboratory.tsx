
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Beaker, 
  FileCheck, 
  ClockIcon, 
  Search, 
  CheckCircle, 
  XCircle,
  Calendar,
  User
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data types
interface Patient {
  id: string;
  name: string;
  patientNumber: string;
  age: number;
  gender: "Male" | "Female";
  phoneNumber: string;
  sponsor: string;
  doctorName: string;
  priority: "Normal" | "Urgent" | "VIP";
  orderedDate: string;
}

interface LabTest {
  id: string;
  patientId: string;
  testType: string;
  sampleId: string;
  status: "pending_collection" | "collected" | "rejected" | "received" | "completed";
  results: string;
  requestDate: string;
  collectedDate?: string;
  receivedDate?: string;
  completedDate?: string;
  price?: number;
  paymentStatus?: string;
  sampleType?: string;
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "John Doe",
    patientNumber: "5758",
    age: 38,
    gender: "Male",
    phoneNumber: "0754385050",
    sponsor: "CASH",
    doctorName: "Dr. Smith",
    priority: "Normal",
    orderedDate: "2024-02-27"
  },
  {
    id: "P002",
    name: "Jane Smith",
    patientNumber: "9653",
    age: 45,
    gender: "Female",
    phoneNumber: "0652570500",
    sponsor: "NHIF",
    doctorName: "Dr. Johnson",
    priority: "Urgent",
    orderedDate: "2024-02-27"
  },
  {
    id: "P003",
    name: "Robert Brown",
    patientNumber: "9662",
    age: 29,
    gender: "Male",
    phoneNumber: "0658695339",
    sponsor: "NHIF",
    doctorName: "Dr. Williams",
    priority: "Normal",
    orderedDate: "2024-02-27"
  },
  {
    id: "P004",
    name: "Elizabeth Kapela",
    patientNumber: "9380",
    age: 25,
    gender: "Female",
    phoneNumber: "0712345678",
    sponsor: "CASH",
    doctorName: "Dr. Shaban",
    priority: "Normal",
    orderedDate: "2024-02-21"
  }
];

const mockLabTests: LabTest[] = [
  {
    id: "LAB001",
    patientId: "P001",
    testType: "Blood Test",
    sampleId: "93627",
    status: "pending_collection",
    results: "",
    requestDate: "2024-02-27",
    price: 15000,
    paymentStatus: "Billed",
    sampleType: "Blood"
  },
  {
    id: "LAB002",
    patientId: "P002",
    testType: "Urine Analysis",
    sampleId: "93628",
    status: "pending_collection",
    results: "",
    requestDate: "2024-02-27",
    price: 10000,
    paymentStatus: "Billed",
    sampleType: "Urine"
  },
  {
    id: "LAB003",
    patientId: "P003",
    testType: "Helicobacter pylori",
    sampleId: "93629",
    status: "pending_collection",
    results: "",
    requestDate: "2024-02-27",
    price: 15000,
    paymentStatus: "Billed",
    sampleType: "Stool"
  },
  {
    id: "LAB004",
    patientId: "P004",
    testType: "HIV",
    sampleId: "91996",
    status: "collected",
    results: "",
    requestDate: "2024-02-21",
    collectedDate: "2024-02-21",
    price: 20000,
    paymentStatus: "Billed",
    sampleType: "Blood"
  },
  {
    id: "LAB005",
    patientId: "P004",
    testType: "FBP (Full Blood Picture)",
    sampleId: "91997",
    status: "collected",
    results: "",
    requestDate: "2024-02-21",
    collectedDate: "2024-02-21",
    price: 18000,
    paymentStatus: "Billed",
    sampleType: "Blood"
  },
  {
    id: "LAB006",
    patientId: "P004",
    testType: "Blood grouping",
    sampleId: "91998",
    status: "collected",
    results: "",
    requestDate: "2024-02-21",
    collectedDate: "2024-02-21",
    price: 12000,
    paymentStatus: "Billed",
    sampleType: "Blood"
  },
  {
    id: "LAB007",
    patientId: "P001",
    testType: "Serum Amylase",
    sampleId: "94001",
    status: "received",
    results: "",
    requestDate: "2024-02-26",
    collectedDate: "2024-02-27",
    receivedDate: "2024-02-27",
    price: 22000,
    paymentStatus: "Billed",
    sampleType: "Blood"
  }
];

const Laboratory = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [labResults, setLabResults] = useState("");
  const { toast } = useToast();

  // Filter tests based on their status
  const pendingCollectionTests = labTests.filter(test => test.status === "pending_collection");
  const collectedTests = labTests.filter(test => test.status === "collected");
  const receivedTests = labTests.filter(test => test.status === "received" || test.status === "completed");

  // Get tests for a specific patient
  const getPatientTests = (patientId: string, status?: LabTest["status"]) => {
    if (status) {
      return labTests.filter(test => test.patientId === patientId && test.status === status);
    }
    return labTests.filter(test => test.patientId === patientId);
  };

  // Get patient by ID
  const getPatientById = (patientId: string) => {
    return patients.find(patient => patient.id === patientId);
  };

  // Handle test collection
  const collectSpecimen = (testId: string) => {
    setLabTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { ...test, status: "collected", collectedDate: new Date().toISOString().split('T')[0] } 
          : test
      )
    );
    
    toast({
      title: "Specimen Collected",
      description: "The specimen has been marked as collected",
    });
  };

  // Handle test rejection
  const rejectSpecimen = (testId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for rejection",
      });
      return;
    }

    setLabTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { ...test, status: "rejected", results: `Rejected: ${reason}` } 
          : test
      )
    );
    
    toast({
      title: "Specimen Rejected",
      description: `The specimen has been rejected: ${reason}`,
    });
    setRejectReason("");
  };

  // Handle test reception
  const receiveSpecimen = (testId: string) => {
    setLabTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { ...test, status: "received", receivedDate: new Date().toISOString().split('T')[0] } 
          : test
      )
    );
    
    toast({
      title: "Specimen Received",
      description: "The specimen has been marked as received",
    });
  };

  // Handle test completion
  const completeTest = (testId: string, results: string) => {
    if (!results.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter test results",
      });
      return;
    }

    setLabTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { ...test, status: "completed", results, completedDate: new Date().toISOString().split('T')[0] } 
          : test
      )
    );
    
    toast({
      title: "Test Completed",
      description: "The test has been completed and results saved",
    });
    setLabResults("");
  };

  // Filter patients based on search term
  const filteredPatients = searchTerm
    ? patients.filter(
        patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.patientNumber.includes(searchTerm)
      )
    : patients;

  // Render patient details
  const renderPatientDetails = (patient: Patient) => (
    <div className="bg-blue-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      <div className="flex items-center">
        <User className="mr-2 h-5 w-5 text-gray-500" />
        <div>
          <p className="text-sm font-medium">{patient.name}</p>
          <p className="text-xs text-gray-500">ID: {patient.patientNumber}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-gray-500" />
        <div>
          <p className="text-sm">{patient.age} years</p>
          <p className="text-xs text-gray-500">{patient.gender}</p>
        </div>
      </div>
      <div>
        <p className="text-sm">Doctor: {patient.doctorName}</p>
        <p className="text-xs text-gray-500">Sponsor: {patient.sponsor}</p>
      </div>
      <div>
        <p className="text-sm">Phone: {patient.phoneNumber}</p>
        <div className={`text-xs inline-flex items-center px-2 py-1 rounded-full ${
          patient.priority === "Urgent" ? "bg-red-100 text-red-800" : 
          patient.priority === "VIP" ? "bg-purple-100 text-purple-800" : 
          "bg-green-100 text-green-800"
        }`}>
          {patient.priority}
        </div>
      </div>
    </div>
  );

  // Collection Tab Content
  const CollectionTab = () => (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search patient by name or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {activePatient ? (
          <div>
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => setActivePatient(null)}
            >
              Back to Patient List
            </Button>
            
            {renderPatientDetails(activePatient)}
            
            <h3 className="text-lg font-medium mb-4">Pending Tests for Collection</h3>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPatientTests(activePatient.id, "pending_collection").map((test) => (
                    <tr key={test.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.sampleId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.testType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.sampleType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.price}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.paymentStatus}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-[#009933] hover:bg-[#007a29]"
                          onClick={() => collectSpecimen(test.id)}
                        >
                          Collect
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => {
                            const reason = prompt("Please provide a reason for rejection");
                            if (reason) {
                              rejectSpecimen(test.id, reason);
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getPatientTests(activePatient.id, "pending_collection").length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No pending tests for collection
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Tests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.filter(
                  patient => getPatientTests(patient.id, "pending_collection").length > 0
                ).map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.patientNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.age}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.gender}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.doctorName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        patient.priority === "Urgent" ? "bg-red-100 text-red-800" : 
                        patient.priority === "VIP" ? "bg-purple-100 text-purple-800" : 
                        "bg-green-100 text-green-800"
                      }`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {getPatientTests(patient.id, "pending_collection").length}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setActivePatient(patient)}
                      >
                        View Tests
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.filter(
              patient => getPatientTests(patient.id, "pending_collection").length > 0
            ).length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No patients with pending tests
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Reception Tab Content
  const ReceptionTab = () => (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search patient by name or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {activePatient ? (
          <div>
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => setActivePatient(null)}
            >
              Back to Patient List
            </Button>
            
            {renderPatientDetails(activePatient)}
            
            <h3 className="text-lg font-medium mb-4">Collected Tests Pending Reception</h3>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Quality</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPatientTests(activePatient.id, "collected").map((test) => (
                    <tr key={test.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.sampleId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.testType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.sampleType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.collectedDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Select defaultValue="good">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sample quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="acceptable">Acceptable</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-[#009933] hover:bg-[#007a29]"
                          onClick={() => receiveSpecimen(test.id)}
                        >
                          Receive
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => {
                            const reason = prompt("Please provide a reason for rejection");
                            if (reason) {
                              rejectSpecimen(test.id, reason);
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getPatientTests(activePatient.id, "collected").length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No collected tests pending reception
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected Tests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.filter(
                  patient => getPatientTests(patient.id, "collected").length > 0
                ).map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.patientNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.age}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.gender}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.doctorName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        patient.priority === "Urgent" ? "bg-red-100 text-red-800" : 
                        patient.priority === "VIP" ? "bg-purple-100 text-purple-800" : 
                        "bg-green-100 text-green-800"
                      }`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {getPatientTests(patient.id, "collected").length}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setActivePatient(patient)}
                      >
                        View Tests
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.filter(
              patient => getPatientTests(patient.id, "collected").length > 0
            ).length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No patients with collected tests
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Results Tab Content
  const ResultsTab = () => (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search patient by name or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {activePatient ? (
          <div>
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => setActivePatient(null)}
            >
              Back to Patient List
            </Button>
            
            {renderPatientDetails(activePatient)}
            
            <h3 className="text-lg font-medium mb-4">Received Tests Pending Results</h3>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Results</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPatientTests(activePatient.id, "received").map((test) => (
                    <tr key={test.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.sampleId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.testType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.sampleType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.collectedDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.receivedDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Input
                          placeholder="Enter test results..."
                          value={labResults}
                          onChange={(e) => setLabResults(e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Button 
                          size="sm" 
                          className="bg-[#009933] hover:bg-[#007a29]"
                          onClick={() => completeTest(test.id, labResults)}
                        >
                          Save Results
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getPatientTests(activePatient.id, "received").length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No received tests pending results
                </div>
              )}
            </div>

            <h3 className="text-lg font-medium mt-8 mb-4">Completed Tests</h3>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPatientTests(activePatient.id, "completed").map((test) => (
                    <tr key={test.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.sampleId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.testType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.sampleType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{test.completedDate}</td>
                      <td className="px-4 py-3 text-sm">{test.results}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          Print Results
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getPatientTests(activePatient.id, "completed").length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No completed tests
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received Tests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.filter(
                  patient => getPatientTests(patient.id, "received").length > 0 || getPatientTests(patient.id, "completed").length > 0
                ).map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.patientNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.age}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.gender}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.doctorName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        patient.priority === "Urgent" ? "bg-red-100 text-red-800" : 
                        patient.priority === "VIP" ? "bg-purple-100 text-purple-800" : 
                        "bg-green-100 text-green-800"
                      }`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {getPatientTests(patient.id, "received").length}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setActivePatient(patient)}
                      >
                        View Tests
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.filter(
              patient => getPatientTests(patient.id, "received").length > 0 || getPatientTests(patient.id, "completed").length > 0
            ).length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No patients with received or completed tests
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Laboratory Management</h1>
        <p className="text-gray-500">Manage laboratory tests, specimens, and results</p>
      </div>

      <Tabs defaultValue="collection">
        <TabsList className="w-full border-b pb-0 mb-4">
          <TabsTrigger value="collection" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#009933]">
            <Beaker className="h-5 w-5" />
            Collect Specimen
            <span className="ml-1 bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-1">
              {pendingCollectionTests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="reception" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#009933]">
            <CheckCircle className="h-5 w-5" />
            Receive Specimen
            <span className="ml-1 bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-1">
              {collectedTests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#009933]">
            <FileCheck className="h-5 w-5" />
            Patient Lab Results
            <span className="ml-1 bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-1">
              {receivedTests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="previous" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#009933]">
            <ClockIcon className="h-5 w-5" />
            View Previous Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="collection" className="p-4 border rounded-lg shadow-sm">
          <CollectionTab />
        </TabsContent>
        
        <TabsContent value="reception" className="p-4 border rounded-lg shadow-sm">
          <ReceptionTab />
        </TabsContent>
        
        <TabsContent value="results" className="p-4 border rounded-lg shadow-sm">
          <ResultsTab />
        </TabsContent>
        
        <TabsContent value="previous" className="p-4 border rounded-lg shadow-sm">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search patient by name or ID..."
                  className="pl-8"
                />
              </div>
              <Button>Search</Button>
            </div>
            
            <div className="text-center py-12 text-gray-500">
              Search for a patient to view their previous lab results
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Laboratory;
