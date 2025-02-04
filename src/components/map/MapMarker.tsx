import mapboxgl from 'mapbox-gl';

interface MapMarkerProps {
  type: 'user' | 'parking';
  location: [number, number];
  map: mapboxgl.Map;
  status?: 'available' | 'occupied' | 'pending';
  plateNumber?: string;
  id?: number;
  isClickable?: boolean;
  name?: string;
}

export const createMapMarker = ({ 
  type, 
  location, 
  map, 
  status, 
  plateNumber, 
  id,
  isClickable,
  name
}: MapMarkerProps) => {
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
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div class="p-2">
          <h3 class="font-bold">Your Location</h3>
          <p>Times Square</p>
        </div>
      `))
      .addTo(map);
  } else {
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.backgroundColor = status === 'available' ? '#4CAF50' : status === 'pending' ? '#FFA500' : '#FF5252';
    el.style.borderRadius = '50%';
    el.style.border = '3px solid white';
    el.style.cursor = isClickable ? 'pointer' : 'default';

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="p-2">
        <h3 class="font-bold">${name || `Parking Slot ${id}`}</h3>
        <p>Status: ${status}</p>
        ${plateNumber ? `<p>Plate: ${plateNumber}</p>` : ''}
        ${isClickable ? '<p class="text-sm text-blue-500">Click to manage</p>' : ''}
      </div>
    `);

    const marker = new mapboxgl.Marker(el)
      .setLngLat(location)
      .setPopup(popup)
      .addTo(map);

    return marker;
  }
};