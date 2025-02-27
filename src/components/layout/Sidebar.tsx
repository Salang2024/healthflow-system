
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LayoutDashboard, UserPlus, Stethoscope, Beaker, ChevronDown, TestTube, Download, FileText, Clock, Trash, Settings, List, Upload, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  onToggleSubmenu?: () => void;
  active?: boolean;
}

const SidebarItem = ({ icon, label, to, hasSubmenu, isSubmenuOpen, onToggleSubmenu, active }: SidebarItemProps) => (
  <div className="w-full">
    <Link to={to} className="no-underline text-white">
      <div className={cn("flex items-center px-4 py-3 hover:bg-white/10 text-white", 
                        active && "bg-[#00758f]")}>
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
  const location = useLocation();

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if we're in the laboratory section
  const isLaboratory = location.pathname.includes("/laboratory");
  const currentPath = location.pathname;

  return (
    <div className={cn(
      "bg-[#1e335b] h-screen flex flex-col transition-all", // Changed to dark blue color to match design
      expanded ? "w-[220px]" : "w-[60px]"
    )}>
      <div className="p-3 border-b border-[#2a4272] flex justify-between items-center">
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
        {isLaboratory ? (
          // Laboratory sidebar items when in laboratory section
          <>
            <SidebarItem 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="Dashboard" 
              to="/dashboard" 
            />
            <SidebarItem 
              icon={<TestTube className="h-5 w-5" />} 
              label="Collect Specimen" 
              to="/laboratory" 
              active={currentPath === "/laboratory"}
            />
            <SidebarItem 
              icon={<Download className="h-5 w-5" />} 
              label="Receive Specimen" 
              to="/laboratory/receive" 
              active={currentPath === "/laboratory/receive"}
            />
            <SidebarItem 
              icon={<FileText className="h-5 w-5" />} 
              label="Patient Lab Results" 
              to="/laboratory/results" 
              active={currentPath === "/laboratory/results"}
            />
            <SidebarItem 
              icon={<Clock className="h-5 w-5" />} 
              label="View Previous Lab Results" 
              to="/laboratory/previous" 
              active={currentPath === "/laboratory/previous"}
            />
            <SidebarItem 
              icon={<Trash className="h-5 w-5" />} 
              label="Sample Disposal" 
              to="/laboratory/disposal" 
              active={currentPath === "/laboratory/disposal"}
            />
            <SidebarItem 
              icon={<Settings className="h-5 w-5" />} 
              label="Laboratory Setup" 
              to="/laboratory/setup" 
              active={currentPath === "/laboratory/setup"}
              hasSubmenu={true}
              isSubmenuOpen={openSubmenus["lab-setup"]}
              onToggleSubmenu={() => toggleSubmenu("lab-setup")}
            />
            {expanded && openSubmenus["lab-setup"] && (
              <div className="bg-[#152641] pl-12">
                <Link to="/laboratory/setup" className="block py-2 text-white hover:bg-white/10 no-underline">
                  General Settings
                </Link>
                <Link to="/laboratory/setup/parameters" className="block py-2 text-white hover:bg-white/10 no-underline">
                  Parameters
                </Link>
              </div>
            )}
            <SidebarItem 
              icon={<List className="h-5 w-5" />} 
              label="Laboratory Reports" 
              to="/laboratory/reports" 
              active={currentPath === "/laboratory/reports"}
            />
            <SidebarItem 
              icon={<Database className="h-5 w-5" />} 
              label="Items Manager" 
              to="/laboratory/items" 
              active={currentPath === "/laboratory/items"}
            />
            <SidebarItem 
              icon={<Upload className="h-5 w-5" />} 
              label="External Sample" 
              to="/laboratory/external" 
              active={currentPath === "/laboratory/external"}
            />
          </>
        ) : (
          // Regular sidebar items for other sections
          <>
            <SidebarItem 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="Dashboard" 
              to="/dashboard" 
              active={currentPath === "/dashboard"}
            />
            <SidebarItem 
              icon={<UserPlus className="h-5 w-5" />} 
              label="Reception" 
              to="/reception/registration" 
              active={currentPath.includes("/reception")}
            />
            <SidebarItem 
              icon={<Stethoscope className="h-5 w-5" />} 
              label="Triage" 
              to="/triage" 
              active={currentPath.includes("/triage")}
            />
            <SidebarItem 
              icon={<Stethoscope className="h-5 w-5" />} 
              label="Doctor" 
              to="/doctor" 
              active={currentPath.includes("/doctor")}
            />
            <SidebarItem 
              icon={<Beaker className="h-5 w-5" />} 
              label="Laboratory" 
              to="/laboratory" 
              hasSubmenu={true}
              isSubmenuOpen={openSubmenus["laboratory"]}
              onToggleSubmenu={() => toggleSubmenu("laboratory")}
              active={currentPath.includes("/laboratory")}
            />
            {expanded && openSubmenus["laboratory"] && (
              <div className="bg-[#152641] pl-12">
                <Link to="/laboratory" className="block py-2 text-white hover:bg-white/10 no-underline">
                  Collect Specimen
                </Link>
                <Link to="/laboratory/receive" className="block py-2 text-white hover:bg-white/10 no-underline">
                  Receive Specimen
                </Link>
                <Link to="/laboratory/results" className="block py-2 text-white hover:bg-white/10 no-underline">
                  Patient Lab Results
                </Link>
                <Link to="/laboratory/previous" className="block py-2 text-white hover:bg-white/10 no-underline">
                  View Previous Results
                </Link>
                <Link to="/laboratory/disposal" className="block py-2 text-white hover:bg-white/10 no-underline">
                  Sample Disposal
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
