import { useAuthStore } from '@/store/auth'
import App from './App'
import LoginPage from './pages/Login'
import { useEffect } from 'react'
import { getMe } from './services/api'

const AppShell = () => {
    const { token, setToken, setUser } = useAuthStore()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await getMe()
                setUser(user)
            } catch (error) {
                // If getMe fails, the token is likely invalid/expired
                setToken('') // Clear the invalid token
            }
        }

        if (token) {
            checkUser()
        }
    }, [token, setToken, setUser])

    if (!token) {
        return <LoginPage />
    }

    return <App />
}

export default AppShell
