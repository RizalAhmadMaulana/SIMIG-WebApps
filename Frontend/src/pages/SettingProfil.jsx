import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import Modal from '../components/organisms/Modal';
import Input from '../components/atoms/Input';
import { Edit, Lock, Image, Trash2, Save, Upload } from 'lucide-react';
import api from '../api';

const SettingProfil = () => {
  // --- STATE DATA ---
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
      id: '',
      username: '',
      full_name: '', // 👈 Pakai full_name
      email: '',
      image_url: null
  });

  // --- STATE MODAL ---
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [showModalFoto, setShowModalFoto] = useState(false);

  // --- STATE FORM ---
  // Form Edit sekarang pakai full_name
  const [editForm, setEditForm] = useState({ username: '', email: '', full_name: '' });
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  
  // State File Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("Tidak ada file yang dipilih");

  // --- 1. GET DATA PROFIL ---
  const fetchProfile = async () => {
      try {
          const response = await api.get('/profile/'); 
          setUserData(response.data);
          
          // Isi form edit
          setEditForm({
              username: response.data.username,
              email: response.data.email || '',
              full_name: response.data.full_name || '' // 👈 Load full_name
          });
      } catch (error) {
          console.error("Gagal ambil profil:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchProfile();
  }, []);

  // --- 2. UPDATE INFO PROFIL ---
  const handleUpdateProfil = async () => {
      try {
          await api.put('/profile/', editForm);
          alert("Profil berhasil diperbarui!");
          window.dispatchEvent(new Event('profile-updated'));
          fetchProfile(); 
          setShowModalEdit(false);
          localStorage.setItem('username', editForm.username); 
      } catch (error) {
          console.error("Gagal update:", error);
          alert("Gagal update profil.");
      }
  };

  // --- 3. GANTI PASSWORD ---
  const handleChangePassword = async () => {
      if (passForm.new_password !== passForm.confirm_password) {
          alert("Konfirmasi kata sandi tidak cocok!");
          return;
      }
      try {
          await api.put('/profile/change-password/', passForm);
          alert("Kata sandi berhasil diubah!");
          setPassForm({ old_password: '', new_password: '', confirm_password: '' });
          setShowModalPassword(false);
      } catch (error) {
          console.error("Gagal ganti password:", error.response);
          const msg = error.response?.data?.old_password?.[0] || "Gagal mengganti kata sandi.";
          alert(msg);
      }
  };

  // --- 4. GANTI FOTO ---
  const handleFileChange = (e) => {
      if (e.target.files.length > 0) {
          const file = e.target.files[0];
          setSelectedFile(file);
          setFileName(file.name);
      }
  };

  const handleUploadFoto = async () => {
      if (!selectedFile) {
          alert("Pilih file gambar dulu!");
          return;
      }
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
          const response = await api.put('/profile/upload-image/', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          alert("Foto profil berhasil diubah!");
          window.dispatchEvent(new Event('profile-updated'));
          setUserData({ ...userData, image_url: response.data.image_url });
          setShowModalFoto(false);
          setSelectedFile(null);
          setFileName("Tidak ada file yang dipilih");
      } catch (error) {
          console.error("Gagal upload:", error);
          alert("Gagal mengupload foto.");
      }
  };

  // Helper Reset Form
  const resetEditForm = () => {
      setEditForm({
          username: userData.username,
          email: userData.email || '',
          full_name: userData.full_name || ''
      });
      setShowModalEdit(false);
  };

  const resetPassForm = () => {
      setPassForm({ old_password: '', new_password: '', confirm_password: '' });
      setShowModalPassword(false);
  };

  if (loading) return (
      <DashboardLayout>
          <div className="p-8 flex justify-center items-center h-64">
              <div className="text-gray-500 font-medium">Memuat data profil...</div>
          </div>
      </DashboardLayout>
  );

  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-black mb-6">Profil</h2>

        {/* --- TOMBOL AKSI --- */}
        <div className="flex flex-wrap gap-4 mb-6">
            <button 
                onClick={() => setShowModalEdit(true)}
                className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
            >
                <Edit className="w-4 h-4" /> Edit Profil
            </button>
            <button 
                onClick={() => setShowModalPassword(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
            >
                <Lock className="w-4 h-4" /> Ganti Kata Sandi
            </button>
            <button 
                onClick={() => setShowModalFoto(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
            >
                <Image className="w-4 h-4" /> Ganti Foto
            </button>
        </div>

        {/* --- KONTEN DATA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* FOTO PROFIL */}
            <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-200">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner">
                    <img 
                        src={userData.image_url || "https://ui-avatars.com/api/?name=" + userData.username} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* DETAIL DATA */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2 flex flex-col justify-center">
                <div className="space-y-6">
                    <ProfileRow label="ID Profil" value={`#${userData.id}`} />
                    <ProfileRow label="Nama Pengguna" value={userData.username} />
                    {/* Tampilkan Full Name */}
                    <ProfileRow label="Nama Lengkap" value={userData.full_name || '-'} />
                    <ProfileRow label="Email" value={userData.email || '-'} />
                </div>
            </div>
        </div>

        {/* --- MODAL EDIT (Full Name & Email) --- */}
        <Modal 
            isOpen={showModalEdit} 
            onClose={resetEditForm} 
            title={<><Edit className="w-5 h-5" /> Edit Profil</>}
            size="max-w-2xl"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nama Pengguna</label>
                        <Input 
                            value={editForm.username} 
                            onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                            className="py-2" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <Input 
                            type="email"
                            value={editForm.email} 
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="py-2" 
                            placeholder="contoh@email.com"
                        />
                    </div>
                </div>
                
                {/* INPUT NAMA LENGKAP (SATU KOLOM FULL) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                    <Input 
                        value={editForm.full_name} 
                        onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                        className="py-2" 
                        placeholder="Masukkan nama lengkap"
                    />
                </div>
            </div>
            <ModalFooter onReset={resetEditForm} onSave={handleUpdateProfil} />
        </Modal>

        {/* --- MODAL PASSWORD --- */}
        <Modal 
            isOpen={showModalPassword} 
            onClose={resetPassForm} 
            title={<><Lock className="w-5 h-5" /> Ganti Kata Sandi</>}
            size="max-w-2xl"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Kata Sandi Lama</label>
                    <Input 
                        type="password"
                        value={passForm.old_password}
                        onChange={(e) => setPassForm({...passForm, old_password: e.target.value})}
                        placeholder="Masukkan kata sandi lama"
                        className="py-2" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Kata Sandi Baru</label>
                    <Input 
                        type="password"
                        value={passForm.new_password}
                        onChange={(e) => setPassForm({...passForm, new_password: e.target.value})}
                        className="py-2" 
                        placeholder="Buat kata sandi baru"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
                    <Input 
                        type="password"
                        value={passForm.confirm_password}
                        onChange={(e) => setPassForm({...passForm, confirm_password: e.target.value})}
                        className="py-2" 
                        placeholder="Konfirmasi kata sandi baru"
                    />
                </div>
            </div>
            <ModalFooter onReset={resetPassForm} onSave={handleChangePassword} />
        </Modal>

        {/* --- MODAL FOTO --- */}
        <Modal 
            isOpen={showModalFoto} 
            onClose={() => setShowModalFoto(false)} 
            title={<><Image className="w-5 h-5" /> Ganti Foto</>}
            size="max-w-2xl"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Foto Baru</label>
                    <div className="flex items-center">
                        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded border border-gray-300 shadow-sm transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Pilih File
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <span className="ml-3 text-sm text-gray-500 italic truncate max-w-xs">{fileName}</span>
                    </div>
                </div>
            </div>
            <ModalFooter onReset={() => setShowModalFoto(false)} onSave={handleUploadFoto} />
        </Modal>

    </DashboardLayout>
  );
};

const ProfileRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-4 last:border-0 last:pb-0">
        <span className="w-48 font-semibold text-gray-800">{label}</span>
        <span className="hidden sm:block mr-4">:</span>
        <span className="text-gray-600 font-medium">{value}</span>
    </div>
);

const ModalFooter = ({ onReset, onSave }) => (
    <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
        <button onClick={onReset} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
            <Trash2 className="w-4 h-4" /> Batal
        </button>
        <button onClick={onSave} className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Simpan
        </button>
    </div>
);

export default SettingProfil;