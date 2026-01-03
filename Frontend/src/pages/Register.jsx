import React, { useState } from 'react';
import AuthLayout from '../components/templates/AuthLayout';
import Input from '../components/atoms/Input';
import PasswordInput from '../components/molecules/PasswordInput';
import Button from '../components/atoms/Button';
import api from '../api'; // 👈 Import API yang tadi dibuat
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  // State untuk menyimpan input user
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
        // Kirim data ke Backend Django
        const response = await api.post('/register/', {
            username: username,
            password: password,
            full_name: fullName
        });

        console.log("Register Berhasil:", response.data);
        alert("Registrasi Berhasil! Silakan Login.");
        
        // Pindahkan ke halaman Login
        navigate('/'); 

    } catch (error) {
        console.error("Register Gagal:", error.response);
        // Tampilkan pesan error dari Django jika ada (misal: username sudah terpakai)
        alert("Registrasi Gagal: " + (error.response?.data?.username || "Terjadi kesalahan"));
    }
  };

  return (
    <AuthLayout 
      title="Register"
      footerText="Sudah punya akun?"
      footerLinkText="Login Sekarang"
      footerLinkTo="/"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
           {/* Hubungkan Input dengan State */}
           <Input 
             placeholder="Nama Lengkap" 
             value={fullName}
             onChange={(e) => setFullName(e.target.value)}
           />
        </div>
        <div>
           <Input 
             placeholder="Nama Pengguna (Username)" 
             value={username}
             onChange={(e) => setUsername(e.target.value)}
           />
        </div>
        
        <PasswordInput 
            placeholder="Kata Sandi" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button type="submit" className="mt-4">
            Daftar
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;