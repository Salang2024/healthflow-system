
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  onOpen: () => void;
}

export const LocationSelector = ({ onOpen }: LocationSelectorProps) => {
  const [department, setDepartment] = useState<string>("");

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Select your working location</h2>
      
      <div className="mb-6">
        <Label htmlFor="department" className="text-sm font-medium flex items-center">
          Sub Department <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lab-general">Laboratory General</SelectItem>
            <SelectItem value="lab-hematology">Laboratory Hematology</SelectItem>
            <SelectItem value="lab-biochemistry">Laboratory Biochemistry</SelectItem>
            <SelectItem value="lab-microbiology">Laboratory Microbiology</SelectItem>
            <SelectItem value="lab-pathology">Laboratory Pathology</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onOpen}
          className="bg-[#009933] hover:bg-[#007a29] text-white font-semibold"
          disabled={!department}
        >
          OPEN
        </Button>
      </div>
    </div>
  );
};
