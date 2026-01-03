import React, { useState, useEffect } from 'react';
import { Menu, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api'; // 👈 Pastikan path import api benar (sesuaikan ../ nya)

const Header = ({ toggleSidebar }) => {
  // --- STATE USER ---
  const [user, setUser] = useState({
    username: 'Pengguna', // Default sementara loading
    image_url: null
  });

  // --- GET DATA USER ---
  const fetchUser = async () => {
    try {
      const response = await api.get('/profile/');
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

    // Opsional: Listener agar kalau profil diedit, header ikut berubah tanpa refresh
    // Kita manfaatkan event listener window (simple way)
    const handleProfileUpdate = () => fetchUser();
    window.addEventListener('profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  return (
    <header className="h-16 bg-simig-light flex items-center justify-between px-6 shadow-md z-10 flex-shrink-0">
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
                        src={user.image_url || `https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff&background=0D5099`} 
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