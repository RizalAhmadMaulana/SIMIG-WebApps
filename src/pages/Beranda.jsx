import React from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import StatCard from '../components/molecules/StatCard';

const Beranda = () => {
  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Beranda</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Aset Gudang" value="Rp. xxx.xxx.xxx" colorClass="bg-[#1586FF]" />
            <StatCard title="Pendapatan Bulan Ini" value="Rp. xxx.xxx.xxx" colorClass="bg-[#22C55E]" />
            <StatCard title="Total Stok Barang" value="xxx Kg" colorClass="bg-[#FACC15]" />
            <StatCard title="Stok Menipis" value="x Item" colorClass="bg-[#EF4444]" />
        </div>

        <div className="bg-white rounded shadow-sm mb-8 border-t-4 border-[#1586FF]">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-black">Barang masuk bulan ini</h3>
            </div>
            <div className="overflow-x-auto p-5">
                <table className="w-full text-sm text-center border-collapse border border-gray-300">
                    <thead className="bg-white text-black font-bold">
                        <tr>
                            <th className="border border-gray-300 px-4 py-3">Nama Barang</th>
                            <th className="border border-gray-300 px-4 py-3">Kategori</th>
                            <th className="border border-gray-300 px-4 py-3">Warna</th>
                            <th className="border border-gray-300 px-4 py-3">Berat(Kg)</th>
                            <th className="border border-gray-300 px-4 py-3">Harga/Kg</th>
                            <th className="border border-gray-300 px-4 py-3">Stok</th>
                            <th className="border border-gray-300 px-4 py-3">Total Nilai(Rp)</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        <tr>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div className="bg-white rounded shadow-sm mb-8 border-t-4 border-[#1586FF]">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-black">Barang keluar bulan ini</h3>
            </div>
            <div className="overflow-x-auto p-5">
                <table className="w-full text-sm text-center border-collapse border border-gray-300">
                    <thead className="bg-white text-black font-bold">
                        <tr>
                            <th className="border border-gray-300 px-4 py-3">Nama Barang</th>
                            <th className="border border-gray-300 px-4 py-3">Kategori</th>
                            <th className="border border-gray-300 px-4 py-3">Warna</th>
                            <th className="border border-gray-300 px-4 py-3">Berat(Kg)</th>
                            <th className="border border-gray-300 px-4 py-3">Harga/Kg</th>
                            <th className="border border-gray-300 px-4 py-3">Stok</th>
                            <th className="border border-gray-300 px-4 py-3">Total Nilai(Rp)</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        <tr>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                            <td className="border border-gray-300 h-10"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </DashboardLayout>
  );
};

export default Beranda;