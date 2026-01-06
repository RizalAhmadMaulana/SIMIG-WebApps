import React, { useState, useEffect } from 'react';
import { Menu, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api'; 

const Header = ({ toggleSidebar }) => {
  // --- STATE USER ---
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || 'Pengguna', 
    image_url: null
  });

  // --- GET DATA USER TERBARU ---
  const fetchUser = async () => {
    try {
      // PERBAIKAN: Tambahkan prefix '/users/' agar sesuai backend
      const response = await api.get('/users/profile/');
      
      setUser({
        username: response.data.username,
        image_url: response.data.image_url
      });
    } catch (error) {
      console.error("Gagal memuat info user di header", error);
    }
  };

  useEffect(() => {
    fetchUser();

    // Listener custom agar header update otomatis tanpa refresh halaman (Opsional)
    const handleProfileUpdate = () => fetchUser();
    window.addEventListener('profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  return (
    <header className="h-16 bg-[#1586FF] flex items-center justify-between px-6 shadow-md z-10 flex-shrink-0">
        <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-white hover:bg-blue-600 p-2 rounded focus:outline-none transition-colors">
                <Menu className="w-6 h-6" />
            </button>
        </div>
        
        <div className="flex items-center space-x-4">
            <Link to="/profil" className="text-white hover:text-blue-200 transition-colors">
                <Settings className="w-6 h-6" />
            </Link>
            
            <div className="flex items-center space-x-3 border-l border-blue-400 pl-4">
                {/* --- FOTO PROFIL DINAMIS --- */}
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                    <img 
                        // Gunakan UI Avatars sebagai cadangan jika image_url null
                        src={user.image_url || `https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* --- NAMA USER DINAMIS --- */}
                <span className="text-white font-medium text-sm hidden md:block">
                    {user.username}
                </span>
            </div>
        </div>
    </header>
  );
};

export default Header;