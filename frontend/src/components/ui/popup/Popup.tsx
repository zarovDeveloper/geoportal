import React from 'react';
import styles from './popup.module.css';
import Button from '../button/Button';

export interface PopupProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  style?: React.CSSProperties;
  title?: string;
  hideHeader?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  children,
  className = '',
  onClose,
  style,
  title,
  hideHeader = false,
}) => {
  return (
    <div className={[styles.popup, className].filter(Boolean).join(' ')} style={style}>
      {!hideHeader && (title || onClose) && (
        <div className={styles.header}>
          {title && <div className={styles.title}>{title}</div>}
          {onClose && (
            <Button
              className={styles.closeBtn}
              onClick={onClose}
              title="Закрыть"
              variant="ghost"
              size="icon"
              type="button"
              aria-label="Закрыть"
            >
              <span aria-hidden="true">×</span>
            </Button>
          )}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Popup;
