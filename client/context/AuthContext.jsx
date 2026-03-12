import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  };

  const signup = async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    return data;
  };

  const verifyOtp = async (verificationData) => {
    const { data } = await api.post('/auth/verify-otp', verificationData);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
