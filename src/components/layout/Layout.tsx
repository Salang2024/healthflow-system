
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { LocationSelector } from "../location/LocationSelector";

export const Layout = () => {
  const [locationSelected, setLocationSelected] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto bg-[#f6f7f8]">
          {!locationSelected ? (
            <div className="max-w-4xl mx-auto p-6">
              <LocationSelector onOpen={() => setLocationSelected(true)} />
            </div>
          ) : (
            <div className={`animate-fadeIn ${isDashboard ? "p-2" : "p-6"}`}>
              <Outlet />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white py-2 px-6 text-right text-xs text-gray-500 border-t">
        Powered by Healthcare Management System
      </div>
    </div>
  );
};
