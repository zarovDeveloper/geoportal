import { useRef, useEffect, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls } from 'ol/control';
import type { MapLayerConfig } from '../types/map';

export function useMapLayers(LAYERS_CONFIG: MapLayerConfig[], wmsUrl: string, center: number[]) {
  const mapObjRef = useRef<Map | null>(null);
  const wmsLayersRef = useRef<Record<string, TileLayer<TileWMS>>>({});
  const [layersState, setLayersState] = useState(LAYERS_CONFIG);
  const layersStateRef = useRef(layersState);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    layersStateRef.current = layersState;
  }, [layersState]);

  useEffect(() => {
    const mapContainer = document.getElementById('ol-map-container');
    if (!mapContainer) return;

    const osmLayer = new TileLayer({
      source: new OSM(),
      visible: true,
    });

    const wmsLayers: Record<string, TileLayer<TileWMS>> = {};
    LAYERS_CONFIG.forEach((layerCfg) => {
      wmsLayers[layerCfg.id] = new TileLayer({
        source: new TileWMS({
          url: wmsUrl,
          params: layerCfg.params,
          serverType: 'mapserver',
          crossOrigin: 'anonymous',
        }),
        visible: layerCfg.visible,
      });
    });
    wmsLayersRef.current = wmsLayers;

    const olMap = new Map({
      target: mapContainer,
      layers: [osmLayer, ...Object.values(wmsLayers)],
      view: new View({
        center,
        zoom: 13,
      }),
      controls: defaultControls({ zoom: false, rotate: false, attribution: false }),
    });
    mapObjRef.current = olMap;
    setIsMapReady(true);
    return () => {
      olMap.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    Object.entries(wmsLayersRef.current).forEach(([id, layer]) => {
      const state = layersState.find((l) => l.id === id);
      if (state) {
        layer.setVisible(state.visible);
      }
    });
  }, [layersState]);

  return { mapObjRef, wmsLayersRef, layersState, setLayersState, layersStateRef, isMapReady };
}
