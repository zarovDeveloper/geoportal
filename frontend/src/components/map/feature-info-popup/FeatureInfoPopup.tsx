import React from 'react';
import Popup from '../../ui/popup/Popup';
import styles from './FeatureInfoPopup.module.css';

interface FeatureInfoPopupProps {
  html: string;
  onClose: () => void;
}

const FeatureInfoPopup: React.FC<FeatureInfoPopupProps> = ({ html, onClose }) => (
  <Popup
    className={styles.featureInfoPopup}
    style={{ left: 20, bottom: 20 }}
    onClose={onClose}
  >
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </Popup>
);

export default FeatureInfoPopup; 