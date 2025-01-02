import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, Car, Activity, LogOut, MapPin, Navigation } from "lucide-react";
import Map from "@/components/Map";
import { useNavigate } from "react-router-dom";
import { DEMO_LOCATIONS } from "@/data/mockLocations";

interface ParkingSpot {
  id: number;
  status: "available" | "occupied" | "pending";
  plateNumber?: string;
  location?: [number, number];
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<'select-location' | 'manage-spots' | 'view-route'>('select-location');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(
    DEMO_LOCATIONS.parkingSlots.map(slot => ({
      id: slot.id,
      status: slot.status === 'occupied' ? 'occupied' : 'available',
      plateNumber: slot.plateNumber,
      location: slot.location as [number, number]
    }))
  );
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const handleLocationSelect = (location: [number, number]) => {
    setSelectedLocation(location);
    setStep('manage-spots');
    toast({
      title: "Location Selected",
      description: "You can now manage parking spots in this area.",
    });
  };

  const handleVerifyPlate = () => {
    if (selectedSpot && plateNumber) {
      setParkingSpots(spots =>
        spots.map(spot =>
          spot.id === selectedSpot.id
            ? { ...spot, status: "occupied", plateNumber }
            : spot
        )
      );
      toast({
        title: "Vehicle Verified",
        description: `Gate opened for vehicle ${plateNumber}`,
      });
      setPlateNumber("");
      setSelectedSpot(null);
      setStep('view-route');
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="p-4">
        <Button 
          onClick={handleLogout}
          className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === 'select-location' ? 'text-blue-600' : 'text-gray-400'}`}>
              <MapPin className="h-5 w-5 mr-2" />
              <span>Select Location</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className={`flex items-center ${step === 'manage-spots' ? 'text-blue-600' : 'text-gray-400'}`}>
              <Car className="h-5 w-5 mr-2" />
              <span>Manage Spots</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className={`flex items-center ${step === 'view-route' ? 'text-blue-600' : 'text-gray-400'}`}>
              <Navigation className="h-5 w-5 mr-2" />
              <span>View Route</span>
            </div>
          </div>
        </div>

        {step === 'select-location' && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-blue-800">Select Area to Manage</CardTitle>
            </CardHeader>
            <CardContent>
              <Map 
                onLocationSelect={handleLocationSelect}
                isSelectionMode={true}
                isAdmin={true}
              />
            </CardContent>
          </Card>
        )}

        {step === 'manage-spots' && (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Total Spots</h3>
                  <p className="text-3xl font-bold text-blue-600">10</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Available</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {parkingSpots.filter(spot => spot.status === "available").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Occupied</h3>
                  <p className="text-3xl font-bold text-red-600">
                    {parkingSpots.filter(spot => spot.status === "occupied").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Parking Management */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-blue-800">Parking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                  {parkingSpots.map(spot => (
                    <Button
                      key={spot.id}
                      variant={spot.status === "available" ? "outline" : "secondary"}
                      className={`h-24 w-full transition-all hover:scale-105 ${
                        spot.status === "occupied" ? "bg-red-100 hover:bg-red-200" :
                        spot.status === "pending" ? "bg-yellow-100 hover:bg-yellow-200" :
                        "hover:border-blue-500 hover:text-blue-700"
                      } ${
                        selectedSpot?.id === spot.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedSpot(spot)}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold">Spot {spot.id}</div>
                        <div className="text-sm capitalize">{spot.status}</div>
                        {spot.plateNumber && (
                          <div className="text-xs mt-1">{spot.plateNumber}</div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <Input
                    placeholder="Enter plate number to verify"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="text-center"
                  />
                  <Button 
                    onClick={handleVerifyPlate} 
                    disabled={!selectedSpot || !plateNumber}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Verify & Open Gate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === 'view-route' && selectedLocation && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-blue-800">View Route to Parking</CardTitle>
            </CardHeader>
            <CardContent>
              <Map 
                parkingLocation={selectedLocation}
                showRoute={true}
                isAdmin={true}
                onBack={() => setStep('manage-spots')}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;