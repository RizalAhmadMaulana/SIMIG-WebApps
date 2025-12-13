import React, { useState } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import Modal from '../components/organisms/Modal';
import Input from '../components/atoms/Input';
import { Plus, Printer, Edit, Trash2, Save } from 'lucide-react';

const BarangKeluar = () => {
  const [showModalTambah, setShowModalTambah] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalHapus, setShowModalHapus] = useState(false);
  const [showModalCetak, setShowModalCetak] = useState(false);

  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-black mb-6">Kelola Barang / Barang Keluar</h2>

        <div className="flex flex-wrap gap-4 mb-6">
            <button 
                onClick={() => setShowModalTambah(true)}
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
            <div className="p-4 border-b border-gray-200 flex items-center">
                <span className="text-sm text-gray-600 mr-2">Show</span>
                <select className="border border-gray-300 rounded text-sm text-gray-600 px-2 py-1 focus:outline-none focus:border-simig-light">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                </select>
                <span className="text-sm text-gray-600 ml-2">entries</span>
            </div>

            <div className="overflow-x-auto p-4">
                <table className="w-full text-sm text-center border-collapse border border-gray-300">
                    <thead className="bg-white text-black font-bold">
                        <tr>
                            <th className="border border-gray-300 px-4 py-3 w-12">#</th>
                            <th className="border border-gray-300 px-4 py-3">Nama Barang</th>
                            <th className="border border-gray-300 px-4 py-3">Tanggal</th>
                            <th className="border border-gray-300 px-4 py-3">Jumlah(Kg)</th>
                            <th className="border border-gray-300 px-4 py-3 w-40">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-2">1</td>
                            <td className="border border-gray-300 px-2 py-2">xxxxxxxxxx</td>
                            <td className="border border-gray-300 px-2 py-2">xxxxxx</td>
                            <td className="border border-gray-300 px-2 py-2">xxxxxx</td>
                            <td className="border border-gray-300 px-2 py-2">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => setShowModalEdit(true)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 transition-colors">
                                        <Edit className="w-3 h-3" /> Edit
                                    </button>
                                    <button onClick={() => setShowModalHapus(true)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 transition-colors">
                                        <Trash2 className="w-3 h-3" /> Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>

                        {[...Array(9)].map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="border border-gray-300 h-10 px-2 py-2">{i + 2}</td>
                                <td className="border border-gray-300 h-10"></td>
                                <td className="border border-gray-300 h-10"></td>
                                <td className="border border-gray-300 h-10"></td>
                                <td className="border border-gray-300 h-10"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">Showing 1 to 10 of 10 entries</div>
                <div className="flex items-center">
                    <button className="px-3 py-1 border border-gray-300 rounded-l text-sm text-gray-600 hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 bg-simig-light text-white text-sm border border-simig-light">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-r text-sm text-gray-600 hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>

        <Modal 
            isOpen={showModalTambah} 
            onClose={() => setShowModalTambah(false)} 
            title={<><Plus className="w-5 h-5" /> Tambah Barang Keluar</>}
            size="max-w-2xl"
        >
            <div className="space-y-3">
                <FormBarangKeluar />
            </div>
            <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" /> Reset
                </button>
                <button className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <Save className="w-4 h-4" /> Simpan
                </button>
            </div>
        </Modal>

        <Modal 
            isOpen={showModalEdit} 
            onClose={() => setShowModalEdit(false)} 
            title={<><Edit className="w-5 h-5" /> Edit Barang Keluar</>}
            size="max-w-2xl"
        >
            <div className="space-y-3">
                <FormBarangKeluar />
            </div>
            <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" /> Reset
                </button>
                <button className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <Save className="w-4 h-4" /> Simpan
                </button>
            </div>
        </Modal>

        <Modal 
            isOpen={showModalHapus} 
            onClose={() => setShowModalHapus(false)} 
            title={<><Trash2 className="w-5 h-5" /> Hapus Barang Keluar</>}
            size="max-w-lg"
        >
            <p className="text-gray-700 font-medium py-4">Apakah anda ingin menghapus data barang keluar ini?</p>
            <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-200 gap-3">
                <button onClick={() => setShowModalHapus(false)} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow transition-colors">
                    Batal
                </button>
                <button className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow transition-colors">
                    Hapus
                </button>
            </div>
        </Modal>

        <Modal 
            isOpen={showModalCetak} 
            onClose={() => setShowModalCetak(false)} 
            title={<><Printer className="w-5 h-5" /> Cetak Barang Keluar</>}
            size="max-w-lg"
        >
            <div className="space-y-3 py-2">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Bulan</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-simig-light bg-white">
                        <option value="">-- Pilih Bulan --</option>
                        <option value="1">Januari</option>
                        <option value="2">Februari</option>
                        <option value="3">Maret</option>
                        <option value="4">April</option>
                        <option value="5">Mei</option>
                        <option value="6">Juni</option>
                        <option value="7">Juli</option>
                        <option value="8">Agustus</option>
                        <option value="9">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Desember</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" /> Reset
                </button>
                <button className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <Printer className="w-4 h-4" /> Cetak
                </button>
            </div>
        </Modal>

    </DashboardLayout>
  );
};

const FormBarangKeluar = () => (
    <>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-simig-light bg-white">
                <option value="">-- Pilih Nama Barang --</option>
                <option value="1">Barang 1</option>
                <option value="2">Barang 2</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal</label>
            <Input type="date" className="py-2" />
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah(Kg)</label>
            <Input type="number" placeholder="Masukkan Jumlah, Contoh : 100" className="py-2" />
        </div>
    </>
);

export default BarangKeluar;