
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, LayoutDashboard, UserPlus, Stethoscope, Beaker, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  onToggleSubmenu?: () => void;
}

const SidebarItem = ({ icon, label, to, hasSubmenu, isSubmenuOpen, onToggleSubmenu }: SidebarItemProps) => (
  <div className="w-full">
    <Link to={to} className="no-underline text-white">
      <div className="flex items-center px-4 py-3 hover:bg-white/10 text-white">
        <div className="mr-3">{icon}</div>
        <span className="flex-1">{label}</span>
        {hasSubmenu && (
          <ChevronDown 
            className={cn("h-4 w-4 transition-transform", isSubmenuOpen ? "transform rotate-180" : "")} 
            onClick={(e) => {
              e.preventDefault();
              onToggleSubmenu?.();
            }}
          />
        )}
      </div>
    </Link>
  </div>
);

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className={cn(
      "bg-[#192042] h-screen flex flex-col transition-all",
      expanded ? "w-[220px]" : "w-[60px]"
    )}>
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <Button 
          variant="ghost" 
          className="p-2 text-white hover:bg-white/10" 
          onClick={() => setExpanded(!expanded)}
        >
          <Menu className="h-5 w-5" />
          {expanded && <span className="ml-2">Toggle Menu View</span>}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <SidebarItem 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Dashboard" 
          to="/dashboard" 
        />
        <SidebarItem 
          icon={<UserPlus className="h-5 w-5" />} 
          label="Reception" 
          to="/reception/registration" 
        />
        <SidebarItem 
          icon={<Stethoscope className="h-5 w-5" />} 
          label="Triage" 
          to="/triage" 
        />
        <SidebarItem 
          icon={<Stethoscope className="h-5 w-5" />} 
          label="Doctor" 
          to="/doctor" 
        />
        <SidebarItem 
          icon={<Beaker className="h-5 w-5" />} 
          label="Laboratory" 
          to="/laboratory" 
          hasSubmenu={true}
          isSubmenuOpen={openSubmenus["laboratory"]}
          onToggleSubmenu={() => toggleSubmenu("laboratory")}
        />
        {expanded && openSubmenus["laboratory"] && (
          <div className="bg-[#121a36] pl-12">
            <Link to="/laboratory" className="block py-2 text-white hover:bg-white/10 no-underline">
              Collect Specimen
            </Link>
            <Link to="/laboratory" className="block py-2 text-white hover:bg-white/10 no-underline">
              Receive Specimen
            </Link>
            <Link to="/laboratory" className="block py-2 text-white hover:bg-white/10 no-underline">
              Patient Lab Results
            </Link>
            <Link to="/laboratory" className="block py-2 text-white hover:bg-white/10 no-underline">
              View Previous Lab Results
            </Link>
            <Link to="/laboratory" className="block py-2 text-white hover:bg-white/10 no-underline">
              Sample Disposal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
