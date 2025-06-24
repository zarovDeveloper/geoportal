import { useState, useRef, useEffect } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { Style, Stroke, Circle as CircleStyle, Fill } from 'ol/style';
import { toLonLat } from 'ol/proj';
import { getDistance } from '../utils/map';

export function useRuler(mapObjRef: React.MutableRefObject<any>) {
  const [isRulerActive, setIsRulerActive] = useState(false);
  const [rulerPoints, setRulerPoints] = useState<[number, number][]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const rulerLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    const map = mapObjRef.current;
    if (!map) return;
    if (isRulerActive) {
      const source = new VectorSource();
      const layer = new VectorLayer({
        source,
        style: (feature) => {
          if (feature.getGeometry() instanceof LineString) {
            return new Style({
              stroke: new Stroke({ color: '#2563eb', width: 3 })
            });
          }
          if (feature.getGeometry() instanceof Point) {
            return new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: '#fff' }),
                stroke: new Stroke({ color: '#2563eb', width: 3 })
              })
            });
          }
        }
      });
      map.addLayer(layer);
      rulerLayerRef.current = layer;
    } else {
      if (rulerLayerRef.current) {
        map.removeLayer(rulerLayerRef.current);
        rulerLayerRef.current = null;
      }
      setRulerPoints([]);
      setTotalDistance(0);
    }
  }, [isRulerActive, mapObjRef]);

  useEffect(() => {
    const map = mapObjRef.current;
    if (!map || !isRulerActive) return;
    const handleClick = (evt: any) => {
      const coord = evt.coordinate;
      setRulerPoints(prev => [...prev, coord]);
    };
    map.on('singleclick', handleClick);
    return () => {
      map.un('singleclick', handleClick);
    };
  }, [isRulerActive, mapObjRef]);

  useEffect(() => {
    if (!isRulerActive || !rulerLayerRef.current) return;
    const source = rulerLayerRef.current.getSource();
    if (!source) return;
    source.clear();
    if (rulerPoints.length > 0) {
      rulerPoints.forEach(pt => {
        source.addFeature(new Feature(new Point(pt)));
      });
      if (rulerPoints.length > 1) {
        source.addFeature(new Feature(new LineString(rulerPoints)));
      }
    }
    if (rulerPoints.length > 1) {
      let dist = 0;
      for (let i = 0; i < rulerPoints.length - 1; i++) {
        const c1 = toLonLat(rulerPoints[i]) as [number, number];
        const c2 = toLonLat(rulerPoints[i + 1]) as [number, number];
        dist += getDistance(c1, c2);
      }
      setTotalDistance(dist);
    } else {
      setTotalDistance(0);
    }
  }, [rulerPoints, isRulerActive]);

  const handleClearRuler = () => {
    setRulerPoints([]);
    setTotalDistance(0);
  };

  return {
    isRulerActive,
    setIsRulerActive,
    rulerPoints,
    setRulerPoints,
    totalDistance,
    handleClearRuler
  };
} 