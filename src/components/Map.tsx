import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { createMapMarker } from './map/MapMarker';
import { drawRoute } from './map/MapRoute';
import { DEMO_LOCATIONS } from '../data/mockLocations';
import { MAPBOX_TOKEN } from '../config/mapbox';

interface MapProps {
  parkingLocation?: [number, number];
  onBack?: () => void;
  isAdmin?: boolean;
  onLocationSelect?: (location: [number, number]) => void;
  isSelectionMode?: boolean;
  showRoute?: boolean;
}

const Map = ({ 
  parkingLocation = DEMO_LOCATIONS.userLocation, 
  onBack, 
  isAdmin = false,
  onLocationSelect,
  isSelectionMode = false,
  showRoute = false
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();

  const initializeMap = () => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: parkingLocation,
        zoom: 14
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));

      // Add place names
      map.current.on('load', () => {
        map.current?.addLayer({
          id: 'poi-labels',
          type: 'symbol',
          source: {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-streets-v8'
          },
          'source-layer': 'poi_label',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-anchor': 'top'
          },
          paint: {
            'text-color': '#666',
            'text-halo-color': '#fff',
            'text-halo-width': 1
          }
        });
      });

      // Add demo user location marker with location name
      createMapMarker({
        type: 'user',
        location: DEMO_LOCATIONS.userLocation,
        map: map.current
      });

      // Add demo parking slots with location names
      DEMO_LOCATIONS.parkingSlots.forEach(slot => {
        createMapMarker({
          type: 'parking',
          location: slot.location as [number, number],
          map: map.current!,
          status: slot.status,
          plateNumber: slot.plateNumber,
          id: slot.id
        });
      });

      if (showRoute && parkingLocation) {
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
      }

      if (isSelectionMode && onLocationSelect) {
        map.current.on('click', (e) => {
          const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
          onLocationSelect(coordinates);
        });

        toast({
          title: "Select Location",
          description: "Click on the map to select your current location",
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your internet connection.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    initializeMap();
    return () => {
      map.current?.remove();
    };
  }, [parkingLocation]);

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