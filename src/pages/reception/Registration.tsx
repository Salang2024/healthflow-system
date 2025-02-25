
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserPlus } from "lucide-react";

const Registration = () => {
  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
        <p className="text-gray-500">Register new patients and manage appointments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-medical-600" />
              New Patient Registration
            </CardTitle>
            <CardDescription>Enter patient's personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" className="medical-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" className="medical-input" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="flex gap-2">
                  <Input
                    id="dob"
                    type="date"
                    className="medical-input"
                  />
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  className="medical-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  className="medical-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter address"
                  className="medical-input"
                />
              </div>

              <Button className="w-full bg-medical-600 hover:bg-medical-700 text-white">
                Register Patient
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>Last 5 patient registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This will be populated with actual data */}
              <p className="text-muted-foreground text-sm">No recent registrations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
