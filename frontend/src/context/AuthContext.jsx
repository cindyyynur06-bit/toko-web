// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import { getToken, getRole, saveSession, clearSession } from '../utils';

const AuthContext = createContext(null);

const CART_KEY = 'toko_cart';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // ============================================================
  // CART STATE (localStorage persistence)
  // ============================================================
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Gagal simpan cart:', e);
    }
  }, [cart]);

  // ============================================================
  // SESSION
  // ============================================================
  useEffect(() => {
    const savedToken = getToken();
    const savedRole = getRole();

    if (savedToken && savedRole) {
      setToken(savedToken);
      setUser({ role: savedRole });
    }
    setLoading(false);
  }, []);

  // ============================================================
  // AUTH
  // ============================================================
  const login = async (credential, passwd) => {
    try {
      const data = await api.login(credential, passwd);
      if (data.token) {
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

  const register = async (payload) => {
    try {
      const data = await api.register(payload);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
    // cart sengaja TIDAK dihapus supaya tetap ada setelah login lagi
  };

  // ============================================================
  // CART OPERATIONS
  // ============================================================
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const id = product.id_produk || product.id;
      const existing = prev.find((i) => (i.id_produk || i.id) === id);
      if (existing) {
        return prev.map((i) =>
          (i.id_produk || i.id) === id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => (i.id_produk || i.id) !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) =>
      prev.map((i) => ((i.id_produk || i.id) === id ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const totalItem = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const totalHarga = useMemo(
    () => cart.reduce((sum, i) => sum + i.harga * i.qty, 0),
    [cart]
  );

  // ============================================================
  // ROLE
  // ============================================================
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isPembeli = user?.role === 'pembeli';

  return (
    <AuthContext.Provider
      value={{
        // auth
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isPembeli,
        // cart
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItem,
        totalHarga,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
};

export default AuthContext;