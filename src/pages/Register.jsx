import React from 'react';
import AuthLayout from '../components/templates/AuthLayout';
import Input from '../components/atoms/Input';
import PasswordInput from '../components/molecules/PasswordInput';
import Button from '../components/atoms/Button';

const Register = () => {
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register clicked");
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
           <Input placeholder="Nama Pengguna" />
        </div>
        
        <PasswordInput placeholder="Kata Sandi" />
        

        <Button type="submit" className="mt-4">
            Daftar
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;