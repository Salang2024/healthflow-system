
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Stethoscope, Beaker, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const modules = [
    {
      title: "Patient Registration",
      description: "Register new patients and manage appointments",
      icon: <UserPlus className="h-10 w-10 text-medical-600" />,
      path: "/reception/registration",
      color: "bg-gradient-to-tr from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Triage",
      description: "Record vital signs and patient assessments",
      icon: <Stethoscope className="h-10 w-10 text-emergency-600" />,
      path: "/triage",
      color: "bg-gradient-to-tr from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
    },
    {
      title: "Doctor",
      description: "Manage patient consultations and treatment plans",
      icon: <Stethoscope className="h-10 w-10 text-green-600" />,
      path: "/doctor",
      color: "bg-gradient-to-tr from-green-50 to-green-100",
      borderColor: "border-green-200",
    },
    {
      title: "Laboratory",
      description: "Process lab tests and manage results",
      icon: <Beaker className="h-10 w-10 text-purple-600" />,
      path: "/laboratory",
      color: "bg-gradient-to-tr from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hospital Management Dashboard</h1>
        <p className="text-gray-500">Access all hospital modules from one place</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <Card
            key={module.title}
            className={`overflow-hidden border ${module.borderColor} hover:shadow-md transition-all`}
          >
            <div className={`p-6 ${module.color}`}>
              <div className="mb-4">{module.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
              <Link
                to={module.path}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Open Module <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
