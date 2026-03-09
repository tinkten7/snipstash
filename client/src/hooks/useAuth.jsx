import { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('snipstash_user');
    const token = localStorage.getItem('snipstash_token');
    if (saved && token) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem('snipstash_token', data.token);
    localStorage.setItem('snipstash_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (username, email, password) => {
    const data = await authApi.register({ username, email, password });
    localStorage.setItem('snipstash_token', data.token);
    localStorage.setItem('snipstash_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('snipstash_token');
    localStorage.removeItem('snipstash_user');
    setUser(null);
  };

  if (loading) return null;
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
