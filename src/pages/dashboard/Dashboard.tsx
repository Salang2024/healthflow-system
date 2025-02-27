
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Stethoscope,
  ClipboardList,
  Building2,
  Beaker,
  Pill,
  FileBarChart,
  BedDouble,
  BoxesIcon,
  Settings,
  UserCog,
  Microscope,
  BadgeDollarSign,
  Heart,
  GraduationCap,
  Scale,
  BookCopy,
} from "lucide-react";

// Define module groups with their relationships
const moduleGroups = [
  {
    title: "Patient Care Flow",
    description: "Primary patient journey modules",
    modules: [
      {
        title: "Reception",
        icon: Users,
        path: "/reception/registration",
        color: "bg-blue-500",
        description: "Patient registration and appointments",
        connects: ["Triage", "Billing", "Records"],
      },
      {
        title: "Triage",
        icon: ClipboardList,
        path: "/triage",
        color: "bg-green-500",
        description: "Patient vital signs and assessment",
        connects: ["Doctor", "Emergency"],
      },
      {
        title: "Doctor",
        icon: Stethoscope,
        path: "/doctor",
        color: "bg-indigo-500",
        description: "Clinical consultations and notes",
        connects: ["Laboratory", "Pharmacy", "Radiology"],
      },
    ],
  },
  {
    title: "Clinical Support",
    description: "Diagnostic and treatment support services",
    modules: [
      {
        title: "Laboratory",
        icon: Beaker,
        path: "/laboratory",
        color: "bg-purple-500",
        description: "Lab tests and results",
        connects: ["Doctor", "Records"],
      },
      {
        title: "Pharmacy",
        icon: Pill,
        path: "/pharmacy",
        color: "bg-pink-500",
        description: "Medication dispensing",
        connects: ["Doctor", "Billing", "Storage"],
      },
      {
        title: "Radiology",
        icon: Microscope,
        path: "/radiology",
        color: "bg-cyan-500",
        description: "Imaging services",
        connects: ["Doctor", "Records"],
      },
    ],
  },
  {
    title: "Administrative",
    description: "Hospital management and operations",
    modules: [
      {
        title: "Admission",
        icon: BedDouble,
        path: "/admission",
        color: "bg-red-500",
        description: "Inpatient management",
        connects: ["Doctor", "Billing"],
      },
      {
        title: "Billing",
        icon: BadgeDollarSign,
        path: "/billing",
        color: "bg-emerald-500",
        description: "Patient accounts",
        connects: ["Reception", "Pharmacy", "Records"],
      },
      {
        title: "Reports",
        icon: FileBarChart,
        path: "/reports",
        color: "bg-yellow-500",
        description: "Analytics and reporting",
        connects: ["All modules"],
      },
    ],
  },
  {
    title: "Support Services",
    description: "Operational support and maintenance",
    modules: [
      {
        title: "Storage",
        icon: BoxesIcon,
        path: "/storage",
        color: "bg-orange-500",
        description: "Inventory and supplies",
        connects: ["Pharmacy", "Laboratory"],
      },
      {
        title: "Emergency",
        icon: Heart,
        path: "/emergency",
        color: "bg-rose-500",
        description: "Emergency services",
        connects: ["Triage", "Doctor"],
      },
      {
        title: "Records",
        icon: BookCopy,
        path: "/records",
        color: "bg-lime-500",
        description: "Document management",
        connects: ["All departments"],
      },
    ],
  },
  {
    title: "Management",
    description: "Hospital administration and quality control",
    modules: [
      {
        title: "Settings",
        icon: Settings,
        path: "/settings",
        color: "bg-gray-500",
        description: "System configuration",
        connects: ["All modules"],
      },
      {
        title: "Human Resource",
        icon: UserCog,
        path: "/hr",
        color: "bg-teal-500",
        description: "Staff management",
        connects: ["Training", "Settings"],
      },
      {
        title: "Training",
        icon: GraduationCap,
        path: "/training",
        color: "bg-violet-500",
        description: "Staff development",
        connects: ["Human Resource", "Quality Assurance"],
      },
      {
        title: "Quality Assurance",
        icon: Scale,
        path: "/quality",
        color: "bg-fuchsia-500",
        description: "Standards compliance",
        connects: ["All departments"],
      },
    ],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
        <p className="text-gray-500">Access all hospital management modules</p>
      </div>

      <div className="space-y-8">
        {moduleGroups.map((group, index) => (
          <div key={index} className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">{group.title}</h2>
              <p className="text-sm text-gray-500">{group.description}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.modules.map((module) => (
                <Card
                  key={module.path}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate(module.path)}
                >
                  <div className={`rounded-full w-12 h-12 ${module.color} flex items-center justify-center mb-4`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{module.description}</p>
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Connects with: </span>
                    {module.connects.join(", ")}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

