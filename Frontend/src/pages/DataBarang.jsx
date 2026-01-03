import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import Modal from '../components/organisms/Modal';
import Input from '../components/atoms/Input';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';
import api from '../api';
import { useLocation } from 'react-router-dom';

const DataBarang = () => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Search (INI YANG TADI KURANG)
  const [searchTerm, setSearchTerm] = useState('');

  // State Modals
  const [showModalForm, setShowModalForm] = useState(false); 
  const [showModalHapus, setShowModalHapus] = useState(false);
  
  // State Form Data
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
      name: '',
      category: '',
      color: '',
      weight: '',
      price_per_kg: '',
      stock: ''
  });

  const location = useLocation(); 

  // --- 1. HANDLE SEARCH DARI SIDEBAR ---
  useEffect(() => {
    // Kalau ada kiriman search dari Sidebar, masukkan ke state searchTerm
    if (location.state?.globalSearch) {
        setSearchTerm(location.state.globalSearch);
    }
  }, [location.state]);

  // --- 2. GET DATA (READ) ---
  const fetchData = async () => {
      try {
          const [resProducts, resCategories] = await Promise.all([
              api.get('/products/'),
              api.get('/categories/')
          ]);
          setProducts(resProducts.data);
          setCategories(resCategories.data);
      } catch (error) {
          console.error("Gagal ambil data:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, []);

  // --- 3. FILTER DATA BERDASARKAN SEARCH ---
  const filteredProducts = products.filter((item) => {
      if (!searchTerm) return true; // Kalau kosong, tampilkan semua
      // Cari berdasarkan Nama Barang ATAU Kategori
      return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  });

  // --- HANDLE INPUT FORM ---
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SIMPAN DATA ---
  const handleSimpan = async () => {
      try {
          if (isEdit) {
              await api.put(`/products/${currentId}/`, formData);
              alert("Data berhasil diperbarui!");
          } else {
              await api.post('/products/', formData);
              alert("Data berhasil ditambahkan!");
          }
          fetchData();
          closeModal();
      } catch (error) {
          console.error("Gagal simpan:", error.response);
          alert("Gagal menyimpan data. Pastikan semua kolom terisi.");
      }
  };

  // --- HAPUS DATA ---
  const handleHapus = async () => {
      try {
          await api.delete(`/products/${currentId}/`);
          alert("Data berhasil dihapus!");
          fetchData();
          setShowModalHapus(false);
      } catch (error) {
          console.error("Gagal hapus:", error);
          alert("Gagal menghapus data.");
      }
  };

  // --- HELPER FUNCTIONS ---
  const openModalTambah = () => {
      setIsEdit(false);
      setFormData({ name: '', category: '', color: '', weight: '', price_per_kg: '', stock: '' });
      setShowModalForm(true);
  };

  const openModalEdit = (item) => {
      setIsEdit(true);
      setCurrentId(item.id);
      setFormData({
          name: item.name,
          category: item.category,
          color: item.color,
          weight: item.weight,
          price_per_kg: item.price_per_kg,
          stock: item.stock
      });
      setShowModalForm(true);
  };

  const openModalHapus = (id) => {
      setCurrentId(id);
      setShowModalHapus(true);
  };

  const closeModal = () => {
      setShowModalForm(false);
      setShowModalHapus(false);
  };

  const formatRp = (val) => "Rp " + new Intl.NumberFormat("id-ID").format(val);

  return (
    <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Data Barang</h2>
        </div>

        {/* INPUT SEARCH LOKAL (Opsional, biar user tau dia lagi cari apa) */}
        {searchTerm && (
            <div className="mb-4 flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded-lg border border-blue-200">
                <Search className="w-4 h-4 mr-2" />
                <span className="text-sm">Menampilkan hasil pencarian untuk: <strong>"{searchTerm}"</strong></span>
                <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-auto text-xs bg-white border border-blue-300 px-2 py-1 rounded hover:bg-gray-100"
                >
                    Reset
                </button>
            </div>
        )}

        <button 
            onClick={openModalTambah}
            className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow mb-6 flex items-center gap-2 transition-colors"
        >
            <Plus className="w-4 h-4" /> Tambah Barang
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabel Content */}
            <div className="overflow-x-auto p-4">
                <table className="w-full text-sm text-center border-collapse border border-gray-300">
                    <thead className="bg-white text-black font-bold">
                        <tr>
                            <th className="border border-gray-300 px-4 py-3 w-10">#</th>
                            <th className="border border-gray-300 px-4 py-3">Nama Barang</th>
                            <th className="border border-gray-300 px-4 py-3">Kategori</th>
                            <th className="border border-gray-300 px-4 py-3">Warna</th>
                            <th className="border border-gray-300 px-4 py-3">Berat(Kg)</th>
                            <th className="border border-gray-300 px-4 py-3">Harga/Kg</th>
                            <th className="border border-gray-300 px-4 py-3">Stok</th>
                            <th className="border border-gray-300 px-4 py-3">Total Nilai(Rp)</th>
                            <th className="border border-gray-300 px-4 py-3 w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {loading ? (
                            <tr><td colSpan="9" className="py-4">Memuat data...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan="9" className="py-4">Data tidak ditemukan.</td></tr>
                        ) : (
                            // MAPPING DARI filteredProducts (BUKAN products LAGI)
                            filteredProducts.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-2 py-2">{item.name}</td>
                                    <td className="border border-gray-300 px-2 py-2">{item.category_name}</td>
                                    <td className="border border-gray-300 px-2 py-2">{item.color}</td>
                                    <td className="border border-gray-300 px-2 py-2">{item.weight}</td>
                                    <td className="border border-gray-300 px-2 py-2">{formatRp(item.price_per_kg)}</td>
                                    <td className="border border-gray-300 px-2 py-2">{item.stock}</td>
                                    <td className="border border-gray-300 px-2 py-2 font-bold text-gray-700">{formatRp(item.total_value)}</td>
                                    <td className="border border-gray-300 px-2 py-2">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => openModalEdit(item)} 
                                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                                            >
                                                <Edit className="w-3 h-3" /> Edit
                                            </button>
                                            <button 
                                                onClick={() => openModalHapus(item.id)} 
                                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" /> Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
                <div>Total Data: {filteredProducts.length}</div>
            </div>
        </div>

        {/* MODAL FORM */}
        <Modal 
            isOpen={showModalForm} 
            onClose={closeModal} 
            title={<>{isEdit ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />} {isEdit ? "Edit Barang" : "Tambah Barang"}</>}
            size="max-w-2xl"
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang</label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan Nama Barang" className="py-2" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                    <select 
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-simig-blue bg-white"
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Warna</label>
                    <Input name="color" value={formData.color} onChange={handleChange} placeholder="Masukkan Warna" className="py-2" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Berat(Kg)</label>
                    <Input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Contoh: 100" className="py-2" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Harga/Kg</label>
                    <Input type="number" name="price_per_kg" value={formData.price_per_kg} onChange={handleChange} placeholder="Contoh: 1000000" className="py-2" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah Stok Awal</label>
                    <Input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Contoh: 1000" className="py-2" />
                </div>
            </div>
            <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
                <button onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <X className="w-4 h-4" /> Batal
                </button>
                <button onClick={handleSimpan} className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <Save className="w-4 h-4" /> Simpan
                </button>
            </div>
        </Modal>

        {/* MODAL HAPUS */}
        <Modal 
            isOpen={showModalHapus} 
            onClose={closeModal} 
            title={<><Trash2 className="w-5 h-5" /> Hapus Barang</>}
            size="max-w-lg"
        >
            <p className="text-gray-700 font-medium py-4">Apakah anda yakin ingin menghapus data barang ini?</p>
            <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-200 gap-3">
                <button onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded shadow transition-colors">
                    Batal
                </button>
                <button onClick={handleHapus} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow transition-colors">
                    Hapus
                </button>
            </div>
        </Modal>

    </DashboardLayout>
  );
};

export default DataBarang;