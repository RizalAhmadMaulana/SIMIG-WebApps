import React, { useState } from 'react';
import AuthLayout from '../components/templates/AuthLayout';
import Input from '../components/atoms/Input';
import PasswordInput from '../components/molecules/PasswordInput';
import Button from '../components/atoms/Button';
import api from '../api'; // 👈 Import API
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        // Kirim request login ke Django
        const response = await api.post('/login/', {
            username: username,
            password: password
        });

        // Jika sukses, kita dapat 'access' dan 'refresh' token
        console.log("Login Berhasil:", response.data);

        // PENTING: Simpan Token ke LocalStorage browser
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Pindah ke Beranda
        navigate('/beranda');

    } catch (error) {
        console.error("Login Gagal:", error);
        alert("Username atau Password salah!");
    }
  };

  return (
    <AuthLayout 
      title="Login"
      footerText="Belum punya akun?"
      footerLinkText="Daftar Sekarang"
      footerLinkTo="/register"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
           <Input 
             placeholder="Nama Pengguna" 
             value={username}
             onChange={(e) => setUsername(e.target.value)}
           />
        </div>
        
        <PasswordInput 
             placeholder="Kata Sandi" 
             value={password}
             onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="mt-2">
            Login
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;