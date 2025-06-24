import { useAuthStore } from '@/store/auth';
import App from './App';
import LoginPage from './pages/login/Login';
import RegisterPage from './pages/register/Register';
import { useEffect } from 'react';
import { getMe } from './services/api';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const AppShell = () => {
  const { token, setToken, setUser } = useAuthStore();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getMe();
        setUser(user);
      } catch {
        setToken('');
      }
    };

    if (token) {
      checkUser();
    }
  }, [token, setToken, setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route path="/*" element={token ? <App /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppShell;
