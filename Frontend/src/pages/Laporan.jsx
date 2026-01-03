import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import api from '../api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Laporan = () => {
  const [periode, setPeriode] = useState('bulanan');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/reports/?period=${periode}`);
        setData(response.data);
      } catch (error) {
        console.error("Gagal ambil laporan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [periode]);

  const formatRp = (val) => "Rp " + new Intl.NumberFormat("id-ID").format(val);

  // --- CONFIG DATA CHARTS ---
  const pieData = {
    labels: data?.pie_chart?.labels || [],
    datasets: [{
        data: data?.pie_chart?.data || [],
        backgroundColor: ['#F87171', '#22C55E', '#FACC15', '#3B82F6', '#9CA3AF', '#8B5CF6'],
        borderWidth: 1,
    }],
  };

  const barData = {
    labels: data?.bar_chart?.labels || [], 
    datasets: [{
        label: 'Barang Keluar (Kg)',
        data: data?.bar_chart?.data || [],
        backgroundColor: '#5B9BD5',
        borderRadius: 4,
    }],
  };

  // --- 1. OPTIONS KHUSUS PIE CHART (Legend Disembunyikan) ---
  const pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false // 👈 INI KUNCINYA: Menyembunyikan tulisan di samping/bawah chart
        },
        tooltip: {
            enabled: true // Tooltip tetap aktif saat di-hover
        }
    }
  };

  // --- 2. OPTIONS KHUSUS BAR CHART (Legend Tetap Ada di Bawah) ---
  const barChartOptions = {
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
    },
    scales: {
        y: { beginAtZero: true }
    }
  };

  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-black mb-6">Laporan</h2>

        {/* PILIH PERIODE */}
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
                    <option value="mingguan">Mingguan (7 Hari Terakhir)</option>
                    <option value="bulanan">Bulanan (4 Minggu)</option>
                    <option value="tahunan">Tahunan (12 Bulan)</option>
                </select>
            </div>
        </div>

        {/* DIAGRAM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* PIE CHART */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="bg-simig-red text-white font-bold py-2 px-4">
                    Diagram Penjualan Barang
                </div>
                <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
                    {loading ? <p className="text-gray-400 italic">Memuat data...</p> : (
                        data?.pie_chart?.data.length > 0 ? 
                        <div className="w-full h-64 relative">
                             {/* Gunakan pieChartOptions yang baru */}
                             <Pie data={pieData} options={pieChartOptions} />
                        </div> : 
                        <p className="text-gray-400 italic">Belum ada data penjualan.</p>
                    )}
                </div>
            </div>

            {/* BAR CHART */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="bg-simig-green text-white font-bold py-2 px-4">
                    Diagram Penjualan Total
                </div>
                <div className="p-6 flex-1 flex flex-col justify-end min-h-[300px]">
                    {loading ? <p className="text-gray-400 italic text-center">Memuat data...</p> : (
                        <div className="w-full h-64 relative">
                            {/* Gunakan barChartOptions */}
                            <Bar data={barData} options={barChartOptions} />
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* LAPORAN AKHIR */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="bg-simig-yellow text-white font-bold py-3 px-6 text-lg">
                Laporan Akhir ({loading ? "..." : data?.summary?.date_info})
            </div>
            <div className="p-6 space-y-4">
                <SummaryRow label="Total Barang Masuk" value={loading ? "..." : `${data?.summary?.total_in} Kg`} />
                <SummaryRow label="Total Barang Keluar" value={loading ? "..." : `${data?.summary?.total_out} Kg`} />
                <SummaryRow label="Total Pendapatan" value={loading ? "..." : formatRp(data?.summary?.revenue)} />
                <SummaryRow label="Perubahan Nilai Aset" value={loading ? "..." : formatRp(data?.summary?.asset_change)} noBorder />
            </div>
        </div>
    </DashboardLayout>
  );
};

const SummaryRow = ({ label, value, noBorder }) => (
    <div className={`flex flex-col sm:flex-row pb-2 ${!noBorder && 'border-b border-gray-100'}`}>
        <span className="w-64 font-medium text-gray-800">{label}</span>
        <span className="hidden sm:block mr-4">:</span>
        <span className="text-gray-600 font-bold">{value}</span>
    </div>
);

export default Laporan;