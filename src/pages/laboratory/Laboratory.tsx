
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Beaker, 
  FileText, 
  Clock, 
  Search, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  Filter,
  ArrowLeft,
  ArrowRight
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
    name: "Jasmine Bahasha Salugole",
    patientNumber: "5758",
    age: 38,
    gender: "Female",
    phoneNumber: "0754385050",
    sponsor: "CASH",
    doctorName: "Marcelina sweetbert rwegasira",
    priority: "Normal",
    orderedDate: "2024-02-27"
  },
  {
    id: "P002",
    name: "Rehema S Mmomi",
    patientNumber: "9653",
    age: 69,
    gender: "Female",
    phoneNumber: "0652570500",
    sponsor: "NHIF",
    doctorName: "Marcelina sweetbert rwegasira",
    priority: "Normal",
    orderedDate: "2024-02-27"
  },
  {
    id: "P003",
    name: "Usama M Khamisi",
    patientNumber: "9662",
    age: 29,
    gender: "Male",
    phoneNumber: "0658695339",
    sponsor: "NHIF",
    doctorName: "aman twaha msemakweli",
    priority: "Normal",
    orderedDate: "2024-02-27"
  },
  {
    id: "P004",
    name: "Celina Willan Asalila",
    patientNumber: "9663",
    age: 30,
    gender: "Female",
    phoneNumber: "0742761059",
    sponsor: "CASH",
    doctorName: "Mwalimu Ame Abeid",
    priority: "Normal",
    orderedDate: "2024-02-27"
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
  const [startDate, setStartDate] = useState("2025-02-27 00:00");
  const [endDate, setEndDate] = useState("2025-02-27 23:59");
  const [patientStatus, setPatientStatus] = useState("All");
  const [department, setDepartment] = useState("Laboratory");
  const [currentPage, setCurrentPage] = useState(1);
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

  return (
    <div className="w-full">
      {/* Top department and change bar */}
      <div className="bg-white flex justify-between items-center px-4 py-2 border-b">
        <div className="flex items-center">
          <span className="font-semibold">Sub Department</span>
          <span className="ml-4 px-4 py-1 bg-blue-100 rounded">Laboratory</span>
        </div>
        <Button variant="outline" className="bg-blue-900 text-white hover:bg-blue-800">
          Change
        </Button>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-4 border-b">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div>
            <Input 
              type="datetime-local" 
              className="w-full" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Input 
              type="datetime-local" 
              className="w-full" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <Select value={patientStatus} onValueChange={setPatientStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Patient Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laboratory">Laboratory</SelectItem>
                <SelectItem value="All Departments">All Departments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sponsor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sponsors</SelectItem>
                <SelectItem value="cash">CASH</SelectItem>
                <SelectItem value="nhif">NHIF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input 
              placeholder="Patient Name" 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Button variant="ghost" className="absolute right-1 top-1 h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Input placeholder="Patient Number" className="pl-10" />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Button variant="ghost" className="absolute right-1 top-1 h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Legend and title */}
      <div className="p-4 bg-white border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Laboratory Sample Collection Patient List</h2>
          <div className="flex gap-4">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-green-500 rounded-sm mr-1"></div>
              <span className="text-xs">Normal Patient</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-blue-500 rounded-sm mr-1"></div>
              <span className="text-xs">VIP Patient</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-red-500 rounded-sm mr-1"></div>
              <span className="text-xs">Urgent Patient</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-yellow-300 rounded-sm mr-1"></div>
              <span className="text-xs">Contain Processed Test</span>
            </div>
          </div>
        </div>
      </div>

      {/* Patient table */}
      <div className="bg-white border-b overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Number</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient, index) => (
              <tr 
                key={patient.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setActivePatient(patient)}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className={`py-1 px-2 text-center ${
                    patient.priority === "Normal" ? "bg-green-500 text-white" : 
                    patient.priority === "Urgent" ? "bg-red-500 text-white" : 
                    "bg-blue-500 text-white"
                  }`}>
                    {patient.priority}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.patientNumber}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.sponsor}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.age} years</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.gender}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.phoneNumber}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.doctorName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.orderedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white p-4 flex justify-center items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Go to first page</span>
          <span>«</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Go to previous page</span>
          <span>‹</span>
        </Button>
        <Button size="sm" className="h-8 w-8 p-0 bg-cyan-400 hover:bg-cyan-500">
          1
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Go to next page</span>
          <span>›</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Go to last page</span>
          <span>»</span>
        </Button>
      </div>

      {/* Original tabs content - Will only show when a patient is selected */}
      {activePatient && (
        <Tabs defaultValue="collection" className="mt-4 p-4 bg-white">
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
              <FileText className="h-5 w-5" />
              Patient Lab Results
              <span className="ml-1 bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-1">
                {receivedTests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="previous" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#009933]">
              <Clock className="h-5 w-5" />
              View Previous Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="collection" className="p-4 border rounded-lg shadow-sm">
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => setActivePatient(null)}
            >
              Back to Patient List
            </Button>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{activePatient.name}</p>
                  <p className="text-xs text-gray-500">ID: {activePatient.patientNumber}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm">{activePatient.age} years</p>
                  <p className="text-xs text-gray-500">{activePatient.gender}</p>
                </div>
              </div>
              <div>
                <p className="text-sm">Doctor: {activePatient.doctorName}</p>
                <p className="text-xs text-gray-500">Sponsor: {activePatient.sponsor}</p>
              </div>
              <div>
                <p className="text-sm">Phone: {activePatient.phoneNumber}</p>
                <div className={`text-xs inline-flex items-center px-2 py-1 rounded-full ${
                  activePatient.priority === "Urgent" ? "bg-red-100 text-red-800" : 
                  activePatient.priority === "VIP" ? "bg-purple-100 text-purple-800" : 
                  "bg-green-100 text-green-800"
                }`}>
                  {activePatient.priority}
                </div>
              </div>
            </div>
            
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
          </TabsContent>
          
          <TabsContent value="reception" className="p-4 border rounded-lg shadow-sm">
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => setActivePatient(null)}
            >
              Back to Patient List
            </Button>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{activePatient.name}</p>
                  <p className="text-xs text-gray-500">ID: {activePatient.patientNumber}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm">{activePatient.age} years</p>
                  <p className="text-xs text-gray-500">{activePatient.gender}</p>
                </div>
              </div>
              <div>
                <p className="text-sm">Doctor: {activePatient.doctorName}</p>
                <p className="text-xs text-gray-500">Sponsor: {activePatient.sponsor}</p>
              </div>
              <div>
                <p className="text-sm">Phone: {activePatient.phoneNumber}</p>
                <div className={`text-xs inline-flex items-center px-2 py-1 rounded-full ${
                  activePatient.priority === "Urgent" ? "bg-red-100 text-red-800" : 
                  activePatient.priority === "VIP" ? "bg-purple-100 text-purple-800" : 
                  "bg-green-100 text-green-800"
                }`}>
                  {activePatient.priority}
                </div>
              </div>
            </div>
            
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
          </TabsContent>
          
          <TabsContent value="results" className="p-4 border rounded-lg shadow-sm">
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => setActivePatient(null)}
            >
              Back to Patient List
            </Button>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{activePatient.name}</p>
                  <p className="text-xs text-gray-500">ID: {activePatient.patientNumber}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm">{activePatient.age} years</p>
                  <p className="text-xs text-gray-500">{activePatient.gender}</p>
                </div>
              </div>
              <div>
                <p className="text-sm">Doctor: {activePatient.doctorName}</p>
                <p className="text-xs text-gray-500">Sponsor: {activePatient.sponsor}</p>
              </div>
              <div>
                <p className="text-sm">Phone: {activePatient.phoneNumber}</p>
                <div className={`text-xs inline-flex items-center px-2 py-1 rounded-full ${
                  activePatient.priority === "Urgent" ? "bg-red-100 text-red-800" : 
                  activePatient.priority === "VIP" ? "bg-purple-100 text-purple-800" : 
                  "bg-green-100 text-green-800"
                }`}>
                  {activePatient.priority}
                </div>
              </div>
            </div>
            
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
      )}
    </div>
  );
};

export default Laboratory;
