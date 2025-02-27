
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Beaker, FileCheck, ClockIcon } from "lucide-react";

interface LabTest {
  id: string;
  patientName: string;
  testType: string;
  requestedBy: string;
  status: "pending" | "in-progress" | "completed";
  results: string;
  requestDate: string;
}

const Laboratory = () => {
  const [labTests, setLabTests] = useState<LabTest[]>([
    {
      id: "LAB001",
      patientName: "John Doe",
      testType: "Blood Test",
      requestedBy: "Dr. Smith",
      status: "pending",
      results: "",
      requestDate: "2024-02-20",
    },
    {
      id: "LAB002",
      patientName: "Jane Smith",
      testType: "Urine Analysis",
      requestedBy: "Dr. Johnson",
      status: "in-progress",
      results: "",
      requestDate: "2024-02-20",
    },
  ]);

  const [newResult, setNewResult] = useState("");
  const { toast } = useToast();

  const updateTestStatus = (testId: string, status: LabTest["status"], results: string = "") => {
    setLabTests((prev) =>
      prev.map((test) =>
        test.id === testId
          ? {
              ...test,
              status,
              results,
            }
          : test
      )
    );

    toast({
      title: "Test Status Updated",
      description: `Test ${testId} has been marked as ${status}`,
    });
  };

  const getStatusColor = (status: LabTest["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "in-progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: LabTest["status"]) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-5 w-5" />;
      case "in-progress":
        return <Beaker className="h-5 w-5" />;
      case "completed":
        return <FileCheck className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Laboratory Management</h1>
        <p className="text-gray-500">Manage laboratory tests and results</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Beaker className="h-5 w-5 text-[#009933]" />
              Pending Tests
            </CardTitle>
            <CardDescription>View and process pending laboratory tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {labTests
                .filter((test) => test.status !== "completed")
                .map((test) => (
                  <div key={test.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{test.patientName}</h3>
                        <p className="text-sm text-gray-500">{test.testType}</p>
                        <p className="text-xs text-gray-400">Requested by: {test.requestedBy}</p>
                        <p className="text-xs text-gray-400">Date: {test.requestDate}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${getStatusColor(test.status)}`}>
                        {getStatusIcon(test.status)}
                        <span className="text-sm capitalize">{test.status}</span>
                      </div>
                    </div>

                    {test.status === "pending" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => updateTestStatus(test.id, "in-progress")}
                      >
                        Start Processing
                      </Button>
                    )}

                    {test.status === "in-progress" && (
                      <div className="space-y-2">
                        <Label htmlFor={`results-${test.id}`}>Test Results</Label>
                        <Input
                          id={`results-${test.id}`}
                          placeholder="Enter test results"
                          value={newResult}
                          onChange={(e) => setNewResult(e.target.value)}
                        />
                        <Button
                          className="w-full bg-[#009933] hover:bg-[#007a29]"
                          onClick={() => {
                            if (newResult.trim()) {
                              updateTestStatus(test.id, "completed", newResult);
                              setNewResult("");
                            } else {
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description: "Please enter test results",
                              });
                            }
                          }}
                        >
                          Complete Test
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileCheck className="h-5 w-5 text-[#009933]" />
              Completed Tests
            </CardTitle>
            <CardDescription>View completed laboratory tests and results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {labTests
                .filter((test) => test.status === "completed")
                .map((test) => (
                  <div key={test.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{test.patientName}</h3>
                        <p className="text-sm text-gray-500">{test.testType}</p>
                        <p className="text-xs text-gray-400">Requested by: {test.requestedBy}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${getStatusColor(test.status)}`}>
                        <FileCheck className="h-5 w-5" />
                        <span className="text-sm">Completed</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label>Results</Label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{test.results}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Laboratory;
