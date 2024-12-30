import mapboxgl from 'mapbox-gl';

export const drawRoute = async (
  map: mapboxgl.Map,
  start: [number, number],
  end: [number, number],
  onRouteInfo?: (distance: string, duration: number) => void
) => {
  try {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;

    const geojsonData: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    if (map.getSource('route')) {
      (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojsonData);
    } else {
      map.addLayer({
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

    if (data.distance && data.duration && onRouteInfo) {
      const distance = (data.distance / 1000).toFixed(1);
      const duration = Math.round(data.duration / 60);
      onRouteInfo(distance, duration);
    }
  } catch (error) {
    console.error('Error getting route:', error);
  }
};