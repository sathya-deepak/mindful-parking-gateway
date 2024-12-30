import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { createMapMarker } from './map/MapMarker';
import { drawRoute } from './map/MapRoute';
import { DEMO_LOCATIONS } from '../data/mockLocations';

interface MapProps {
  parkingLocation?: [number, number];
  onBack?: () => void;
  isAdmin?: boolean;
}

const Map = ({ parkingLocation = DEMO_LOCATIONS.userLocation, onBack, isAdmin = false }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHNxOWt2ZWowMGRqMmptbGVtNm1uNXB2In0.Sn9qDz_dVmwR8VLhPK_qXQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: parkingLocation,
      zoom: 14
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add demo user location marker
    createMapMarker({
      type: 'user',
      location: DEMO_LOCATIONS.userLocation,
      map: map.current
    });

    // Add demo parking slots
    DEMO_LOCATIONS.parkingSlots.forEach(slot => {
      createMapMarker({
        type: 'parking',
        location: slot.location,
        map: map.current!,
        status: slot.status,
        plateNumber: slot.plateNumber,
        id: slot.id
      });
    });

    // Draw route from user location to selected parking
    drawRoute(
      map.current,
      DEMO_LOCATIONS.userLocation,
      parkingLocation,
      (distance, duration) => {
        toast({
          title: "Route Information",
          description: `Distance: ${distance}km, Duration: ${duration} minutes`,
        });
      }
    );

    return () => {
      map.current?.remove();
    };
  }, [parkingLocation, isAdmin, toast]);

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