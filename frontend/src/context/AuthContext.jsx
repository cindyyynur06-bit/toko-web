// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { getToken, getRole, saveSession, clearSession } from '../utils';  // ← HAPUS getSession

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Cek session saat pertama kali load
  useEffect(() => {
    const savedToken = getToken();
    const savedRole = getRole();  // ← PAKAI getRole()

    if (savedToken && savedRole) {
      setToken(savedToken);
      setUser({ role: savedRole });  // ← Simpan role sebagai user
    }
    setLoading(false);
  }, []);

  // Fungsi login
  const login = async (credential, passwd) => {
    try {
      const data = await api.login(credential, passwd);
      
      if (data.token) {
        // ← PAKAI saveSession(token, role) sesuai utils
        saveSession(data.token, data.user.role);
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      }
      return { success: false, error: 'Login gagal' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Fungsi register
  const register = async (payload) => {
    try {
      const data = await api.register(payload);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Fungsi logout
  const logout = () => {
    clearSession();  // ← PAKAI clearSession() dari utils
    setToken(null);
    setUser(null);
  };

  // Cek apakah user login
  const isAuthenticated = !!token && !!user;

  // Cek role user
  const isAdmin = user?.role === 'admin';
  const isPembeli = user?.role === 'pembeli';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isPembeli,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk pakai AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
};

export default AuthContext;