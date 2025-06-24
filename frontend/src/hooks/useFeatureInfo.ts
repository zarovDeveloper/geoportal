import { useState, useEffect } from 'react';

export function useFeatureInfo(mapObjRef: React.MutableRefObject<any>, wmsLayersRef: React.MutableRefObject<any>, layersStateRef: React.MutableRefObject<any>, isMapReady: boolean) {
  const [featureInfo, setFeatureInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!isMapReady) return;
    const map = mapObjRef.current;
    if (!map) return;

    const handleClick = async (evt: any) => {
      setFeatureInfo(null);
      const view = map.getView();
      const viewResolution = view.getResolution();
      const projection = view.getProjection();
      const activeLayers = layersStateRef.current.filter((l: any) => l.visible);
      let allResults: string[] = [];
      for (const layerCfg of activeLayers) {
        const wmsLayer = wmsLayersRef.current[layerCfg.id];
        if (!wmsLayer) continue;
        const wmsSource = wmsLayer.getSource();
        const url = wmsSource?.getFeatureInfoUrl(
          evt.coordinate,
          viewResolution!,
          projection,
          {
            'INFO_FORMAT': 'geojson',
            'QUERY_LAYERS': layerCfg.params.LAYERS,
            'FEATURE_COUNT': 10,
          }
        );
        if (url) {
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              allResults.push(
                `<b>${layerCfg.name}</b><pre>${JSON.stringify(data.features.map((f: any) => f.properties), null, 2)}</pre>`
              );
            }
          } catch (e) {
            allResults.push(`<b>${layerCfg.name}</b>: ошибка запроса`);
          }
        }
      }
      if (allResults.length > 0) {
        setFeatureInfo(allResults.join('<hr/>'));
      } else {
        setFeatureInfo('Нет объектов в этой точке.');
      }
    };

    map.on('singleclick', handleClick);
    return () => {
      map.un('singleclick', handleClick);
    };
  }, [isMapReady, mapObjRef, wmsLayersRef, layersStateRef]);

  return { featureInfo, setFeatureInfo };
} 