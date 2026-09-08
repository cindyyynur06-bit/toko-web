// frontend/src/pages/pembeli/PembeliOverviewPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pembeliApi } from "../../api";
import { formatRupiah } from "../../utils";

export default function PembeliOverviewPage() {
  const [stats, setStats] = useState({
    total_pesanan: 0,
    pesanan_aktif: 0,
    belum_dibayar: 0,
    total_belanja: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await pembeliApi.getDashboard();
      console.log("📊 Raw response:", res);
      
      const data = res.data || res;
      console.log("📊 Data:", data);
      
      const statsData = data.stats || {};
      console.log("📊 Stats:", statsData);
      
      // AMBIL DATA DARI STATS
      const totalPesanan = statsData.total_pembelian || 0;
      
      // PESANAN AKTIF = total - (selesai + diterima + dibatalkan)
      const selesai = statsData.selesai || 0;
      const diterima = statsData.diterima || 0;
      const dibatalkan = statsData.dibatalkan || 0;
      const pesananAktif = totalPesanan - selesai - diterima - dibatalkan;
      
      // BELUM DIBAYAR
      const belumDibayar = statsData.belum_dibayar || 0;
      
      // TOTAL BELANJA
      const orders = data.recent || [];
      const totalBelanja = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.harga) || 0);
      }, 0);
      
      console.log("📊 Processed:", {
        totalPesanan,
        selesai,
        diterima,
        dibatalkan,
        pesananAktif,
        belumDibayar,
        totalBelanja,
        ordersCount: orders.length
      });
      
      setStats({
        total_pesanan: totalPesanan,
        pesanan_aktif: pesananAktif,
        belum_dibayar: belumDibayar,
        total_belanja: totalBelanja,
      });
      
      setRecentOrders(orders);
      
    } catch (err) {
      console.error("❌ Error fetching dashboard:", err);
      setError(err.message || "Gagal memuat data dashboard");
      
      // Data dummy untuk testing
      setStats({
        total_pesanan: 1,
        pesanan_aktif: 1,
        belum_dibayar: 1,
        total_belanja: 12500,
      });
      setRecentOrders([
        {
          id: 1,
          nama_produk: "Daisy Balloon Bouquet",
          harga: 12500,
          status: "Tertunda",
          pembayaran: "Belum",
          created_at: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      "Tertunda": "bg-warning text-dark",
      "Dikemas": "bg-info text-dark",
      "Dikirim": "bg-primary",
      "Diterima": "bg-success",
      "Selesai": "bg-secondary",
      "Dibatalkan": "bg-danger",
      "Menunggu": "bg-secondary",
    };
    return statusMap[status] || "bg-secondary";
  };

  const getStatusBayarBadge = (statusBayar) => {
    const statusMap = {
      "Belum": "bg-danger",
      "Dibayar": "bg-success",
      "Lunas": "bg-success",
    };
    return statusMap[statusBayar] || "bg-secondary";
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-secondary">Memuat data dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {error && (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>⚠️ {error}</strong> - Menampilkan data contoh.
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}

          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div className="bg-white p-3 text-center rounded shadow-sm">
                <div className="text-secondary mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>
                  TOTAL PESANAN
                </div>
                <h2 className="fw-bold mb-0">{stats.total_pesanan}</h2>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="bg-white p-3 text-center rounded shadow-sm">
                <div className="text-secondary mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>
                  PESANAN AKTIF
                </div>
                <h2 className="fw-bold mb-0" style={{ color: "#f39c12" }}>{stats.pesanan_aktif}</h2>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="bg-white p-3 text-center rounded shadow-sm">
                <div className="text-secondary mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>
                  BELUM DIBAYAR
                </div>
                <h2 className="fw-bold mb-0" style={{ color: "#e74c3c" }}>{stats.belum_dibayar}</h2>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="bg-white p-3 text-center rounded shadow-sm">
                <div className="text-secondary mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>
                  TOTAL BELANJA
                </div>
                <h2 className="fw-bold mb-0" style={{ color: "#27ae60" }}>{formatRupiah(stats.total_belanja)}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 mb-4 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-0 small">
                  <strong>Total belanja (sudah dibayar)</strong><br />
                  Akumulasi harga produk pada pesanan berstatus pembayaran "Dibayar".
                </p>
              </div>
              <h4 className="fw-bold text-success mb-0">{formatRupiah(stats.total_belanja)}</h4>
            </div>
          </div>

          <div className="bg-white p-3 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Pesanan terbaru</h6>
              <Link to="/akun/pesanan" className="text-dark text-decoration-none small fw-bold">
                Lihat semua
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-secondary mb-3">Belum ada pesanan. Mulai belanja.</p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <Link to="/akun/belanja" className="btn btn-dark btn-sm">Belanja produk</Link>
                  <Link to="/akun/pesanan" className="btn btn-outline-dark btn-sm">Riwayat pesanan</Link>
                  <Link to="/akun/profil" className="btn btn-outline-dark btn-sm">Edit profil</Link>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>ID Pesanan</th>
                      <th>Produk</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Bayar</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.slice(0, 5).map((order) => {
                      const statusProses = order.status || "Menunggu";
                      const statusBayar = order.pembayaran || "Belum";
                      const totalHarga = order.harga || order.total_harga || 0;
                      const namaProduk = order.nama_produk || "-";
                      const id = order.id;
                      
                      return (
                        <tr key={id}>
                          <td className="fw-bold">#{id}</td>
                          <td>{namaProduk}</td>
                          <td className="fw-bold">{formatRupiah(totalHarga)}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(statusProses)}`}>
                              {statusProses}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBayarBadge(statusBayar)}`}>
                              {statusBayar}
                            </span>
                          </td>
                          <td className="text-secondary small">
                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 row g-3">
            <div className="col-md-4">
              <Link to="/akun/belanja" className="text-decoration-none">
                <div className="bg-white p-3 rounded shadow-sm text-center hover-shadow transition">
                  <h6 className="fw-bold mb-1">Belanja Produk</h6>
                  <span className="text-secondary small">Lihat dan beli produk</span>
                </div>
              </Link>
            </div>
            <div className="col-md-4">
              <Link to="/akun/pesanan" className="text-decoration-none">
                <div className="bg-white p-3 rounded shadow-sm text-center hover-shadow transition">
                  <h6 className="fw-bold mb-1">Riwayat Pesanan</h6>
                  <span className="text-secondary small">Lihat semua pesanan</span>
                </div>
              </Link>
            </div>
            <div className="col-md-4">
              <Link to="/akun/profil" className="text-decoration-none">
                <div className="bg-white p-3 rounded shadow-sm text-center hover-shadow transition">
                  <h6 className="fw-bold mb-1">Edit Profil</h6>
                  <span className="text-secondary small">Kelola data diri</span>
                </div>
              </Link>
            </div>
          </div>

          <style>{`
            .hover-shadow {
              transition: all 0.3s ease;
              cursor: pointer;
            }
            .hover-shadow:hover {
              transform: translateY(-3px);
              box-shadow: 0 5px 15px rgba(0,0,0,0.08) !important;
            }
            .transition {
              transition: all 0.3s ease;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}