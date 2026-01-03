import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Beranda from './pages/Beranda';
import DataBarang from './pages/DataBarang';
import BarangMasuk from './pages/BarangMasuk';
import BarangKeluar from './pages/BarangKeluar';
import KelolaKategori from './pages/KelolaKategori';
import Laporan from './pages/Laporan';
import SettingProfil from './pages/SettingProfil';
import ProtectedRoute from './components/templates/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Public (Bisa diakses siapa saja) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rute Private (Harus Login Dulu) */}
        <Route element={<ProtectedRoute />}>
            <Route path="/beranda" element={<Beranda />} />
            <Route path="/data-barang" element={<DataBarang />} />
            <Route path="/barang-masuk" element={<BarangMasuk />} />
            <Route path="/barang-keluar" element={<BarangKeluar />} />
            <Route path="/kategori" element={<KelolaKategori />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/profil" element={<SettingProfil />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;