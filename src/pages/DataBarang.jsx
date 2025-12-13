import React, { useState } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import Modal from '../components/organisms/Modal';
import Input from '../components/atoms/Input';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

const DataBarang = () => {
  const [showModalTambah, setShowModalTambah] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalHapus, setShowModalHapus] = useState(false);

  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-black mb-6">Data Barang</h2>

        <button 
            onClick={() => setShowModalTambah(true)}
            className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow mb-6 flex items-center gap-2 transition-colors"
        >
            <Plus className="w-4 h-4" /> Tambah Barang
        </button>

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
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-2">1</td>
                            <td className="border border-gray-300 px-2 py-2">XXXXXXXXXX</td>
                            <td className="border border-gray-300 px-2 py-2">XXXXXX</td>
                            <td className="border border-gray-300 px-2 py-2">XXXXXX</td>
                            <td className="border border-gray-300 px-2 py-2">XXXX</td>
                            <td className="border border-gray-300 px-2 py-2">XXXXXXXXXXXX</td>
                            <td className="border border-gray-300 px-2 py-2">XXX</td>
                            <td className="border border-gray-300 px-2 py-2">XXXXXXXXXXXX</td>
                            <td className="border border-gray-300 px-2 py-2">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => setShowModalEdit(true)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors">
                                        <Edit className="w-3 h-3" /> Edit
                                    </button>
                                    <button onClick={() => setShowModalHapus(true)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors">
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
            title={<><Plus className="w-5 h-5" /> Tambah Barang</>}
            size="max-w-2xl"
        >
            <div className="space-y-3">
                <FormBarangCompact />
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
            title={<><Edit className="w-5 h-5" /> Edit Barang</>}
            size="max-w-2xl"
        >
            <div className="space-y-3">
                <FormBarangCompact />
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
            title={<><Trash2 className="w-5 h-5" /> Hapus Barang</>}
            size="max-w-lg"
        >
            <p className="text-gray-700 font-medium py-4">Apakah anda ingin menghapus data barang ini?</p>
            <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-200 gap-3">
                <button onClick={() => setShowModalHapus(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded shadow transition-colors">
                    Batal
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow transition-colors">
                    Hapus
                </button>
            </div>
        </Modal>

    </DashboardLayout>
  );
};

const FormBarangCompact = () => (
    <>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang</label>
            <Input placeholder="Masukkan Nama Barang" className="py-2" />
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-simig-light bg-white">
                <option value="">-- Pilih Kategori --</option>
                <option value="kategori1">Kategori 1</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Warna</label>
            <Input placeholder="Masukkan Warna" className="py-2" />
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Berat(Kg)</label>
            <Input type="number" placeholder="Masukkan Berat, Contoh : 100" className="py-2" />
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Harga/Kg</label>
            <Input type="number" placeholder="Masukkan Harga, Contoh : 1000000" className="py-2" />
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah Stok</label>
            <Input type="number" placeholder="Masukkan Stok, Contoh : 1000" className="py-2" />
        </div>
    </>
);

export default DataBarang;