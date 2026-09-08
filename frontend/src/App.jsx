// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './layouts/AdminLayout';
import PembeliLayout from './layouts/PembeliLayout';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import TokoPage from './pages/TokoPage';
import ArtikelListPage from './pages/ArtikelListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ArtikelDetailPage from './pages/ArtikelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PembeliOverviewPage from './pages/pembeli/PembeliOverviewPage';
import PembeliBelanjaPage from './pages/pembeli/PembeliBelanjaPage';
import PembeliPesananPage from './pages/pembeli/PembeliPesananPage';
import PembeliProfilPage from './pages/pembeli/PembeliProfilPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminProdukPage from './pages/admin/AdminProdukPage';
import AdminPembeliPage from './pages/admin/AdminPembeliPage';
import AdminPembelianPage from './pages/admin/AdminPembelianPage';
import AdminArtikelPage from './pages/admin/AdminArtikelPage';
import AdminProfilPage from './pages/admin/AdminProfilPage';
import AdminProdukDetailPage from './pages/admin/AdminProdukDetailPage';
import AdminProdukTambahPage from './pages/admin/AdminProdukTambahPage';
import AdminProdukEditPage from './pages/admin/AdminProdukEditPage';
import AdminArtikelTambahPage from './pages/admin/AdminArtikelTambahPage';
import AdminArtikelDetailPage from './pages/admin/AdminArtikelDetailPage';
import AdminArtikelEditPage from './pages/admin/AdminArtikelEditPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/toko" element={<TokoPage />} />
            <Route path="/artikel" element={<ArtikelListPage />} />
            <Route path="/produk/:id" element={<ProductDetailPage />} />
            <Route path="/artikel/:id" element={<ArtikelDetailPage />} />
          </Route>

          {/* ========== LOGIN & REGISTER ========== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="produk" element={<AdminProdukPage />} />
            <Route path="produk/tambah" element={<AdminProdukTambahPage />} />  
            <Route path="produk/:id" element={<AdminProdukDetailPage />} /> 
            <Route path="produk/edit/:id" element={<AdminProdukEditPage />} />
            <Route path="pembeli" element={<AdminPembeliPage />} />
            <Route path="pembelian" element={<AdminPembelianPage />} />
            <Route path="artikel" element={<AdminArtikelPage />} />
            <Route path="artikel/tambah" element={<AdminArtikelTambahPage />} />
            <Route path="artikel/:id" element={<AdminArtikelDetailPage />} />
            <Route path="artikel/edit/:id" element={<AdminArtikelEditPage />} />
            <Route path="profil" element={<AdminProfilPage />} />
          </Route>

          {/* ========== PEMBELI ROUTES ========== */}
          <Route
            path="/akun"
            element={
              <RequireAuth role="pembeli">
                <PembeliLayout />
              </RequireAuth>
            }
          >
            <Route index element={<PembeliOverviewPage />} />
            <Route path="dashboard" element={<PembeliOverviewPage />} />
            <Route path="belanja" element={<PembeliBelanjaPage />} />
            <Route path="pesanan" element={<PembeliPesananPage />} />
            <Route path="profil" element={<PembeliProfilPage />} />
          </Route>

          {/* ========== 404 NOT FOUND ========== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}