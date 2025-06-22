import React from 'react'
import styles from './switch.module.css'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Switch: React.FC<SwitchProps> = ({ label, ...props }) => {
    return (
        <label className={styles.switch}>
            <input type="checkbox" {...props} />
            <span className={styles.slider}></span>
            {label && <span>{label}</span>}
        </label>
    );
};

export default Switch; 
