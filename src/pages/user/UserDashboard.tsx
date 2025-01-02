import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Car, LogOut, MapPin, Navigation } from "lucide-react";
import Map from "@/components/Map";
import { useNavigate } from "react-router-dom";
import { DEMO_LOCATIONS } from "@/data/mockLocations";

interface ParkingSpot {
  id: number;
  status: "available" | "occupied" | "pending";
  plateNumber?: string;
  location?: [number, number];
}

const UserDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<'select-location' | 'book-spot' | 'navigation'>('select-location');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(
    DEMO_LOCATIONS.parkingSlots.map(slot => ({
      id: slot.id,
      status: slot.status,
      plateNumber: slot.plateNumber,
      location: slot.location as [number, number]
    }))
  );
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const handleLocationSelect = (location: [number, number]) => {
    setSelectedLocation(location);
    setStep('book-spot');
    toast({
      title: "Location Selected",
      description: "You can now choose a parking spot.",
    });
  };

  const handleBookSpot = (spot: ParkingSpot) => {
    if (spot.status === 'available' && plateNumber) {
      setParkingSpots(spots =>
        spots.map(s =>
          s.id === spot.id
            ? { ...s, status: "pending", plateNumber }
            : s
        )
      );
      setSelectedSpot(spot);
      setStep('navigation');
      toast({
        title: "Spot Reserved",
        description: `Parking spot ${spot.id} has been reserved for you.`,
      });
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="p-4">
        <Button 
          onClick={handleLogout}
          className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === 'select-location' ? 'text-blue-600' : 'text-gray-400'}`}>
              <MapPin className="h-5 w-5 mr-2" />
              <span>Select Location</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className={`flex items-center ${step === 'book-spot' ? 'text-blue-600' : 'text-gray-400'}`}>
              <Car className="h-5 w-5 mr-2" />
              <span>Book Spot</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className={`flex items-center ${step === 'navigation' ? 'text-blue-600' : 'text-gray-400'}`}>
              <Navigation className="h-5 w-5 mr-2" />
              <span>Navigation</span>
            </div>
          </div>
        </div>

        {step === 'select-location' && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-blue-800">Select Your Location</CardTitle>
            </CardHeader>
            <CardContent>
              <Map 
                onLocationSelect={handleLocationSelect}
                isSelectionMode={true}
              />
            </CardContent>
          </Card>
        )}

        {step === 'book-spot' && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-blue-800">Choose a Parking Spot</CardTitle>
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
                    }`}
                    onClick={() => spot.status === "available" && handleBookSpot(spot)}
                    disabled={spot.status !== "available"}
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
                  placeholder="Enter your plate number"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="text-center"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'navigation' && selectedSpot && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-blue-800">Navigate to Your Spot</CardTitle>
            </CardHeader>
            <CardContent>
              <Map 
                parkingLocation={selectedSpot.location}
                showRoute={true}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;