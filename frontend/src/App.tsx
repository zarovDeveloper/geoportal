import { Routes, Route } from 'react-router-dom'
import Header from '@/components/layout/header/Header'
import Footer from '@/components/layout/footer/Footer'
import Map from '@/components/map/map/Map'
import ProfilePage from './pages/profile/Profile'
import SettingsPage from './pages/settings/Settings'
import styles from './App.module.css'

function App() {
    return (
        <div className={styles.app}>
            <Header />
            <main className={styles.main}>
                <Routes>
                    <Route path="/" element={<Map />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App
