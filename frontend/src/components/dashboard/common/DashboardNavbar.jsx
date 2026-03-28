import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Settings, ChevronDown, Search } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardNavbar = ({ onMenuClick, user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getSectionTitle = () => {
      const path = location.pathname;
      if (path.endsWith('/dashboard') || path.endsWith('/dashboard/')) return 'Dashboard';
      if (path.includes('profile')) return 'My Profile';
      if (path.includes('ats-resume')) return 'ATS Resume Scanner';
      if (path.includes('applications')) return 'My Applications';
      if (path.includes('recommendations')) return 'Recommended Jobs';
      if (path.includes('analytics')) return 'Analytics & Insights';
      if (path.includes('settings')) return 'Settings';
      return 'Dashboard';
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex justify-between items-center h-full max-w-7xl mx-auto w-full">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={onMenuClick}
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex flex-col">
                <h1 className="text-xl font-bold text-gray-900">{getSectionTitle()}</h1>
            </div>
            
            <span className="md:hidden font-bold text-lg text-gray-900">NeoGen</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search Bar (Optional) */}
            <div className="hidden lg:flex items-center relative mr-2">
                <Search size={18} className="absolute left-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-64"
                />
            </div>

            <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="relative">
              <button 
                className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img 
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100" 
                  src={user?.profilePicture || "https://ui-avatars.com/api/?name=" + (user?.name || 'User') + "&background=random"} 
                  alt={user?.name} 
                />
                <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-700 leading-none">{user?.name?.split(' ')[0]}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                    <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100"
                    >
                        <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                            <Link 
                                to="/dashboard/profile"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                            >
                                <User size={16} className="mr-3" /> Profile
                            </Link>
                            <Link 
                                to="/dashboard/settings"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                            >
                                <Settings size={16} className="mr-3" /> Settings
                            </Link>
                        </div>
                        <div className="py-1 border-t border-gray-50">
                            <button 
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} className="mr-3" /> Sign out
                            </button>
                        </div>
                    </motion.div>
                    </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
    </header>
  );
};

export default DashboardNavbar;
