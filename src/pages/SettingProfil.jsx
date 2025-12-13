import React, { useState } from 'react';
import DashboardLayout from '../components/templates/DashboardLayout';
import Modal from '../components/organisms/Modal';
import Input from '../components/atoms/Input';
import { Edit, Lock, Image, Trash2, Save, Upload } from 'lucide-react';

const SettingProfil = () => {
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [showModalFoto, setShowModalFoto] = useState(false);

  const [fileName, setFileName] = useState("Tidak ada file yang dipilih");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold text-black mb-6">Profil</h2>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-200">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner">
                    <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Khozin&backgroundColor=b6e3f4" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2 flex flex-col justify-center">
                <div className="space-y-6">
                    <ProfileRow label="ID Profil" value="1" />
                    <ProfileRow label="Nama Pengguna" value="Khozin" />
                    <ProfileRow label="Nama Lengkap" value="Khozin Maulana Rahman" />
                </div>
            </div>

        </div>

        <Modal 
            isOpen={showModalEdit} 
            onClose={() => setShowModalEdit(false)} 
            title={<><Edit className="w-5 h-5" /> Edit Profil</>}
            size="max-w-2xl"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Pengguna</label>
                    <Input placeholder="contoh : khozin" className="py-2" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                    <Input placeholder="contoh : Khozin Maulana Rahman" className="py-2" />
                </div>
            </div>
            <ModalFooter />
        </Modal>

        <Modal 
            isOpen={showModalPassword} 
            onClose={() => setShowModalPassword(false)} 
            title={<><Lock className="w-5 h-5" /> Ganti Kata Sandi</>}
            size="max-w-2xl"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Kata Sandi Baru</label>
                    <Input type="password" placeholder="Kata Sandi Baru" className="py-2" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
                    <Input type="password" placeholder="Ulangi Kata Sandi" className="py-2" />
                </div>
            </div>
            <ModalFooter />
        </Modal>

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
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                        <span className="ml-3 text-sm text-gray-500 italic">{fileName}</span>
                    </div>
                </div>
            </div>
            <ModalFooter />
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

const ModalFooter = () => (
    <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-3">
        <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
            <Trash2 className="w-4 h-4" /> Reset
        </button>
        <button className="bg-simig-light hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Simpan
        </button>
    </div>
);

export default SettingProfil;