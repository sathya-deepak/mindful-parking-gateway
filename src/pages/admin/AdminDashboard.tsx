import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import Map from "@/components/Map";
import { useNavigate } from "react-router-dom";
import { DEMO_LOCATIONS } from "@/data/mockLocations";
import { AdminStats } from "@/components/admin/AdminStats";
import { ParkingSpotGrid } from "@/components/admin/ParkingSpotGrid";
import { ProgressSteps } from "@/components/admin/ProgressSteps";
import { ParkingSpot } from "@/types/parking";

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

  const handleSlotClick = (slotId: number) => {
    const spot = parkingSpots.find(s => s.id === slotId);
    if (spot) {
      setSelectedSpot(spot);
      if (spot.status === 'available') {
        setParkingSpots(spots =>
          spots.map(s =>
            s.id === slotId
              ? { ...s, status: 'occupied', plateNumber: 'ADMIN-MARKED' }
              : s
          )
        );
        toast({
          title: "Spot Updated",
          description: "Parking spot marked as occupied",
        });
      } else {
        setParkingSpots(spots =>
          spots.map(s =>
            s.id === slotId
              ? { ...s, status: 'available', plateNumber: undefined }
              : s
          )
        );
        toast({
          title: "Spot Updated",
          description: "Parking spot marked as available",
        });
      }
    }
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

  const availableSpots = parkingSpots.filter(spot => spot.status === "available").length;
  const occupiedSpots = parkingSpots.filter(spot => spot.status === "occupied").length;

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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressSteps currentStep={step} />

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
                onSlotClick={handleSlotClick}
              />
            </CardContent>
          </Card>
        )}

        {step === 'manage-spots' && (
          <>
            <AdminStats 
              availableSpots={parkingSpots.filter(spot => spot.status === 'available').length}
              occupiedSpots={parkingSpots.filter(spot => spot.status === 'occupied').length}
            />

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-blue-800">Parking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ParkingSpotGrid 
                  spots={parkingSpots}
                  selectedSpot={selectedSpot}
                  onSpotSelect={setSelectedSpot}
                />

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
                onSlotClick={handleSlotClick}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
