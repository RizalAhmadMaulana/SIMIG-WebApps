import React, { useState } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';

const Laporan = () => {
  const [periode, setPeriode] = useState('Bulanan');

  const getPeriodeLabel = () => {
    switch(periode) {
        case 'Mingguan': return '1 Januari 2025 s/d 7 Januari 2025';
        case 'Bulanan': return '1 Januari 2025 s/d 31 Januari 2025';
        case 'Tahunan': return '1 Januari 2025 s/d 31 Desember 2025';
        default: return '';
    }
  };

  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-black mb-6">Laporan</h2>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="bg-simig-light text-white font-bold py-3 px-6 text-center text-lg">
                Pilih Periode Laporan
            </div>
            <div className="p-6">
                <select 
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 text-gray-600 focus:outline-none focus:border-simig-light focus:ring-1 focus:ring-simig-light transition bg-white"
                >
                    <option value="Bulanan">Bulanan</option>
                    <option value="Tahunan">Tahunan</option>
                    <option value="Mingguan">Mingguan</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="bg-simig-red text-white font-bold py-2 px-4">
                    Diagram Penjualan Barang
                </div>
                <div className="p-6 flex-1 flex flex-col items-center justify-center relative">
                    <div className="flex flex-wrap gap-3 mb-4 text-xs font-bold text-gray-600 justify-center">
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 inline-block rounded-sm"></span> LDPE</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 inline-block rounded-sm"></span> HDPE</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 inline-block rounded-sm"></span> PET</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 inline-block rounded-sm"></span> PE</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-400 inline-block rounded-sm"></span> PP</div>
                    </div>
                    
                    <div className="relative w-48 h-48">
                        <div 
                            className="w-full h-full rounded-full"
                            style={{
                                background: `conic-gradient(
                                    #F87171 0% 15%,   
                                    #22C55E 15% 45%,  
                                    #FACC15 45% 65%,  
                                    #3B82F6 65% 90%,  
                                    #9CA3AF 90% 100%
                                )`
                            }}
                        ></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="bg-simig-green text-white font-bold py-2 px-4">
                    Diagram Penjualan Total
                </div>
                <div className="p-6 flex-1 flex flex-col justify-end">
                    <div className="flex justify-around items-end h-48 gap-2 px-2 border-b border-gray-300 pb-1">
                        <div className="w-full bg-[#5B9BD5] h-[40%] rounded-t-sm hover:opacity-80 transition relative group">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition">2000</span>
                        </div>
                        <div className="w-full bg-[#5B9BD5] h-[55%] rounded-t-sm hover:opacity-80 transition relative group">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition">2800</span>
                        </div>
                        <div className="w-full bg-[#5B9BD5] h-[80%] rounded-t-sm hover:opacity-80 transition relative group">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition">4000</span>
                        </div>
                        <div className="w-full bg-[#5B9BD5] h-[65%] rounded-t-sm hover:opacity-80 transition relative group">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition">3200</span>
                        </div>
                    </div>
                    <div className="flex justify-around text-[10px] text-gray-500 font-bold mt-2 text-center">
                        <span className="w-full">Minggu 1</span>
                        <span className="w-full">Minggu 2</span>
                        <span className="w-full">Minggu 3</span>
                        <span className="w-full">Minggu 4</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="bg-simig-yellow text-white font-bold py-3 px-6 text-lg">
                Laporan Akhir ({getPeriodeLabel()})
            </div>
            <div className="p-6 space-y-4">
                <SummaryRow label="Total Barang Masuk" value="xxx Kg" />
                <SummaryRow label="Total Barang Keluar" value="xxx Kg" />
                <SummaryRow label="Total Pendapatan" value="Rp. xxx.xxx.xxx" />
                <SummaryRow label="Perubahan Nilai Aset" value="Rp. xxx.xxx.xxx" noBorder />
            </div>
        </div>

    </DashboardLayout>
  );
};

const SummaryRow = ({ label, value, noBorder }) => (
    <div className={`flex flex-col sm:flex-row pb-2 ${!noBorder && 'border-b border-gray-100'}`}>
        <span className="w-64 font-medium text-gray-800">{label}</span>
        <span className="hidden sm:block mr-4">:</span>
        <span className="text-gray-600">{value}</span>
    </div>
);

export default Laporan;