import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import Modal from '../components/organisms/Modal';
import Input from '../components/atoms/Input';
import { Edit, Lock, Image, Trash2, Save, Upload, CheckCircle, XCircle } from 'lucide-react';
import api from '../api';

const SettingProfil = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ id: '', username: '', full_name: '', email: '', image_url: null });
  
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [showModalFoto, setShowModalFoto] = useState(false);

  // MODALS
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [message, setMessage] = useState('');

  const [editForm, setEditForm] = useState({ username: '', email: '', full_name: '' });
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("Tidak ada file yang dipilih");

  const fetchProfile = async () => {
      try { const response = await api.get('/users/profile/'); setUserData(response.data); setEditForm({ username: response.data.username, email: response.data.email || '', full_name: response.data.full_name || '' }); } catch (error) { console.error(error); } finally { setLoading(false); }
  };
  useEffect(() => { fetchProfile(); }, []);

  const triggerSuccess = (msg) => { setMessage(msg); setShowSuccessModal(true); setTimeout(() => setShowSuccessModal(false), 2000); };
  const triggerError = (msg) => { setMessage(msg); setShowErrorModal(true); };

  const handleUpdateProfil = async () => {
      try { await api.put('/users/profile/', editForm); triggerSuccess("Profil diperbarui!"); window.dispatchEvent(new Event('profile-updated')); fetchProfile(); setShowModalEdit(false); } catch (error) { triggerError("Gagal update profil."); }
  };

  const handleChangePassword = async () => {
      if (passForm.new_password !== passForm.confirm_password) { triggerError("Password tidak cocok!"); return; }
      try { await api.put('/users/profile/change-password/', passForm); triggerSuccess("Kata sandi diubah!"); setPassForm({ old_password: '', new_password: '', confirm_password: '' }); setShowModalPassword(false); } catch (error) { triggerError("Gagal ganti password."); }
  };

  const handleUploadFoto = async () => {
      if (!selectedFile) return;
      const formData = new FormData(); formData.append('image', selectedFile);
      try { const response = await api.put('/users/profile/upload-image/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); triggerSuccess("Foto diganti!"); window.dispatchEvent(new Event('profile-updated')); setUserData({ ...userData, image_url: response.data.image_url }); setShowModalFoto(false); setSelectedFile(null); } catch (error) { triggerError("Gagal upload."); }
  };

  const resetEditForm = () => setShowModalEdit(false);
  const handleFileChange = (e) => { if(e.target.files[0]) { setSelectedFile(e.target.files[0]); setFileName(e.target.files[0].name); } };

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
        {/* SUCCESS */}
        {showSuccessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="bg-black/80 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce"><CheckCircle className="w-5 h-5 text-green-400" /> {message}</div>
            </div>
        )}
        {/* ERROR */}
        {showErrorModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center"><XCircle className="w-10 h-10 text-red-500 mx-auto mb-2" /><p>{message}</p><button onClick={()=>setShowErrorModal(false)} className="mt-4 bg-red-500 text-white px-4 py-1 rounded">Tutup</button></div>
            </div>
        )}

        <h2 className="text-2xl font-bold text-black mb-6">Profil</h2>
        <div className="flex flex-wrap gap-4 mb-6">
            <button onClick={() => setShowModalEdit(true)} className="bg-[#1586FF] text-white py-2 px-4 rounded flex gap-2"><Edit className="w-4 h-4" /> Edit Profil</button>
            <button onClick={() => setShowModalPassword(true)} className="bg-green-500 text-white py-2 px-4 rounded flex gap-2"><Lock className="w-4 h-4" /> Ganti Kata Sandi</button>
            <button onClick={() => setShowModalFoto(true)} className="bg-yellow-400 text-white py-2 px-4 rounded flex gap-2"><Image className="w-4 h-4" /> Ganti Foto</button>
        </div>
        
        {/* ... Profile Card Code Here ... */}
        
        <Modal isOpen={showModalEdit} onClose={resetEditForm} title="Edit Profil">
             <div className="space-y-4">
                <Input value={editForm.username} onChange={(e)=>setEditForm({...editForm, username: e.target.value})} placeholder="Username" />
                <Input value={editForm.full_name} onChange={(e)=>setEditForm({...editForm, full_name: e.target.value})} placeholder="Nama Lengkap" />
                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={resetEditForm} className="bg-red-500 text-white px-4 py-2 rounded">Batal</button>
                    <button onClick={handleUpdateProfil} className="bg-blue-500 text-white px-4 py-2 rounded">Simpan</button>
                </div>
             </div>
        </Modal>
        
        {/* Add Password & Photo Modal with similar logic */}
        
    </DashboardLayout>
  );
};
export default SettingProfil;