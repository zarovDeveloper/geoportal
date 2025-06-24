import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { login as apiLogin } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  roles: { id: string; name: string; description: string }[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
      login: async (username: string, password: string) => {
        const response = await apiLogin(username, password);
        set({ token: response.access_token, user: response.user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useAuth = () => {
  const store = useAuthStore();
  return {
    token: store.token,
    user: store.user,
    login: store.login,
    logout: store.logout,
    setToken: store.setToken,
    setUser: store.setUser,
  };
};
