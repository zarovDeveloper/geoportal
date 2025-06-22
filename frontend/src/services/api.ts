import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

export const login = async (username: string, password: string) => {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const response = await api.post('/auth/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })

    if (response.data.access_token) {
        useAuthStore.getState().setToken(response.data.access_token)
        await getMe()
    }
    return response.data
}

export const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/users/', {
        username,
        email,
        password,
    })
    return response.data
}

export const getMe = async () => {
    const response = await api.get('/users/me')
    if (response.data) {
        useAuthStore.getState().setUser(response.data)
    }
    return response.data
}

export const updateUser = async (userId: string, data: { username?: string, email?: string }) => {
    const response = await api.put(`/users/${userId}`, data);
    if (response.data) {
        useAuthStore.getState().setUser(response.data);
    }
    return response.data;
}

export const changePassword = async (userId: string, newPassword: string) => {
    const response = await api.put(`/users/${userId}`, { password: newPassword });
    return response.data;
}

export default api
