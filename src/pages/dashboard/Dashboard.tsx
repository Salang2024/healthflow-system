
import React from "react";
import { Link } from "react-router-dom";

const modules = [
  { title: "Patient Registration", path: "/reception/registration", color: "bg-purple-600" },
  { title: "Triage", path: "/triage", color: "bg-emerald-500" },
  { title: "Doctor", path: "/doctor", color: "bg-blue-600" },
  { title: "Laboratory Works", path: "/laboratory", color: "bg-pink-500" },
  { title: "Pharmacy Works", path: "/pharmacy", color: "bg-green-500" },
  { title: "Billing Works", path: "/billing", color: "bg-red-500" },
  { title: "Patient Records", path: "/records", color: "bg-indigo-800" },
  { title: "Management Works", path: "/management", color: "bg-yellow-500" },
  { title: "Emergency works", path: "/emergency", color: "bg-purple-700" },
  { title: "Quality Assurance Works", path: "/quality", color: "bg-lime-500" },
  { title: "Storage and Supply Works", path: "/supply", color: "bg-blue-600" },
  { title: "Setup And Configuration", path: "/setup", color: "bg-red-500" },
];

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {modules.map((module, index) => (
          <Link
            key={index}
            to={module.path}
            className={`${module.color} text-white p-4 h-24 flex items-center justify-center hover:opacity-90 transition-opacity`}
          >
            <span className="text-lg font-medium">{module.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
