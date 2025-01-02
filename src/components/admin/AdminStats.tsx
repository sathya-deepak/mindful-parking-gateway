import { Card, CardContent } from "@/components/ui/card";
import { DEMO_LOCATIONS } from "@/data/mockLocations";

interface AdminStatsProps {
  availableSpots: number;
  occupiedSpots: number;
}

export const AdminStats = ({ availableSpots, occupiedSpots }: AdminStatsProps) => {
  const totalSpots = DEMO_LOCATIONS.parkingSlots.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Spots</h3>
          <p className="text-3xl font-bold text-blue-600">{totalSpots}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Available</h3>
          <p className="text-3xl font-bold text-green-600">{availableSpots}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Occupied</h3>
          <p className="text-3xl font-bold text-red-600">{occupiedSpots}</p>
        </CardContent>
      </Card>
    </div>
  );
};