import React from 'react'
import styles from './Form.module.css'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode
}

const Form: React.FC<FormProps> = ({ children, className, ...props }) => {
    const formClasses = [
        styles.form,
        className
    ].filter(Boolean).join(' ')
    
    return (
        <form className={formClasses} {...props}>
            {children}
        </form>
    )
}

const FormGroup: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const groupClasses = [styles.formGroup, className].filter(Boolean).join(' ')
    return <div className={groupClasses}>{children}</div>
}

const FormRow: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const rowClasses = [styles.formRow, className].filter(Boolean).join(' ')
    return <div className={rowClasses}>{children}</div>
}

const FormActions: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const actionClasses = [styles.formActions, className].filter(Boolean).join(' ')
    return <div className={actionClasses}>{children}</div>
}

const FormFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const footerClasses = [styles.formFooter, className].filter(Boolean).join(' ')
    return <div className={footerClasses}>{children}</div>
}

interface FormMessageProps {
    type: 'success' | 'error'
    children: React.ReactNode
}

const FormMessage: React.FC<FormMessageProps> = ({ type, children }) => {
    if (!children) return null
    
    const messageClasses = [
        styles.generalMessage,
        styles[type]
    ].filter(Boolean).join(' ')

    return (
        <div className={messageClasses}>
            {children}
        </div>
    )
}

export { Form, FormGroup, FormRow, FormActions, FormFooter, FormMessage }
