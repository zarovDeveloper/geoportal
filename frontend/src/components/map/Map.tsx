import 'leaflet/dist/leaflet.css'

import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet'

const Map = () => {
    // Coordinates for Sverdlovsk Oblast
    const center: [number, number] = [58.5, 61.5]
    const mapserverUrl = '/api/v1/proxy/mapserver/'

    return (
        <MapContainer
            center={center}
            zoom={7}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <WMSTileLayer
                url={mapserverUrl}
                params={
                    {
                        layers: 'boundary',
                        format: 'image/png',
                        transparent: true,
                        map: '/etc/mapserver/general/boundary.map',
                    } as any
                }
                attribution="Sverdlovsk Oblast Geoportal"
            />
        </MapContainer>
    )
}

export default Map
