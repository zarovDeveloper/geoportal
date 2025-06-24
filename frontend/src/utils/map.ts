import { fromLonLat } from 'ol/proj';

export function getDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371000; // радиус Земли в метрах
  const toRad = (d: number) => d * Math.PI / 180;
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const wmsUrl = 'http://localhost:8080/mapserver?map=/etc/mapserver/geoportal.map';

export const LAYERS_CONFIG = [
  {
    id: 'boundary',
    name: 'Границы',
    params: { LAYERS: 'boundary', STYLES: '', FORMAT: 'image/png', TRANSPARENT: true, VERSION: '1.3.0' },
    visible: true,
  },
  {
    id: 'attraction',
    name: 'Достопримечательности',
    params: { LAYERS: 'attraction', STYLES: '', FORMAT: 'image/png', TRANSPARENT: true, VERSION: '1.3.0' },
    visible: false,
  },
  {
    id: 'museum',
    name: 'Музеи',
    params: { LAYERS: 'museum', STYLES: '', FORMAT: 'image/png', TRANSPARENT: true, VERSION: '1.3.0' },
    visible: false,
  },
  {
    id: 'park',
    name: 'Парки',
    params: { LAYERS: 'park', STYLES: '', FORMAT: 'image/png', TRANSPARENT: true, VERSION: '1.3.0' },
    visible: false,
  },
];

export const center = fromLonLat([60.6057, 56.838]);
