import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import Modal from '../components/organisms/Modal';
import Input from '../components/atoms/Input';
import { Plus, Edit, Trash2, Save, X, Tags } from 'lucide-react';
import api from '../api'; // Import API yang sudah ada token-nya

const KelolaKategori = () => {
  // --- STATE MANAGEMENT ---
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modals
  const [showModalForm, setShowModalForm] = useState(false);
  const [showModalHapus, setShowModalHapus] = useState(false);
  
  // State Form Data
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [categoryName, setCategoryName] = useState(''); // Cuma butuh 1 state string

  // --- 1. GET DATA (READ) ---
  const fetchCategories = async () => {
      try {
          const response = await api.get('/categories/');
          setCategories(response.data);
      } catch (error) {
          console.error("Gagal ambil kategori:", error);
          alert("Gagal memuat data kategori.");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchCategories();
  }, []);

  // --- 2. SIMPAN DATA (CREATE & UPDATE) ---
  const handleSimpan = async (e) => {
      e.preventDefault(); // Mencegah reload form
      try {
          const payload = { name: categoryName };

          if (isEdit) {
              // Mode Edit (PUT)
              await api.put(`/categories/${currentId}/`, payload);
              alert("Kategori berhasil diperbarui!");
          } else {
              // Mode Tambah (POST)
              await api.post('/categories/', payload);
              alert("Kategori berhasil ditambahkan!");
          }
          
          fetchCategories(); // Refresh tabel
          closeModal();
      } catch (error) {
          console.error("Gagal simpan:", error.response);
          alert("Gagal menyimpan kategori.");
      }
  };

  // --- 3. HAPUS DATA (DELETE) ---
  const handleHapus = async () => {
      try {
          await api.delete(`/categories/${currentId}/`);
          alert("Kategori berhasil dihapus!");
          fetchCategories();
          setShowModalHapus(false);
      } catch (error) {
          console.error("Gagal hapus:", error);
          // Biasanya gagal hapus karena kategori ini masih dipakai di Data Barang (Protected)
          alert("Gagal menghapus. Pastikan kategori ini tidak sedang dipakai oleh barang manapun.");
      }
  };

  // --- HELPER FUNCTIONS ---
  const openModalTambah = () => {
      setIsEdit(false);
      setCategoryName('');
      setShowModalForm(true);
  };

  const openModalEdit = (item) => {
      setIsEdit(true);
      setCurrentId(item.id);
      setCategoryName(item.name);
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

  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-black mb-6">Kelola Kategori</h2>

        <button 
            onClick={openModalTambah}
            className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow mb-6 flex items-center gap-2 transition-colors"
        >
            <Plus className="w-4 h-4" /> Tambah Kategori
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header: Show Entries */}
            <div className="p-4 border-b border-gray-200 flex items-center">
                <span className="text-sm text-gray-600 mr-2">Show</span>
                <select className="border border-gray-300 rounded text-sm text-gray-600 px-2 py-1 focus:outline-none focus:border-simig-blue">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                </select>
                <span className="text-sm text-gray-600 ml-2">entries</span>
            </div>

            {/* Tabel Content */}
            <div className="overflow-x-auto p-4">
                <table className="w-full text-sm text-left border-collapse border border-gray-300">
                    <thead className="bg-white text-black font-bold">
                        <tr>
                            <th className="border border-gray-300 px-4 py-3 w-16 text-center">#</th>
                            <th className="border border-gray-300 px-4 py-3">Nama Kategori</th>
                            <th className="border border-gray-300 px-4 py-3 w-40 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {loading ? (
                            <tr><td colSpan="3" className="py-4 text-center">Memuat data...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan="3" className="py-4 text-center">Belum ada kategori.</td></tr>
                        ) : (
                            categories.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-3 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                                        <div className="flex items-center gap-2">
                                            <Tags className="w-4 h-4 text-simig-blue" />
                                            {item.name}
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => openModalEdit(item)} 
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors"
                                            >
                                                <Edit className="w-3 h-3" /> Edit
                                            </button>
                                            <button 
                                                onClick={() => openModalHapus(item.id)} 
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors"
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

            {/* Pagination Static */}
            <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">Showing {categories.length} entries</div>
                <div className="flex items-center">
                    <button className="px-3 py-1 border border-gray-300 rounded-l text-sm text-gray-600 hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 bg-simig-blue text-white text-sm border border-simig-blue">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-r text-sm text-gray-600 hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>

        {/* --- MODAL FORM (TAMBAH & EDIT) --- */}
        <Modal 
            isOpen={showModalForm} 
            onClose={closeModal} 
            title={<>{isEdit ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />} {isEdit ? "Edit Kategori" : "Tambah Kategori"}</>}
            size="max-w-md" // Lebih kecil karena formnya dikit
        >
            <form onSubmit={handleSimpan} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Kategori</label>
                    <Input 
                        value={categoryName} 
                        onChange={(e) => setCategoryName(e.target.value)} 
                        placeholder="Contoh: Plastik, Besi, Kertas" 
                        required // Validasi HTML5 biar gak kosong
                        autoFocus
                    />
                </div>
                
                <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
                    <button type="button" onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                        <X className="w-4 h-4" /> Batal
                    </button>
                    <button type="submit" className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                        <Save className="w-4 h-4" /> Simpan
                    </button>
                </div>
            </form>
        </Modal>

        {/* --- MODAL HAPUS --- */}
        <Modal 
            isOpen={showModalHapus} 
            onClose={closeModal} 
            title={<><Trash2 className="w-5 h-5" /> Hapus Kategori</>}
            size="max-w-sm"
        >
            <p className="text-gray-700 font-medium py-4 text-center">
                Apakah anda yakin ingin menghapus kategori ini?
            </p>
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

export default KelolaKategori;