import React from 'react';
import Popup from '../../ui/popup/Popup';
import styles from './FeatureInfoPopup.module.css';

export interface FeatureInfoData {
  id: string;
  name: string;
  description: string;
}

interface FeatureInfoPopupProps {
  features: FeatureInfoData[];
  onClose: () => void;
}

const FeatureInfoPopup: React.FC<FeatureInfoPopupProps> = ({ features, onClose }) => (
  <Popup className={styles.popup} onClose={onClose} title="Информация об объекте">
    {features.map((feature) => (
      <div key={feature.id} className={styles.featureBlock}>
        <div className={styles.header}>
          <span className={styles.name}>{feature.name}</span>
          <span className={styles.id}>ID: {feature.id}</span>
        </div>
        {feature.description && <div className={styles.description}>{feature.description}</div>}
      </div>
    ))}
  </Popup>
);

export default FeatureInfoPopup;
