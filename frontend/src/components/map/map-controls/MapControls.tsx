import { ZoomIn, ZoomOut, RotateCcw, Ruler } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import styles from './MapControls.module.css';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRulerToggle: () => void;
  isRulerActive: boolean;
}

const MapControls = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onRulerToggle,
  isRulerActive,
}: MapControlsProps) => {
  return (
    <div className={styles.container}>
      <Button
        variant="secondary"
        onClick={onZoomIn}
        className={styles.controlButton}
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        onClick={onZoomOut}
        className={styles.controlButton}
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        onClick={onReset}
        className={styles.controlButton}
        title="Reset View"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      <Button
        variant={isRulerActive ? 'primary' : 'secondary'}
        onClick={onRulerToggle}
        className={styles.controlButton}
        title="Distance Measurement"
      >
        <Ruler className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MapControls;
