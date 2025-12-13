import React from 'react';
import { Menu, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
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
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Khozin&background=random&color=fff&background=0D5099" alt="User" />
                </div>
                <span className="text-white font-medium text-sm hidden md:block">Khozin</span>
            </div>
        </div>
    </header>
  );
};

export default Header;