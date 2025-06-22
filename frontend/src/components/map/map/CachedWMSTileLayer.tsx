import { useEffect, useRef } from 'react'
import { WMSTileLayer } from 'react-leaflet'
import type { WMSTileLayerProps } from 'react-leaflet'
import * as L from 'leaflet'

interface CachedWMSTileLayerProps extends WMSTileLayerProps {
    cacheKey?: string
}

const CachedWMSTileLayer = ({ cacheKey, ...props }: CachedWMSTileLayerProps) => {
    const layerRef = useRef<L.TileLayer.WMS | null>(null)

    useEffect(() => {
        if (layerRef.current) {
            // Enable caching for better performance
            layerRef.current.options.updateWhenIdle = true
            layerRef.current.options.updateWhenZooming = false
            layerRef.current.options.keepBuffer = 2
        }
    }, [])

    return (
        <WMSTileLayer
            ref={layerRef}
            {...props}
            updateWhenIdle={true}
            updateWhenZooming={false}
            keepBuffer={2}
        />
    )
}

export default CachedWMSTileLayer 