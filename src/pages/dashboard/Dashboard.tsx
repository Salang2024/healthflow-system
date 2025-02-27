
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Stethoscope, Beaker, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const modules = [
    {
      title: "Patient Registration",
      description: "Register new patients and manage appointments",
      icon: <UserPlus className="h-10 w-10 text-white" />,
      path: "/reception/registration",
      color: "bg-[#009933]",
      borderColor: "border-green-700",
    },
    {
      title: "Triage",
      description: "Record vital signs and patient assessments",
      icon: <Stethoscope className="h-10 w-10 text-white" />,
      path: "/triage",
      color: "bg-[#009933]",
      borderColor: "border-green-700",
    },
    {
      title: "Doctor",
      description: "Manage patient consultations and treatment plans",
      icon: <Stethoscope className="h-10 w-10 text-white" />,
      path: "/doctor",
      color: "bg-[#009933]",
      borderColor: "border-green-700",
    },
    {
      title: "Laboratory",
      description: "Process lab tests and manage results",
      icon: <Beaker className="h-10 w-10 text-white" />,
      path: "/laboratory",
      color: "bg-[#009933]",
      borderColor: "border-green-700",
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
              <h2 className="text-xl font-semibold mb-2 text-white">{module.title}</h2>
              <p className="text-sm text-white mb-4">{module.description}</p>
              <Link
                to={module.path}
                className="inline-flex items-center text-white hover:text-green-200"
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
