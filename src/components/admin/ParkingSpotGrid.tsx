import { Button } from "@/components/ui/button";
import { ParkingSpot } from "@/types/parking";

interface ParkingSpotGridProps {
  spots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot) => void;
}

export const ParkingSpotGrid = ({ spots, selectedSpot, onSpotSelect }: ParkingSpotGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
      {spots.map(spot => (
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
          onClick={() => onSpotSelect(spot)}
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
  );
};