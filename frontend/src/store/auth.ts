import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface User {
    id: string
    username: string
    email: string
    roles: { id: string; name: string; description: string }[]
}

interface AuthState {
    token: string | null
    user: User | null
    setToken: (token: string) => void
    setUser: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
