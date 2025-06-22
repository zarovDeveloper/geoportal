import styles from './Footer.module.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <p className={styles.copyright}>
                        © {currentYear} Geoportal of Tourist Objects. All rights reserved.
                    </p>
                    <p className={styles.developer}>
                        Разработано студентом РСБО-02-22 Заровнятных Михаил
                    </p>
                </div>
                <div className={styles.links}>
                    <a href="#" className={styles.link}>Privacy Policy</a>
                    <a href="#" className={styles.link}>Terms of Service</a>
                    <a href="#" className={styles.link}>Contact</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer 