import { useState, useEffect } from 'react';

export interface FeatureInfoData {
  id: string;
  name: string;
  description: string;
}

export function useFeatureInfo(
  mapObjRef: React.MutableRefObject<any>,
  wmsLayersRef: React.MutableRefObject<any>,
  layersStateRef: React.MutableRefObject<any>,
  isMapReady: boolean,
) {
  const [features, setFeatures] = useState<FeatureInfoData[] | null>(null);

  useEffect(() => {
    if (!isMapReady) return;
    const map = mapObjRef.current;
    if (!map) return;

    const handleClick = async (evt: any) => {
      setFeatures(null);
      const view = map.getView();
      const viewResolution = view.getResolution();
      const projection = view.getProjection();
      const activeLayers = layersStateRef.current.filter((l: any) => l.visible);
      let allFeatures: FeatureInfoData[] = [];
      for (const layerCfg of activeLayers) {
        const wmsLayer = wmsLayersRef.current[layerCfg.id];
        if (!wmsLayer) continue;
        const wmsSource = wmsLayer.getSource();
        const url = wmsSource?.getFeatureInfoUrl(evt.coordinate, viewResolution!, projection, {
          INFO_FORMAT: 'geojson',
          QUERY_LAYERS: layerCfg.params.LAYERS,
          FEATURE_COUNT: 10,
        });
        if (url) {
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              allFeatures.push(
                ...data.features.map((f: any) => ({
                  id: f.properties.id,
                  name: f.properties.name,
                  description: f.properties.description,
                })),
              );
            }
          } catch (e) {
            // Можно добавить обработку ошибок
          }
        }
      }
      setFeatures(allFeatures.length > 0 ? allFeatures : null);
      console.log('FeatureInfoPopup features:', allFeatures);
    };

    map.on('singleclick', handleClick);
    return () => {
      map.un('singleclick', handleClick);
    };
  }, [isMapReady, mapObjRef, wmsLayersRef, layersStateRef]);

  return { features, setFeatures };
}
