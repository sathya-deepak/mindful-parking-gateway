export const DEMO_LOCATIONS = {
  userLocation: [-74.006, 40.7128] as [number, number], // New York City
  parkingSlots: [
    { id: 1, location: [-74.005, 40.7125], status: 'available' as const },
    { id: 2, location: [-74.007, 40.7130], status: 'occupied' as const, plateNumber: 'ABC123' },
    { id: 3, location: [-74.004, 40.7135], status: 'available' as const },
    { id: 4, location: [-74.008, 40.7126], status: 'available' as const },
    { id: 5, location: [-74.003, 40.7132], status: 'occupied' as const, plateNumber: 'XYZ789' },
  ]
};