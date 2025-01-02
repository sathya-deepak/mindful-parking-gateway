export interface ParkingSpot {
  id: number;
  status: "available" | "occupied" | "pending";
  plateNumber?: string;
  location?: [number, number];
}