import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, WMSTileLayer, useMap, Polyline, Marker } from 'react-leaflet'
import LayerControl from '@/components/map/layer-control/LayerControl'
import MapControls from '@/components/map/map-controls/MapControls'
import * as L from 'leaflet'
import { Ruler, X } from 'lucide-react'
import Button from '@/components/ui/button/Button'

const rulerMarkerIcon = L.divIcon({
    className:
        'bg-primary rounded-full w-3 h-3 border-2 border-primary-foreground shadow-md',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
})

interface LayerState {
    id: string
    name: string
    description: string
    visible: boolean
    type: 'wms' | 'tile'
    url?: string
    params?: {
        layers: string
        transparent: boolean
        format: string
    }
    opacity: number
}

const formatDistance = (distance: number) => {
    if (distance < 1000) {
        return `${distance.toFixed(0)} m`
    }
    return `${(distance / 1000).toFixed(2)} km`
}

const RulerComponent = ({ isActive, setPoints, setTotalDistance }: { isActive: boolean, setPoints: React.Dispatch<React.SetStateAction<L.LatLng[]>>, setTotalDistance: React.Dispatch<React.SetStateAction<number>> }) => {
    const map = useMap()

    useEffect(() => {
        if (!isActive) {
            map.getContainer().style.cursor = ''
            return
        }

        map.getContainer().style.cursor = 'crosshair'

        const handleClick = (e: L.LeafletMouseEvent) => {
            const newPoint = e.latlng
            setPoints((prevPoints) => {
                const updatedPoints = [...prevPoints, newPoint]

                if (updatedPoints.length > 1) {
                    let total = 0
                    for (let i = 0; i < updatedPoints.length - 1; i++) {
                        total += updatedPoints[i].distanceTo(updatedPoints[i + 1])
                    }
                    setTotalDistance(total)
                }
                return updatedPoints
            })
        }

        map.on('click', handleClick)

        return () => {
            map.off('click', handleClick)
            map.getContainer().style.cursor = ''
        }
    }, [map, isActive, setPoints, setTotalDistance])

    return null
}

const MapEvents = ({ setMap }: { setMap: (map: L.Map) => void }) => {
    const map = useMap()
    useEffect(() => {
        setMap(map)
    }, [map, setMap])
    return null
}

const Map = () => {
    const center: L.LatLngExpression = [56.838, 60.6057]
    const [map, setMap] = useState<L.Map | null>(null)

    const [isRulerActive, setIsRulerActive] = useState(false)
    const [rulerPoints, setRulerPoints] = useState<L.LatLng[]>([])
    const [totalDistance, setTotalDistance] = useState(0)

    const [layers, setLayers] = useState<LayerState[]>([
        {
            id: 'osm',
            name: 'OpenStreetMap',
            description: 'Standard OpenStreetMap tiles',
            visible: true,
            type: 'tile',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            opacity: 1,
        },
        {
            id: 'boundary',
            name: 'Boundary',
            description: 'Administrative boundary',
            visible: true,
            type: 'wms',
            url: 'http://localhost:8080/mapserver?',
            params: {
                layers: 'boundary',
                transparent: true,
                format: 'image/png',
            },
            opacity: 1,
        },
    ])

    const toggleLayer = (layerId: string, visible: boolean) => {
        setLayers(
            layers.map((layer) =>
                layer.id === layerId ? { ...layer, visible } : layer
            )
        )
    }
    
    const toggleRuler = () => {
        setIsRulerActive((prev) => {
            if (prev) { 
                setRulerPoints([])
                setTotalDistance(0)
            }
            return !prev
        })
    }

    const handleClearRuler = () => {
        setRulerPoints([])
        setTotalDistance(0)
    }

    const handleZoomIn = () => map?.zoomIn()
    const handleZoomOut = () => map?.zoomOut()
    const handleResetView = () => map?.setView(center, 10)

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={center}
                zoom={10}
                className="h-full w-full"
                zoomControl={false}
            >
                <MapEvents setMap={setMap} />

                {layers.map((layer) => {
                    if (!layer.visible) return null
                    if (layer.type === 'tile' && layer.url) {
                        return (
                            <TileLayer
                                key={layer.id}
                                url={layer.url}
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                opacity={layer.opacity}
                            />
                        )
                    }
                    if (layer.type === 'wms' && layer.url && layer.params) {
                        return (
                            <WMSTileLayer
                                key={layer.id}
                                url={layer.url}
                                params={layer.params}
                                opacity={layer.opacity}
                            />
                        )
                    }
                    return null
                })}

                <RulerComponent isActive={isRulerActive} setPoints={setRulerPoints} setTotalDistance={setTotalDistance} />
                
                {rulerPoints.length > 0 && (
                    <>
                        <Polyline positions={rulerPoints} color="blue" />
                        {rulerPoints.map((point, index) => (
                            <Marker key={index} position={point} icon={rulerMarkerIcon} />
                        ))}
                    </>
                )}
            </MapContainer>

            <LayerControl
                layers={layers}
                onLayerToggle={toggleLayer}
            />

            <MapControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleResetView}
                onRulerToggle={toggleRuler}
                isRulerActive={isRulerActive}
            />

            {isRulerActive && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] p-2 px-4 rounded-full bg-card/95 backdrop-blur-sm shadow-lg text-sm flex items-center gap-3">
                    <Ruler className="h-4 w-4 text-primary" />
                    <span>
                        {totalDistance > 0
                            ? `Total Distance: ${formatDistance(totalDistance)}`
                            : 'Click on the map to add points'}
                    </span>
                    {rulerPoints.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={handleClearRuler}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

export default Map 