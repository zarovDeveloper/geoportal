export interface MapLayerParams {
  LAYERS: string;
  STYLES: string;
  FORMAT: string;
  TRANSPARENT: boolean;
  VERSION: string;
}

export interface MapLayerConfig {
  id: string;
  name: string;
  params: MapLayerParams;
  visible: boolean;
} 