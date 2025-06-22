import { Settings as SettingsIcon } from 'lucide-react'
import styles from './Settings.module.css'

const Settings = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.subtitle}>
                        Manage your application preferences
                    </p>
                </div>

                <div className={styles.section}>
                    <div className={styles.placeholder}>
                        <SettingsIcon className={styles.placeholderIcon} />
                        <h3 className="text-lg font-semibold">Settings Under Construction</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This page is currently being developed. Check back soon!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings 
