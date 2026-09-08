// frontend/src/pages/admin/AdminPembeliPage.jsx
import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { formatTanggal, mediaUrl, onImgError } from "../../utils";
import { KELAMIN } from "../../constants";

export default function AdminPembeliPage() {
  const [pembeli, setPembeli] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewFoto, setPreviewFoto] = useState("");
  const [form, setForm] = useState({ nama_d: "", nama_b: "", kelamin: "", lahir: "", alamat: "", phone: "", email: "", uname: "", passwd: "", foto: "" });

  useEffect(() => { fetchPembeli(); }, []);

  const fetchPembeli = () => {
    setLoading(true);
    adminApi.getPembeli()
      .then((res) => { setPembeli(res.data || []); })
      .catch((err) => { console.error("Error fetching pembeli:", err); setError("Gagal memuat data pembeli"); })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pembeli ini?")) return;
    try {
      await adminApi.deletePembeli(id);
      setPembeli(pembeli.filter((item) => item.id !== id));
      alert("Pembeli berhasil dihapus");
    } catch (error) {
      console.error("Error deleting pembeli:", error);
      alert(error.body?.message || "Gagal menghapus pembeli");
    }
  };

  const openModal = (user) => { setSelectedUser(user); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedUser(null); };

  const openTambahModal = () => {
    setShowTambahModal(true);
    setForm({ nama_d: "", nama_b: "", kelamin: "", lahir: "", alamat: "", phone: "", email: "", uname: "", passwd: "", foto: "" });
    setPreviewFoto("");
    setError("");
  };

  const closeTambahModal = () => { setShowTambahModal(false); setError(""); };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setForm({
      nama_d: user.nama_d || "",
      nama_b: user.nama_b || "",
      kelamin: user.kelamin || "",
      lahir: user.lahir || "",
      alamat: user.alamat || "",
      phone: user.phone || "",
      email: user.email || "",
      uname: user.uname || "",
      passwd: "",
      foto: user.foto || ""
    });
    setPreviewFoto(user.foto ? mediaUrl(user.foto) : "");
    setShowEditModal(true);
    setError("");
  };

  const closeEditModal = () => { setShowEditModal(false); setSelectedUser(null); setError(""); };
  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => { setPreviewFoto(reader.result); };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("gambar", file);

    adminApi.uploadGambar(formData)
      .then((res) => {
        const fotoPath = res.data?.path || res.data?.filename || res.data;
        setForm((prevForm) => ({ ...prevForm, foto: fotoPath }));
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        setError(err.body?.message || err.message || "Gagal upload gambar");
        setPreviewFoto("");
      });
  };

  const handleTambahSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!form.nama_d || !form.email || !form.uname || !form.passwd) throw new Error("Semua field wajib diisi");

      const userData = {
        nama_d: form.nama_d,
        nama_b: form.nama_b || "",
        kelamin: form.kelamin || "",
        lahir: form.lahir || "",
        alamat: form.alamat || "",
        phone: form.phone || "",
        email: form.email,
        uname: form.uname,
        passwd: form.passwd,
        foto: form.foto || ""
      };

      const response = await adminApi.createPembeli(userData);
      alert(response.message || "Pembeli berhasil ditambahkan");
      closeTambahModal();
      fetchPembeli();
    } catch (err) {
      console.error("Error creating pembeli:", err);
      setError(err.body?.message || err.message || "Gagal menambahkan pembeli");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        nama_d: form.nama_d,
        nama_b: form.nama_b || "",
        kelamin: form.kelamin || "",
        lahir: form.lahir || "",
        alamat: form.alamat || "",
        phone: form.phone || "",
        email: form.email,
        uname: form.uname,
        foto: form.foto || ""
      };

      if (form.passwd) payload.passwd = form.passwd;

      const response = await adminApi.updatePembeli(selectedUser.id, payload);
      alert(response.message || "Pembeli berhasil diupdate");
      closeEditModal();
      fetchPembeli();
    } catch (err) {
      console.error("Error updating pembeli:", err);
      setError(err.body?.message || err.message || "Gagal mengupdate pembeli");
    } finally {
      setSubmitting(false);
    }
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
          {error && !showTambahModal && !showEditModal && (
            <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-0">Manajemen Pembeli</h5>
              <small className="text-secondary">{pembeli.length} akun pembeli terdaftar</small>
            </div>
            <button onClick={openTambahModal} className="btn btn-dark btn-sm">+ Pembeli baru</button>
          </div>

          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-sm table-hover mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: 50 }}>Foto</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Telepon</th>
                    <th>Daftar</th>
                    <th className="text-end" style={{ width: 150 }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {pembeli.length === 0 ? (
                    <tr><td colSpan="7" className="text-center text-secondary py-4">Belum ada akun pembeli. Klik "Pembeli baru" untuk menambah.</td></tr>
                  ) : (
                    pembeli.map((item) => (
                      <tr key={item.id}>
                        <td><img src={mediaUrl(item.foto)} alt={item.nama_d} className="rounded-circle" style={{ width: 36, height: 36, objectFit: "cover", background: "#f5f5f5" }} onError={onImgError} /></td>
                        <td><span className="fw-medium">{item.nama_d}</span> {item.nama_b || ""}</td>
                        <td className="text-secondary small">{item.email}</td>
                        <td className="text-secondary small">{item.uname}</td>
                        <td className="text-secondary small">{item.phone || "-"}</td>
                        <td className="text-secondary small">{formatTanggal(item.created_at)}</td>
                        <td className="text-end">
                          <div className="d-flex gap-1 justify-content-end">
                            {/* Detail - Icon mata */}
                            <button 
                              onClick={() => openModal(item)} 
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
                              onClick={() => handleDelete(item.id)} 
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

          {/* ===== MODAL DETAIL ===== */}
          {showModal && selectedUser && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={closeModal}>
              <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Detail Pembeli</h5>
                    <button type="button" className="btn-close" onClick={closeModal} />
                  </div>

                  <div className="modal-body">
                    <div className="text-center mb-3">
                      <img src={mediaUrl(selectedUser.foto)} alt={selectedUser.nama_d} className="rounded-circle" style={{ width: 80, height: 80, objectFit: "cover" }} onError={onImgError} />
                    </div>

                    <div className="row"><div className="col-4 text-secondary">Nama Depan</div><div className="col-8">{selectedUser.nama_d}</div></div>
                    <div className="row mt-2"><div className="col-4 text-secondary">Nama Belakang</div><div className="col-8">{selectedUser.nama_b || "-"}</div></div>
                    <div className="row mt-2"><div className="col-4 text-secondary">Kelamin</div><div className="col-8">{selectedUser.kelamin || "-"}</div></div>
                    <div className="row mt-2"><div className="col-4 text-secondary">Tanggal Lahir</div><div className="col-8">{selectedUser.lahir || "-"}</div></div>
                    <div className="row mt-2"><div className="col-4 text-secondary">Alamat</div><div className="col-8">{selectedUser.alamat || "-"}</div></div>
                    <div className="row mt-2"><div className="col-4 text-secondary">Telepon</div><div className="col-8">{selectedUser.phone || "-"}</div></div>
                    <div className="row mt-2"><div className="col-4 text-secondary">Email</div><div className="col-8">{selectedUser.email}</div></div>
                    <div className="row mt-2"><div className="col-4 text-secondary">Username</div><div className="col-8">{selectedUser.uname}</div></div>
                    <div className="row mt-2"><div className="col-4 text-secondary">Tanggal Daftar</div><div className="col-8">{formatTanggal(selectedUser.created_at)}</div></div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary btn-sm" onClick={closeModal}>Tutup</button>
                    <button onClick={() => { closeModal(); openEditModal(selectedUser); }} className="btn btn-primary btn-sm">Ubah</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== MODAL TAMBAH ===== */}
          {showTambahModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={closeTambahModal}>
              <div className="modal-dialog modal-dialog-centered modal-xl" style={{ maxWidth: "1000px" }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Tambah Pembeli Baru</h5>
                    <button type="button" className="btn-close" onClick={closeTambahModal} />
                  </div>

                  <div className="modal-body">
                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <form onSubmit={handleTambahSubmit}>
                      <div className="row g-2">
                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Nama Depan *</label>
                          <input type="text" name="nama_d" className="form-control form-control-sm" placeholder="Nama depan" value={form.nama_d} onChange={handleChange} required />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Nama Belakang</label>
                          <input type="text" name="nama_b" className="form-control form-control-sm" placeholder="Nama belakang" value={form.nama_b} onChange={handleChange} />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Kelamin</label>
                          <select name="kelamin" className="form-select form-select-sm" value={form.kelamin} onChange={handleChange}>
                            <option value="">Pilih</option>
                            {KELAMIN.map((k) => <option key={k} value={k}>{k}</option>)}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Tanggal Lahir</label>
                          <input type="date" name="lahir" className="form-control form-control-sm" value={form.lahir} onChange={handleChange} />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Telepon</label>
                          <input type="number" name="phone" className="form-control form-control-sm" placeholder="08123456789" value={form.phone} onChange={handleChange} />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Email *</label>
                          <input type="email" name="email" className="form-control form-control-sm" placeholder="email@example.com" value={form.email} onChange={handleChange} required />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Username *</label>
                          <input type="text" name="uname" className="form-control form-control-sm" placeholder="Username" value={form.uname} onChange={handleChange} required />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Password *</label>
                          <input type="password" name="passwd" className="form-control form-control-sm" placeholder="Min 6 karakter" value={form.passwd} onChange={handleChange} required minLength="6" />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Foto</label>
                          <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleFileChange} />
                          {previewFoto && <img src={previewFoto} alt="Preview" className="mt-1 rounded" style={{ width: 40, height: 40, objectFit: "cover" }} />}
                        </div>

                        <div className="col-md-9">
                          <label className="form-label fw-medium small">Alamat</label>
                          <textarea name="alamat" className="form-control form-control-sm" rows="2" placeholder="Masukkan alamat lengkap" value={form.alamat} onChange={handleChange} />
                        </div>

                        <div className="col-12 d-flex gap-2">
                          <button type="submit" className="btn btn-dark btn-sm" disabled={submitting}>{submitting ? "Menyimpan..." : "Tambah Pembeli"}</button>
                          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeTambahModal} disabled={submitting}>Batal</button>
                        </div>

                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== MODAL EDIT ===== */}
          {showEditModal && selectedUser && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={closeEditModal}>
              <div className="modal-dialog modal-dialog-centered modal-xl" style={{ maxWidth: "1000px" }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Ubah Data Pembeli</h5>
                    <button type="button" className="btn-close" onClick={closeEditModal} />
                  </div>

                  <div className="modal-body">
                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <form onSubmit={handleEditSubmit}>
                      <div className="row g-2">
                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Nama Depan *</label>
                          <input type="text" name="nama_d" className="form-control form-control-sm" value={form.nama_d} onChange={handleChange} required />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Nama Belakang</label>
                          <input type="text" name="nama_b" className="form-control form-control-sm" value={form.nama_b} onChange={handleChange} />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Kelamin</label>
                          <select name="kelamin" className="form-select form-select-sm" value={form.kelamin} onChange={handleChange}>
                            <option value="">Pilih</option>
                            {KELAMIN.map((k) => <option key={k} value={k}>{k}</option>)}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Tanggal Lahir</label>
                          <input type="date" name="lahir" className="form-control form-control-sm" value={form.lahir} onChange={handleChange} />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Telepon</label>
                          <input type="number" name="phone" className="form-control form-control-sm" value={form.phone} onChange={handleChange} />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Email *</label>
                          <input type="email" name="email" className="form-control form-control-sm" value={form.email} onChange={handleChange} required />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Username *</label>
                          <input type="text" name="uname" className="form-control form-control-sm" value={form.uname} onChange={handleChange} required />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Password</label>
                          <input type="password" name="passwd" className="form-control form-control-sm" placeholder="Kosongkan jika tidak diubah" value={form.passwd} onChange={handleChange} minLength="6" />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-medium small">Foto</label>
                          {previewFoto && <img src={previewFoto} alt="Preview" className="d-block mb-1 rounded" style={{ width: 40, height: 40, objectFit: "cover" }} />}
                          <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <div className="col-md-9">
                          <label className="form-label fw-medium small">Alamat</label>
                          <textarea name="alamat" className="form-control form-control-sm" rows="2" value={form.alamat} onChange={handleChange} />
                        </div>

                        <div className="col-12 d-flex gap-2">
                          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan Perubahan"}</button>
                          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeEditModal} disabled={submitting}>Batal</button>
                        </div>

                      </div>
                    </form>
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