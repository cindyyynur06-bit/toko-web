// frontend/src/pages/pembeli/PembeliPesananPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pembeliApi } from "../../api";
import { formatRupiah, formatTanggal, mediaUrl, onImgError } from "../../utils";

export default function PembeliPesananPage() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("SEMUA");
  
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = async () => {
    setLoading(true);
    try {
      const res = await pembeliApi.getPembelian();
      const data = res.data || [];
      console.log("📦 DATA PESANAN LENGKAP:", JSON.stringify(data, null, 2));
      
      data.forEach((item, idx) => {
        console.log(`📊 Item ${idx + 1}:`, {
          id: item.id,
          nama_produk: item.nama_produk,
          harga: item.harga,
          total_harga: item.total_harga,
          produk_gambar: item.produk_gambar,
          gambar: item.gambar,
          status: item.status,
          pembayaran: item.pembayaran,
        });
      });
      
      setPesanan(data);
    } catch (err) {
      console.error("Error fetching pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPesanan = () => {
    if (filter === "SEMUA") return pesanan;
    return pesanan.filter(item => item.status === filter);
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

  const getTotalHarga = (item) => {
    if (item.harga) return parseFloat(item.harga);
    if (item.total_harga) return parseFloat(item.total_harga);
    if (item.total) return parseFloat(item.total);
    if (item.harga_total) return parseFloat(item.harga_total);
    return 0;
  };

  const getGambarUrl = (item) => {
    if (item.produk_gambar && item.produk_gambar !== '') return item.produk_gambar;
    if (item.gambar && item.gambar !== '') return item.gambar;
    if (item.gambar_produk && item.gambar_produk !== '') return item.gambar_produk;
    if (item.foto && item.foto !== '') return item.foto;
    if (item.foto_produk && item.foto_produk !== '') return item.foto_produk;
    return null;
  };

  const openDetailModal = async (item) => {
    setLoadingDetail(true);
    setShowModal(true);
    setSelectedOrder(item);
    setLoadingDetail(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const filteredPesanan = getFilteredPesanan();

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Pesanan Saya</h5>
            <span className="text-secondary small">{pesanan.length} pesanan</span>
          </div>

          <div className="d-flex gap-2 mb-4 flex-wrap">
            {["SEMUA", "Tertunda", "Dikemas", "Dikirim", "Diterima", "Selesai", "Dibatalkan"].map((status) => (
              <button
                key={status}
                className={`btn btn-sm ${
                  filter === status ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {filteredPesanan.length === 0 ? (
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <p className="text-secondary mb-3">Belum ada pesanan. Belanja sekarang</p>
              <Link to="/akun/belanja" className="btn btn-dark btn-sm">Belanja sekarang</Link>
            </div>
          ) : (
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="table-responsive">
                <table className="table table-sm table-hover mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: 50 }}>ID</th>
                      <th style={{ width: 60 }}>GAMBAR</th>
                      <th>PRODUK</th>
                      <th style={{ width: 120 }}>TOTAL</th>
                      <th style={{ width: 100 }}>STATUS</th>
                      <th style={{ width: 100 }}>BAYAR</th>
                      <th style={{ width: 110 }}>KURIR</th>
                      <th style={{ width: 110 }}>TANGGAL</th>
                      <th style={{ width: 100 }} className="text-center">TINDAKAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPesanan.map((item) => {
                      const id = item.id;
                      const namaProduk = item.nama_produk || "Produk tidak tersedia";
                      const totalHarga = getTotalHarga(item);
                      const gambarUrl = getGambarUrl(item);
                      const statusProses = item.status || "Tertunda";
                      const statusBayar = item.pembayaran || "Belum";
                      const kurir = item.pengiriman || "-";
                      const tanggal = item.created_at || new Date();

                      return (
                        <tr key={id}>
                          <td className="fw-bold">#{id}</td>
                          <td>
                            {gambarUrl ? (
                              <img
                                src={mediaUrl(gambarUrl)}
                                alt={namaProduk}
                                className="rounded"
                                style={{ width: 40, height: 40, objectFit: "cover" }}
                                onError={onImgError}
                              />
                            ) : (
                              <div 
                                className="bg-light rounded d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40 }}
                              >
                                <span className="text-secondary" style={{ fontSize: "10px" }}>No img</span>
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>{namaProduk}</strong>
                          </td>
                          <td>
                            <span className="fw-bold">{formatRupiah(totalHarga)}</span>
                          </td>
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
                          <td style={{ fontSize: "13px" }}>
                            {kurir}
                          </td>
                          <td className="text-secondary small">
                            {formatTanggal(tanggal)}
                          </td>
                          <td className="text-center">
                            <button 
                              onClick={() => openDetailModal(item)}
                              className="btn btn-outline-dark btn-sm"
                              style={{ padding: "2px 10px", fontSize: "11px" }}
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL DETAIL PESANAN ===== */}
      {showModal && selectedOrder && (
        <div
          className="modal fade show d-block"
          style={{ 
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
            overflow: "auto"
          }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{ maxWidth: "700px", margin: "50px auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  Detail Pesanan #{selectedOrder.id}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal} />
              </div>

              <div className="modal-body">
                {loadingDetail ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row g-4">
                    {/* KIRI */}
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6 className="fw-bold mb-3">Produk</h6>
                        
                        <div className="text-center mb-3">
                          {(() => {
                            const imgUrl = getGambarUrl(selectedOrder);
                            return imgUrl ? (
                              <img
                                src={mediaUrl(imgUrl)}
                                alt={selectedOrder.nama_produk}
                                className="rounded"
                                style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                                onError={onImgError}
                              />
                            ) : (
                              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                                <span className="text-secondary">No Image</span>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="mb-2">
                          <span className="text-secondary">Nama Produk</span>
                          <p className="fw-bold mb-0">{selectedOrder.nama_produk || "-"}</p>
                        </div>
                        <div className="mb-2">
                          <span className="text-secondary">Harga</span>
                          <p className="fw-bold text-success mb-0">{formatRupiah(getTotalHarga(selectedOrder))}</p>
                        </div>
                      </div>

                      <div className="border rounded p-3 mt-3">
                        <h6 className="fw-bold mb-3">Rekening Transfer</h6>
                        <div className="mb-2">
                          <span className="text-secondary">Jumlah transfer</span>
                          <p className="fw-bold text-success mb-0">
                            {formatRupiah(getTotalHarga(selectedOrder))}
                            <span className="text-secondary" style={{ fontSize: "12px", display: "block" }}>
                              cantumkan #{selectedOrder.id} di berita transfer
                            </span>
                          </p>
                        </div>
                        <div className="mb-2">
                          <span className="badge bg-primary me-2">BRI</span>
                          <span className="fw-bold">1234567890</span>
                        </div>
                        <div>
                          <span className="badge bg-primary me-2">BCA</span>
                          <span className="fw-bold">9876543210</span>
                        </div>
                      </div>
                    </div>

                    {/* KANAN */}
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6 className="fw-bold mb-3">Informasi Pesanan</h6>
                        
                        <div className="mb-2">
                          <span className="text-secondary">ID Pesanan</span>
                          <p className="fw-bold mb-0">#{selectedOrder.id}</p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Nama Penerima</span>
                          <p className="mb-0">{selectedOrder.nama_pembeli || "-"}</p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Alamat Kirim</span>
                          <p className="mb-0">{selectedOrder.alamat_pembeli || "-"}</p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Telepon</span>
                          <p className="mb-0">{selectedOrder.phone_pembeli || "-"}</p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Metode Bayar</span>
                          <p className="mb-0">{selectedOrder.metode_pembayaran || "-"}</p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Status Bayar</span>
                          <p className="mb-0">
                            <span className={`badge ${getStatusBayarBadge(selectedOrder.pembayaran || "Belum")}`}>
                              {selectedOrder.pembayaran || "Belum"}
                            </span>
                          </p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Kurir</span>
                          <p className="mb-0">{selectedOrder.pengiriman || "-"}</p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Status Pesanan</span>
                          <p className="mb-0">
                            <span className={`badge ${getStatusBadge(selectedOrder.status || "Tertunda")}`}>
                              {selectedOrder.status || "Tertunda"}
                            </span>
                          </p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Catatan</span>
                          <p className="mb-0">{selectedOrder.catatan || "-"}</p>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-secondary">Tanggal</span>
                          <p className="mb-0">{formatTanggal(selectedOrder.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}