import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {parkingSpots.map(spot => (
              <Button
                key={spot.id}
                variant={spot.status === "available" ? "outline" : "secondary"}
                className={`h-20 ${
                  spot.status === "occupied" ? "bg-red-100" :
                  spot.status === "pending" ? "bg-yellow-100" : ""
                }`}
                onClick={() => setSelectedSpot(spot)}
              >
                <div className="text-center">
                  <div>Spot {spot.id}</div>
                  <div className="text-xs">{spot.status}</div>
                  {spot.plateNumber && (
                    <div className="text-xs mt-1">{spot.plateNumber}</div>
                  )}
                </div>
              </Button>
            ))}
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Enter plate number"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
            />
            <Button onClick={handleVerifyPlate} disabled={!selectedSpot || !plateNumber}>
              Verify & Open Gate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;