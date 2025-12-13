import React from 'react';
import AuthLayout from '../components/templates/AuthLayout';
import Input from '../components/atoms/Input';
import PasswordInput from '../components/molecules/PasswordInput';
import Button from '../components/atoms/Button';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login clicked");
    navigate('/beranda'); 
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
           <Input placeholder="Nama Pengguna" />
        </div>
        
        <PasswordInput placeholder="Kata Sandi" />

        <Button type="submit" className="mt-2">
            Login
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;