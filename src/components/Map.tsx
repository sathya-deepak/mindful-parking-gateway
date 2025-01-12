import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { createMapMarker } from './map/MapMarker';
import { drawRoute } from './map/MapRoute';
import { DEMO_LOCATIONS } from '../data/mockLocations';
import { Input } from './ui/input';
import { Card } from './ui/card';

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
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || '';
  });
  const [isTokenValid, setIsTokenValid] = useState(false);

  const validateAndSaveToken = async (token: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/0,0.json?access_token=${token}`
      );
      
      if (response.ok) {
        localStorage.setItem('mapbox_token', token);
        setMapboxToken(token);
        setIsTokenValid(true);
        toast({
          title: "Success",
          description: "Mapbox token validated successfully",
        });
        initializeMap(token);
      } else {
        toast({
          title: "Invalid Token",
          description: "Please check your Mapbox token and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error validating token:', error);
      toast({
        title: "Error",
        description: "Failed to validate Mapbox token",
        variant: "destructive"
      });
    }
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = token;
      
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
    if (mapboxToken && !isTokenValid) {
      validateAndSaveToken(mapboxToken);
    }
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  if (!isTokenValid) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Mapbox Token Required</h2>
        <p className="text-sm text-gray-600 mb-4">
          Please enter your Mapbox public token. You can find this in your Mapbox account dashboard.
        </p>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your Mapbox token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button 
            onClick={() => validateAndSaveToken(mapboxToken)}
            className="w-full"
          >
            Validate & Save Token
          </Button>
        </div>
      </Card>
    );
  }

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