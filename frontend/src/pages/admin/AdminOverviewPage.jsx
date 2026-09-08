// frontend/src/pages/admin/AdminOverviewPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";
import { formatRupiah } from "../../utils";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        console.log("📊 Admin Stats Response:", res);
        
        const data = res.data || res;
        const statsData = data.stats || {};
        
        const totalPembelian = statsData.total_pembelian || 0;
        const selesai = statsData.selesai || 0;
        const diterima = statsData.diterima || 0;
        const dibatalkan = statsData.dibatalkan || 0;
        const pesananAktif = totalPembelian - selesai - diterima - dibatalkan;
        
        console.log("📊 Perhitungan:", {
          totalPembelian,
          selesai,
          diterima,
          dibatalkan,
          pesananAktif
        });
        
        setStats({
          total_pembeli: statsData.total_pembeli || 0,
          total_pembelian: totalPembelian,
          total_produk: statsData.total_produk || 0,
          produk_terjual: statsData.produk_terjual || 0,
          total_artikel: statsData.total_artikel || 0,
          pesanan_aktif: pesananAktif,
          belum_dibayar: statsData.belum_dibayar || 0,
          pendapatan: statsData.pendapatan || 0,
        });
        
        setRecent(data.recent || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border" role="status" style={{ color: "#8B6B4A" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#F5EDE6" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Pembeli Terdaftar</p>
                <h4 className="fw-bold mb-0" style={{ color: "#2C1810" }}>{stats?.total_pembeli || 0}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#EDE0D4" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Total Transaksi</p>
                <h4 className="fw-bold mb-0" style={{ color: "#2C1810" }}>{stats?.total_pembelian || 0}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#E8D5C4" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Produk di Katalog</p>
                <h4 className="fw-bold mb-0" style={{ color: "#2C1810" }}>{stats?.total_produk || 0}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#D4C5B2" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Produk Terjual</p>
                <h4 className="fw-bold mb-0" style={{ color: "#2C1810" }}>{stats?.produk_terjual || 0}</h4>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#FAF0E6" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Jumlah Pesanan</p>
                <h4 className="fw-bold mb-0" style={{ color: "#2C1810" }}>{stats?.total_pembelian || 0}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#F5E6D3" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Artikel</p>
                <h4 className="fw-bold mb-0" style={{ color: "#2C1810" }}>{stats?.total_artikel || 0}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#FDEBD0" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Pesanan Aktif</p>
                <h4 className="fw-bold mb-0" style={{ color: "#D35400" }}>{stats?.pesanan_aktif || 0}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#FDEDEC" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Belum Dibayar</p>
                <h4 className="fw-bold mb-0" style={{ color: "#C0392B" }}>{stats?.belum_dibayar || 0}</h4>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#F0E8E0" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Pendapatan (dibayar)</p>
                <h4 className="fw-bold mb-0" style={{ color: "#8B6B4A" }}>{formatRupiah(stats?.pendapatan || 0)}</h4>
                <small className="text-secondary">Total dari pesanan dengan status "Dibayar"</small>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "#F5F0EB" }}>
                <p className="mb-1 small" style={{ color: "#8B6B4A" }}>Transaksi Terbaru</p>
                {recent.length === 0 ? (
                  <p className="text-secondary mb-0 small">Belum ada pesanan.</p>
                ) : (
                  recent.slice(0, 3).map((item) => (
                    <div key={item.id} className="d-flex justify-content-between border-bottom py-1" style={{ borderColor: "#E8DDD0 !important" }}>
                      <span className="small" style={{ color: "#2C1810" }}>{item.nama_pembeli || item.nama_produk || "-"}</span>
                      <span className="fw-bold small" style={{ color: "#8B6B4A" }}>{formatRupiah(item.harga || 0)}</span>
                    </div>
                  ))
                )}
                <Link to="/admin/pembelian" className="btn btn-sm mt-2" style={{ backgroundColor: "#2C1810", color: "#F5E6D3" }}>
                  Lihat semua
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}