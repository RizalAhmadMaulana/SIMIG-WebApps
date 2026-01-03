import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import Modal from '../components/organisms/Modal';
import Input from '../components/atoms/Input';
import { Plus, Printer, Edit, Trash2, Save, X, Truck } from 'lucide-react'; // Pakai icon Truck biar beda dikit
import api from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 👈 Import gaya baru (Anti Error)

const BarangKeluar = () => {
  // --- STATE ---
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModalForm, setShowModalForm] = useState(false);
  const [showModalHapus, setShowModalHapus] = useState(false);
  const [showModalCetak, setShowModalCetak] = useState(false); 
  
  // Form Data
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
      product: '', 
      date: new Date().toISOString().split('T')[0], 
      quantity: '',
      notes: ''
  });

  // Filter Cetak
  const [bulanSelected, setBulanSelected] = useState(""); 

  // --- 1. GET DATA (Transactions Out & Products) ---
  const fetchData = async () => {
      try {
          // Ambil Data Transaksi KELUAR & Data Produk
          const [resTrans, resProd] = await Promise.all([
              api.get('/transactions-out/'), // 👈 Endpoint Barang Keluar
              api.get('/products/')
          ]);
          setTransactions(resTrans.data);
          setProducts(resProd.data);
      } catch (error) {
          console.error("Gagal ambil data:", error);
          alert("Gagal memuat data.");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, []);

  // --- 2. HANDLE INPUT ---
  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  // --- 3. SIMPAN DATA ---
  const handleSimpan = async (e) => {
      e.preventDefault();
      
      // Validasi Stok (Frontend Check)
      if (!isEdit) {
          const selectedProduct = products.find(p => p.id === parseInt(formData.product));
          if (selectedProduct && parseInt(formData.quantity) > selectedProduct.stock) {
              alert(`Stok tidak cukup! Stok saat ini: ${selectedProduct.stock}`);
              return;
          }
      }

      try {
          if (isEdit) {
            await api.put(`/transactions-out/${currentId}/`, formData);
            alert("Data barang keluar diperbarui!");
          } else {
            await api.post('/transactions-out/', formData);
            alert("Barang keluar berhasil dicatat & stok berkurang!");
          }
          fetchData();
          closeModal();
      } catch (error) {
          console.error("Gagal simpan:", error.response);
          alert("Gagal menyimpan data.");
      }
  };

  // --- 4. HAPUS DATA ---
  const handleHapus = async () => {
      try {
          await api.delete(`/transactions-out/${currentId}/`);
          alert("Transaksi dihapus, stok dikembalikan (refund).");
          fetchData();
          setShowModalHapus(false);
      } catch (error) {
          console.error("Gagal hapus:", error);
          alert("Gagal menghapus data.");
      }
  };

  // --- 5. LOGIKA CETAK PDF ---
  const handleProcessCetak = () => {
      if (!bulanSelected) {
          alert("Silakan pilih bulan terlebih dahulu!");
          return;
      }

      const dataToPrint = transactions.filter(item => {
          const monthItem = item.date.split('-')[1]; 
          return monthItem === bulanSelected;
      });

      if (dataToPrint.length === 0) {
          alert(`Tidak ada transaksi keluar pada bulan ini.`);
          return;
      }

      const monthNames = {
          "01": "Januari", "02": "Februari", "03": "Maret", "04": "April",
          "05": "Mei", "06": "Juni", "07": "Juli", "08": "Agustus",
          "09": "September", "10": "Oktober", "11": "November", "12": "Desember"
      };
      const namaBulan = monthNames[bulanSelected] || bulanSelected;

      try {
          const doc = new jsPDF();

          // Header Laporan Keluar
          doc.setFontSize(18);
          doc.text(`Laporan Barang Keluar - ${namaBulan}`, 14, 20);
          doc.setFontSize(10);
          doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

          const tableColumn = ["No", "Tanggal", "Nama Barang", "Jumlah (Kg)", "Catatan"];
          const tableRows = [];

          dataToPrint.forEach((item, index) => {
              const transactionData = [
                  index + 1,
                  item.date,
                  item.product_name || "Item Terhapus",
                  item.quantity,
                  item.notes || "-"
              ];
              tableRows.push(transactionData);
          });

          autoTable(doc, {
              head: [tableColumn],
              body: tableRows,
              startY: 35,
              theme: 'grid',
              styles: { fontSize: 9 },
              headStyles: { fillColor: [192, 57, 43] } // Warna Merah (Khas Barang Keluar)
          });

          doc.save(`Laporan_Keluar_${namaBulan}.pdf`);
          setShowModalCetak(false); 

      } catch (error) {
          console.error("Gagal mencetak PDF:", error);
          alert("Gagal Cetak: " + error.message);
      }
  };

  // --- HELPER ---
  const openModalTambah = () => {
      setIsEdit(false);
      setFormData({ product: '', date: new Date().toISOString().split('T')[0], quantity: '', notes: '' });
      setShowModalForm(true);
  };

  const openModalEdit = (item) => {
      setIsEdit(true);
      setCurrentId(item.id);
      setFormData({
          product: item.product,
          date: item.date,
          quantity: item.quantity,
          notes: item.notes
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
      setShowModalCetak(false);
  };

  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-black mb-6">Barang Keluar</h2>

        <div className="flex flex-wrap gap-4 mb-6">
            <button 
                onClick={openModalTambah}
                className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
            >
                <Plus className="w-4 h-4" /> Tambah Barang Keluar
            </button>
            <button 
                onClick={() => setShowModalCetak(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
            >
                <Printer className="w-4 h-4" /> Cetak Barang Keluar
            </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabel */}
            <div className="overflow-x-auto p-4">
                <table className="w-full text-sm text-left border-collapse border border-gray-300">
                    <thead className="bg-white text-black font-bold">
                        <tr>
                            <th className="border border-gray-300 px-4 py-3 text-center">#</th>
                            <th className="border border-gray-300 px-4 py-3">Tanggal</th>
                            <th className="border border-gray-300 px-4 py-3">Nama Barang</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Jumlah (Kg)</th>
                            <th className="border border-gray-300 px-4 py-3">Catatan</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {loading ? (
                            <tr><td colSpan="6" className="py-4 text-center">Memuat data...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan="6" className="py-4 text-center">Belum ada transaksi barang keluar.</td></tr>
                        ) : (
                            transactions.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-3 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-3">{item.date}</td>
                                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                                        {item.product_name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">
                                        -{item.quantity}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-500 italic">
                                        {item.notes || "-"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openModalEdit(item)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                <Edit className="w-3 h-3" /> Edit
                                            </button>
                                            <button onClick={() => openModalHapus(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
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
             <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-600">Showing {transactions.length} entries</span>
            </div>
        </div>

        {/* --- MODAL FORM --- */}
        <Modal 
            isOpen={showModalForm} 
            onClose={closeModal} 
            title={<>{isEdit ? <Edit className="w-5 h-5" /> : <Truck className="w-5 h-5" />} {isEdit ? "Edit Barang Keluar" : "Catat Barang Keluar"}</>}
            size="max-w-lg"
        >
            <form onSubmit={handleSimpan} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal</label>
                    <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Pilih Barang</label>
                    <select 
                        name="product" 
                        value={formData.product} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-simig-blue bg-white"
                        required
                    >
                        <option value="">-- Pilih Barang --</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah Keluar (Kg)</label>
                    <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Contoh: 20" required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Catatan (Opsional)</label>
                    <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-simig-blue"
                        rows="3"
                        placeholder="Contoh: Dikirim ke Client X"
                    ></textarea>
                </div>
                
                <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
                    <button type="button" onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2">
                        <X className="w-4 h-4" /> Batal
                    </button>
                    <button type="submit" className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                        <Save className="w-4 h-4" /> Simpan
                    </button>
                </div>
            </form>
        </Modal>

        {/* --- MODAL HAPUS --- */}
        <Modal isOpen={showModalHapus} onClose={closeModal} title="Hapus Transaksi">
            <p className="text-gray-700 py-4">Apakah anda yakin? Stok barang akan otomatis <b>dikembalikan (bertambah)</b>.</p>
            <div className="flex justify-end gap-3 pt-4 border-t">
                 <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded">Batal</button>
                 <button onClick={handleHapus} className="bg-red-500 text-white py-2 px-4 rounded">Hapus</button>
            </div>
        </Modal>

        {/* --- MODAL CETAK --- */}
        <Modal 
            isOpen={showModalCetak} 
            onClose={() => setShowModalCetak(false)} 
            title={<><Printer className="w-5 h-5" /> Cetak Barang Keluar</>}
            size="max-w-md"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bulan</label>
                    <select 
                        value={bulanSelected}
                        onChange={(e) => setBulanSelected(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-simig-blue bg-white"
                    >
                        <option value="">-- Pilih Bulan --</option>
                        <option value="01">Januari</option>
                        <option value="02">Februari</option>
                        <option value="03">Maret</option>
                        <option value="04">April</option>
                        <option value="05">Mei</option>
                        <option value="06">Juni</option>
                        <option value="07">Juli</option>
                        <option value="08">Agustus</option>
                        <option value="09">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Desember</option>
                    </select>
                </div>
                
                <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
                    <button onClick={() => setBulanSelected("")} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Reset
                    </button>
                    <button onClick={handleProcessCetak} className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                        <Printer className="w-4 h-4" /> Cetak
                    </button>
                </div>
            </div>
        </Modal>

    </DashboardLayout>
  );
};

export default BarangKeluar;