import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface MapProps {
  parkingLocation?: [number, number];
  onBack?: () => void;
  isAdmin?: boolean;
}

interface ParkingSlot {
  id: number;
  location: [number, number];
  status: 'available' | 'occupied';
  plateNumber?: string;
}

const Map = ({ parkingLocation = [-74.006, 40.7128], onBack, isAdmin = false }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  // Sample parking slots data (in real app, this would come from a backend)
  const [parkingSlots] = useState<ParkingSlot[]>([
    { id: 1, location: [-74.005, 40.7125], status: 'available' },
    { id: 2, location: [-74.007, 40.7130], status: 'occupied', plateNumber: 'ABC123' },
    { id: 3, location: [-74.004, 40.7135], status: 'available' },
  ]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHNxOWt2ZWowMGRqMmptbGVtNm1uNXB2In0.Sn9qDz_dVmwR8VLhPK_qXQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: parkingLocation,
      zoom: 14
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const userCoords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(userCoords);
          console.log('User location updated:', userCoords);

          // Update or add user marker
          const el = document.createElement('div');
          el.className = 'user-marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = '#FF0000';
          el.style.border = '2px solid white';

          new mapboxgl.Marker(el)
            .setLngLat(userCoords)
            .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
            .addTo(map.current!);

          // If admin, center on user location
          if (isAdmin && map.current) {
            map.current.flyTo({
              center: userCoords,
              zoom: 14
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Error",
            description: "Unable to get your location",
            variant: "destructive"
          });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
    }

    // Add parking slot markers
    parkingSlots.forEach(slot => {
      const el = document.createElement('div');
      el.className = 'parking-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundColor = slot.status === 'available' ? '#4CAF50' : '#FF5252';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">Parking Slot ${slot.id}</h3>
          <p>Status: ${slot.status}</p>
          ${slot.plateNumber ? `<p>Plate: ${slot.plateNumber}</p>` : ''}
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat(slot.location)
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Draw route if user location is available
    if (userLocation) {
      getRoute(userLocation, parkingLocation);
    }

    return () => {
      map.current?.remove();
    };
  }, [parkingLocation, parkingSlots, isAdmin]);

  const getRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojsonData: GeoJSON.Feature = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: route
        }
      };

      if (map.current?.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData(geojsonData);
      } else {
        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojsonData
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }

      // Calculate and display distance and duration
      if (data.distance && data.duration) {
        const distance = (data.distance / 1000).toFixed(1);
        const duration = Math.round(data.duration / 60);
        
        toast({
          title: "Route Information",
          description: `Distance: ${distance}km, Duration: ${duration} minutes`,
        });
      }
    } catch (error) {
      console.error('Error getting route:', error);
    }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden">
      {onBack && (
        <Button
          variant="outline"
          className="absolute top-4 left-4 z-10 bg-white"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;