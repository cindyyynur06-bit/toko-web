import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Komponen untuk proteksi halaman
 * @param {Object} props
 * @param {React.ReactNode} props.children - Komponen yang dilindungi
 * @param {string} props.role - Role yang diizinkan ('admin' atau 'pembeli')
 * @param {string} props.redirectTo - Halaman redirect jika gagal (default: '/login')
 */
const RequireAuth = ({ children, role, redirectTo = '/login' }) => {
  const { isAuthenticated, isAdmin, isPembeli, loading } = useAuth();

  // Tunggu sampai selesai loading
  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  // Jika belum login, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Jika role diatur, cek apakah user punya role yang sesuai
  if (role) {
    const hasRole = role === 'admin' ? isAdmin : isPembeli;
    if (!hasRole) {
      // Redirect ke halaman sesuai role
      if (isAdmin) {
        return <Navigate to="/admin" replace />;
      }
      if (isPembeli) {
        return <Navigate to="/akun" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  // Lolos semua pengecekan, tampilkan anak komponen
  return children;
};

export default RequireAuth;