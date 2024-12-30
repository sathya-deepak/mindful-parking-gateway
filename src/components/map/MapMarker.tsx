import mapboxgl from 'mapbox-gl';

interface MapMarkerProps {
  type: 'user' | 'parking';
  location: [number, number];
  map: mapboxgl.Map;
  status?: 'available' | 'occupied';
  plateNumber?: string;
  id?: number;
}

export const createMapMarker = ({ type, location, map, status, plateNumber, id }: MapMarkerProps) => {
  const el = document.createElement('div');
  el.className = `${type}-marker`;
  
  if (type === 'user') {
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#FF0000';
    el.style.border = '2px solid white';
    
    new mapboxgl.Marker(el)
      .setLngLat(location)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
      .addTo(map);
  } else {
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.backgroundColor = status === 'available' ? '#4CAF50' : '#FF5252';
    el.style.borderRadius = '50%';
    el.style.border = '3px solid white';
    el.style.cursor = 'pointer';

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="p-2">
        <h3 class="font-bold">Parking Slot ${id}</h3>
        <p>Status: ${status}</p>
        ${plateNumber ? `<p>Plate: ${plateNumber}</p>` : ''}
      </div>
    `);

    new mapboxgl.Marker(el)
      .setLngLat(location)
      .setPopup(popup)
      .addTo(map);
  }
};