import React from 'react';
import Popup from '../../ui/popup/Popup';
import Button from '../../ui/button/Button';
import styles from './RulerPopup.module.css';

interface RulerPopupProps {
  totalDistance: number;
  pointsCount: number;
  onClear: () => void;
}

const RulerPopup: React.FC<RulerPopupProps> = ({ totalDistance, pointsCount, onClear }) => (
  <Popup
    className={`${styles.rulerPopup} ${styles.rulerPopupPosition}`}
    hideHeader={true}
  >
    <div className={styles.contentRow}>
      <span className={styles.distanceText}>
        {totalDistance > 0
          ? `Длина: ${totalDistance < 1000
              ? totalDistance.toFixed(0) + ' м'
              : (totalDistance / 1000).toFixed(2) + ' км'}`
          : 'Кликните на карту для добавления точек'}
      </span>
      {pointsCount > 1 && (
        <Button
          onClick={onClear}
          className={styles.clearBtn}
          title="Сбросить"
          variant="ghost"
          size="icon"
          type="button"
          aria-label="Сбросить"
        >
          <span aria-hidden="true">×</span>
        </Button>
      )}
    </div>
  </Popup>
);

export default RulerPopup; 