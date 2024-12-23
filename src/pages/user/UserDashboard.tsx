import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Car } from "lucide-react";

interface ParkingSpot {
  id: number;
  status: "available" | "occupied" | "pending";
  plateNumber?: string;
}

const UserDashboard = () => {
  const { toast } = useToast();
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      status: "available"
    }))
  );
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const handleBookSpot = () => {
    if (selectedSpot && plateNumber) {
      setParkingSpots(spots =>
        spots.map(spot =>
          spot.id === selectedSpot.id
            ? { ...spot, status: "pending", plateNumber }
            : spot
        )
      );
      toast({
        title: "Spot Reserved",
        description: `Please wait for admin verification at spot ${selectedSpot.id}`,
      });
      setPlateNumber("");
      setSelectedSpot(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Car className="w-16 h-16 mx-auto mb-6 text-white/90" />
          <h1 className="text-4xl font-bold mb-4">Smart Parking Solutions</h1>
          <p className="text-xl text-white/90 mb-8">
            Find and book your parking spot with ease. Real-time availability and instant booking.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-800">Available Parking Spots</CardTitle>
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
                    "hover:border-purple-500 hover:text-purple-700"
                  } ${
                    selectedSpot?.id === spot.id ? "ring-2 ring-purple-500" : ""
                  }`}
                  onClick={() => spot.status === "available" && setSelectedSpot(spot)}
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
              <Button 
                onClick={handleBookSpot} 
                disabled={!selectedSpot || !plateNumber}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Book Selected Spot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;