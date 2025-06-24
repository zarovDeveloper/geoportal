import React from 'react';
import MapControls from '../map-controls/MapControls';
import LayerControl from '../layer-control/LayerControl';
import FeatureInfoPopup from '../feature-info-popup/FeatureInfoPopup';
import { wmsUrl, LAYERS_CONFIG, center } from '../../../utils/map.ts';
import RulerPopup from '../ruler-popup/RulerPopup';
import { useRuler } from '../../../hooks/useRuler';
import { useFeatureInfo } from '../../../hooks/useFeatureInfo';
import { useMapLayers } from '../../../hooks/useMapLayers';
import styles from './map.module.css';

const Map: React.FC = () => {
  const {
    mapObjRef,
    wmsLayersRef,
    layersState,
    setLayersState,
    layersStateRef,
    isMapReady
  } = useMapLayers(LAYERS_CONFIG, wmsUrl, center);

  const { features, setFeatures } = useFeatureInfo(mapObjRef, wmsLayersRef, layersStateRef, isMapReady);

  const {
    isRulerActive,
    setIsRulerActive,
    handleClearRuler,
    totalDistance,
    rulerPoints
  } = useRuler(mapObjRef);

  const handleLayerToggle = (id: string) => {
    setLayersState(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const handleZoomIn = () => {
    const map = mapObjRef.current;
    if (map) {
      const view = map.getView();
      view.setZoom(view.getZoom()! + 1);
    }
  };
  const handleZoomOut = () => {
    const map = mapObjRef.current;
    if (map) {
      const view = map.getView();
      view.setZoom(view.getZoom()! - 1);
    }
  };
  const handleReset = () => {
    const map = mapObjRef.current;
    if (map) {
      const view = map.getView();
      view.setCenter(center);
      view.setZoom(13);
    }
  };
  const handleRulerToggle = () => {
    setIsRulerActive((prev) => !prev);
    if (isRulerActive) {
      handleClearRuler();
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div id="ol-map-container" className={styles.olMap} />
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onRulerToggle={handleRulerToggle}
        isRulerActive={isRulerActive}
      />
      <LayerControl
        layers={layersState.map(l => ({ id: l.id, name: l.name, visible: l.visible }))}
        onLayerToggle={(layerId) => handleLayerToggle(layerId)}
      />
      {features && features.length > 0 && (
        <FeatureInfoPopup
          features={features}
          onClose={() => setFeatures(null)}
        />
      )}
      {isRulerActive && (
        <RulerPopup
          totalDistance={totalDistance}
          pointsCount={rulerPoints.length}
          onClear={handleClearRuler}
        />
      )}
    </div>
  );
};

export default Map;
