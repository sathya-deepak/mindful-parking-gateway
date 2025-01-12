import mapboxgl from 'mapbox-gl';

export const drawRoute = async (
  map: mapboxgl.Map,
  start: [number, number],
  end: [number, number],
  onRouteInfo?: (distance: string, duration: number) => void
) => {
  try {
    // Get location names using reverse geocoding
    const [startName, endName] = await Promise.all([
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${start[0]},${start[1]}.json?access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => data.features[0]?.place_name || 'Current Location'),
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${end[0]},${end[1]}.json?access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => data.features[0]?.place_name || 'Parking Location')
    ]);

    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;

    // Add markers with location names
    new mapboxgl.Popup()
      .setLngLat(start)
      .setHTML(`<h3 class="font-bold">From: ${startName}</h3>`)
      .addTo(map);

    new mapboxgl.Popup()
      .setLngLat(end)
      .setHTML(`<h3 class="font-bold">To: ${endName}</h3>`)
      .addTo(map);

    const geojsonData: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    // Add turn-by-turn instructions
    if (data.legs && data.legs[0].steps) {
      const instructions = data.legs[0].steps.map((step: any) => step.maneuver.instruction);
      const instructionsHtml = instructions
        .map((instruction: string) => `<li class="py-1">${instruction}</li>`)
        .join('');

      const instructionsContainer = document.createElement('div');
      instructionsContainer.className = 'absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-md max-h-48 overflow-y-auto';
      instructionsContainer.innerHTML = `
        <h3 class="font-bold mb-2">Directions:</h3>
        <ol class="list-decimal list-inside text-sm">${instructionsHtml}</ol>
      `;
      map.getContainer().appendChild(instructionsContainer);
    }

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