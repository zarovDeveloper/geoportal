import React from 'react'
import styles from './button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'small' | 'medium' | 'large' | 'icon'
    fullWidth?: boolean
    children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    className = '',
    children,
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        size !== 'medium' && styles[size],
        fullWidth && styles.fullWidth,
        className
    ].filter(Boolean).join(' ')

    return (
        <button className={buttonClasses} {...props}>
            {children}
        </button>
    )
}

export default Button 