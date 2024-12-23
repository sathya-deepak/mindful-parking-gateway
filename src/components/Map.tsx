import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface MapProps {
  parkingLocation?: [number, number];
  onBack?: () => void;
}

const Map = ({ parkingLocation = [-74.006, 40.7128], onBack }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHNxOWt2ZWowMGRqMmptbGVtNm1uNXB2In0.Sn9qDz_dVmwR8VLhPK_qXQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: parkingLocation,
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(userCoords);

          // Add user marker
          new mapboxgl.Marker({ color: '#FF0000' })
            .setLngLat(userCoords)
            .setPopup(new mapboxgl.Popup().setHTML('<h3>You are here</h3>'))
            .addTo(map.current!);

          // Add parking location marker
          new mapboxgl.Marker({ color: '#0000FF' })
            .setLngLat(parkingLocation)
            .setPopup(new mapboxgl.Popup().setHTML('<h3>Parking Location</h3>'))
            .addTo(map.current!);

          // Draw route
          getRoute(userCoords, parkingLocation);
        },
        () => {
          toast({
            title: "Error",
            description: "Unable to get your location",
            variant: "destructive"
          });
        }
      );
    }

    return () => {
      map.current?.remove();
    };
  }, [parkingLocation]);

  const getRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson: mapboxgl.GeoJSONSourceRaw = {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
      };

      if (map.current?.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson.data);
      } else {
        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: geojson,
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