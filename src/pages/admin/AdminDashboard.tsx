import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, Car, Activity } from "lucide-react";
import Map from "@/components/Map";

interface ParkingSpot {
  id: number;
  status: "available" | "occupied" | "pending";
  plateNumber?: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      status: "available"
    }))
  );
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [showMap, setShowMap] = useState(false);

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
      setShowMap(true);
    }
  };

  // ... keep existing code (Hero Section)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {showMap ? (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Map
            parkingLocation={[-74.006, 40.7128]}
            onBack={() => setShowMap(false)}
          />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 md:py-20 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left md:w-1/2">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Admin Control Center</h1>
                  <p className="text-lg md:text-xl text-white/90">
                    Manage parking operations efficiently and securely
                  </p>
                </div>
                <div className="flex gap-6 md:w-1/2 justify-center">
                  <div className="text-center">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Security</p>
                  </div>
                  <div className="text-center">
                    <Car className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Parking</p>
                  </div>
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-6xl mx-auto px-4 py-8">
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

            {/* Main Content */}
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Verify & Open Gate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
