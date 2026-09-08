// frontend/src/pages/admin/AdminPembelianPage.jsx
import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { formatRupiah, mediaUrl, onImgError, formatTanggal } from "../../utils";
import { STATUS_PROSES_COLOR, STATUS_PROSES, STATUS_BAYAR } from "../../constants";

export default function AdminPembelianPage() {
  const [pembelian, setPembelian] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal detail
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // State untuk modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    status: "",
    pembayaran: "",
    pengiriman: "",
    metode_pembayaran: "",
    catatan: "",
  });

  // State untuk modal hapus
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchPembelian(); }, []);

  const fetchPembelian = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPembelian();
      setPembelian(res.data || []);
    } catch (err) {
      console.error("Error fetching pembelian:", err);
    } finally {
      setLoading(false);
    }
  };

  // Buka modal detail
  const openDetailModal = async (item) => {
    setLoadingDetail(true);
    setShowModal(true);
    setError("");
    setSuccess("");

    try {
      const res = await adminApi.getPembelianById(item.id);
      const data = res.data || res;
      setSelectedOrder(data);
    } catch (err) {
      console.error("Error fetching detail:", err);
      setSelectedOrder(item);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Tutup modal detail
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setError("");
    setSuccess("");
  };

  // Buka modal edit
  const openEditModal = async (item) => {
    setError("");
    setSuccess("");
    setShowEditModal(true);

    try {
      const res = await adminApi.getPembelianById(item.id);
      const data = res.data || res;
      setEditOrder(data);
      setForm({
        status: data.status || "Tertunda",
        pembayaran: data.pembayaran || "Belum",
        pengiriman: data.pengiriman || "-",
        metode_pembayaran: data.metode_pembayaran || "COD",
        catatan: data.catatan || "",
      });
    } catch (err) {
      console.error("Error fetching detail:", err);
      setEditOrder(item);
      setForm({
        status: item.status || "Tertunda",
        pembayaran: item.pembayaran || "Belum",
        pengiriman: item.pengiriman || "-",
        metode_pembayaran: item.metode_pembayaran || "COD",
        catatan: item.catatan || "",
      });
    }
  };

  // Tutup modal edit
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditOrder(null);
    setError("");
    setSuccess("");
  };

  // Handle change form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await adminApi.updatePembelian(editOrder.id, form);
      setSuccess("Pesanan berhasil diupdate!");

      await fetchPembelian();

      setTimeout(() => {
        closeEditModal();
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Error updating:", err);
      setError(err.body?.message || err.message || "Gagal update pesanan");
    } finally {
      setSubmitting(false);
    }
  };

  // Buka modal hapus
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Tutup modal hapus
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
    setError("");
  };

  // Proses hapus
  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      await adminApi.deletePembelian(deleteId);
      setSuccess("Pesanan berhasil dihapus!");
      await fetchPembelian();

      setTimeout(() => {
        closeDeleteModal();
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Error deleting:", err);
      setError(err.body?.message || err.message || "Gagal menghapus pesanan");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = { "Tertunda": "bg-warning text-dark", "Dikemas": "bg-info text-dark", "Dikirim": "bg-primary", "Diterima": "bg-success", "Selesai": "bg-secondary", "Dibatalkan": "bg-danger" };
    return statusMap[status] || "bg-secondary";
  };

  const getStatusBayarBadge = (statusBayar) => {
    const statusMap = { "Belum": "bg-danger", "Dibayar": "bg-success", "Lunas": "bg-success" };
    return statusMap[statusBayar] || "bg-secondary";
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
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
            <h5 className="fw-bold mb-0">Manajemen Pesanan</h5>
            <small className="text-secondary">{pembelian.length} transaksi</small>
          </div>

          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-sm table-hover mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: 50 }}>ID</th>
                    <th>Pembeli</th>
                    <th style={{ width: 50 }}>Gambar</th>
                    <th>Produk</th>
                    <th className="text-end">Total</th>
                    <th style={{ width: 110 }}>Status</th>
                    <th style={{ width: 100 }}>Bayar</th>
                    <th className="text-end" style={{ width: 150 }}>Tindakan</th>
                  </tr>
                </thead>

                <tbody>
                  {pembelian.length === 0 ? (
                    <tr><td colSpan="8" className="text-center text-secondary py-4">Belum ada pesanan.</td></tr>
                  ) : (
                    pembelian.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-medium">#{item.id}</td>
                        <td>{item.nama_pembeli || item.user_nama_d || "-"}</td>
                        <td><img src={mediaUrl(item.produk_gambar)} alt={item.nama_produk} className="rounded" style={{ width: 40, height: 40, objectFit: "cover", background: "#f5f5f5" }} onError={onImgError} /></td>
                        <td className="text-secondary small">{item.nama_produk || "-"}</td>
                        <td className="text-end fw-bold">{formatRupiah(item.harga || 0)}</td>
                        <td><span className={`badge bg-${STATUS_PROSES_COLOR[item.status] || "secondary"}`}>{item.status || "Tertunda"}</span></td>
                        <td><span className={`badge bg-${item.pembayaran === "Dibayar" ? "success" : "danger"}`}>{item.pembayaran || "Belum"}</span></td>
                        <td className="text-end">
                          <div className="d-flex gap-1 justify-content-end">
                            {/* Detail - Icon mata */}
                            <button 
                              onClick={() => openDetailModal(item)} 
                              className="btn btn-outline-secondary btn-sm" 
                              title="Detail"
                              style={{ width: "32px", height: "32px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                              </svg>
                            </button>

                            {/* Ubah - Icon pensil */}
                            <button 
                              onClick={() => openEditModal(item)} 
                              className="btn btn-outline-primary btn-sm" 
                              title="Ubah"
                              style={{ width: "32px", height: "32px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                              </svg>
                            </button>

                            {/* Hapus - Icon tong sampah */}
                            <button 
                              onClick={() => openDeleteModal(item.id)} 
                              className="btn btn-outline-danger btn-sm" 
                              title="Hapus"
                              style={{ width: "32px", height: "32px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== MODAL DETAIL PESANAN ===== */}
          {showModal && selectedOrder && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1050, overflow: "auto" }} onClick={closeModal}>
              <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "700px", margin: "50px auto" }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">

                  <div className="modal-header bg-dark text-white">
                    <h5 className="modal-title fw-bold">Detail Pesanan #{selectedOrder.id}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={closeModal} />
                  </div>

                  <div className="modal-body">
                    {loadingDetail ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                      </div>
                    ) : (
                      <div className="row g-4">

                        {/* KIRI */}
                        <div className="col-md-6">
                          <div className="border rounded p-3">
                            <h6 className="fw-bold mb-3">Produk</h6>

                            <div className="text-center mb-3">
                              {selectedOrder.produk_gambar ? (
                                <img src={mediaUrl(selectedOrder.produk_gambar)} alt={selectedOrder.nama_produk} className="rounded" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} onError={onImgError} />
                              ) : (
                                <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: "150px" }}><span className="text-secondary">No Image</span></div>
                              )}
                            </div>

                            <div className="mb-2"><span className="text-secondary">Nama Produk</span><p className="fw-bold mb-0">{selectedOrder.nama_produk || "-"}</p></div>
                            <div className="mb-2"><span className="text-secondary">Harga</span><p className="fw-bold text-success mb-0">{formatRupiah(selectedOrder.harga || 0)}</p></div>
                            <div className="mb-2"><span className="text-secondary">Pembeli</span><p className="mb-0">{selectedOrder.nama_pembeli || selectedOrder.user_nama_d || "-"}</p></div>
                            <div><span className="text-secondary">Email</span><p className="mb-0">{selectedOrder.user_email || "-"}</p></div>
                          </div>
                        </div>

                        {/* KANAN */}
                        <div className="col-md-6">
                          <div className="border rounded p-3">
                            <h6 className="fw-bold mb-3">Informasi Pesanan</h6>

                            <div className="mb-2"><span className="text-secondary">ID Pesanan</span><p className="fw-bold mb-0">#{selectedOrder.id}</p></div>
                            <div className="mb-2"><span className="text-secondary">Nama Penerima</span><p className="mb-0">{selectedOrder.nama_pembeli || "-"}</p></div>
                            <div className="mb-2"><span className="text-secondary">Alamat Kirim</span><p className="mb-0">{selectedOrder.alamat_pembeli || "-"}</p></div>
                            <div className="mb-2"><span className="text-secondary">Telepon</span><p className="mb-0">{selectedOrder.phone_pembeli || "-"}</p></div>
                            <div className="mb-2"><span className="text-secondary">Metode Bayar</span><p className="mb-0">{selectedOrder.metode_pembayaran || "-"}</p></div>
                            <div className="mb-2"><span className="text-secondary">Status Bayar</span><p className="mb-0"><span className={`badge ${getStatusBayarBadge(selectedOrder.pembayaran || "Belum")}`}>{selectedOrder.pembayaran || "Belum"}</span></p></div>
                            <div className="mb-2"><span className="text-secondary">Kurir</span><p className="mb-0">{selectedOrder.pengiriman || "-"}</p></div>
                            <div className="mb-2"><span className="text-secondary">Status Pesanan</span><p className="mb-0"><span className={`badge ${getStatusBadge(selectedOrder.status || "Tertunda")}`}>{selectedOrder.status || "Tertunda"}</span></p></div>
                            <div className="mb-2"><span className="text-secondary">Catatan</span><p className="mb-0">{selectedOrder.catatan || "-"}</p></div>
                            <div className="mb-2"><span className="text-secondary">Tanggal Dibuat</span><p className="mb-0">{formatTanggal(selectedOrder.created_at)}</p></div>
                            <div className="mb-2"><span className="text-secondary">Terakhir Diperbarui</span><p className="mb-0">{formatTanggal(selectedOrder.updated_at)}</p></div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={closeModal}>Tutup</button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ===== MODAL EDIT PESANAN ===== */}
          {showEditModal && editOrder && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1050, overflow: "auto" }} onClick={closeEditModal}>
              <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "550px", margin: "50px auto" }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">

                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title fw-bold">Ubah Pesanan #{editOrder.id}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={closeEditModal} />
                  </div>

                  <div className="modal-body">
                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError("")} />
                      </div>
                    )}
                    {success && (
                      <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {success}
                        <button type="button" className="btn-close" onClick={() => setSuccess("")} />
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label small fw-medium">Status Pesanan</label>
                        <select
                          name="status"
                          className="form-select form-select-sm"
                          value={form.status}
                          onChange={handleChange}
                        >
                          {STATUS_PROSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-medium">Status Pembayaran</label>
                        <select
                          name="pembayaran"
                          className="form-select form-select-sm"
                          value={form.pembayaran}
                          onChange={handleChange}
                        >
                          {STATUS_BAYAR.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-medium">Metode Bayar</label>
                        <select
                          name="metode_pembayaran"
                          className="form-select form-select-sm"
                          value={form.metode_pembayaran}
                          onChange={handleChange}
                        >
                          <option value="COD">COD</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-medium">Kurir</label>
                        <input
                          type="text"
                          name="pengiriman"
                          className="form-control form-control-sm"
                          value={form.pengiriman}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-medium">Catatan</label>
                        <textarea
                          name="catatan"
                          className="form-control form-control-sm"
                          rows="2"
                          value={form.catatan}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                          disabled={submitting}
                        >
                          {submitting ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={closeEditModal}
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ===== MODAL KONFIRMASI HAPUS ===== */}
          {showDeleteModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1050, overflow: "auto" }} onClick={closeDeleteModal}>
              <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px", margin: "50px auto" }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">

                  <div className="modal-header bg-danger text-white">
                    <h5 className="modal-title fw-bold">Konfirmasi Hapus</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={closeDeleteModal} />
                  </div>

                  <div className="modal-body text-center py-4">
                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError("")} />
                      </div>
                    )}
                    {success && (
                      <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {success}
                        <button type="button" className="btn-close" onClick={() => setSuccess("")} />
                      </div>
                    )}

                    <p className="mb-0">Apakah Anda yakin ingin menghapus pesanan ini?</p>
                    <p className="text-danger small">Tindakan ini tidak dapat dibatalkan!</p>
                  </div>

                  <div className="modal-footer d-flex justify-content-center gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={closeDeleteModal} disabled={deleting}>Batal</button>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>{deleting ? "Menghapus..." : "Ya, Hapus"}</button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}