import React from 'react';
import { 
  X,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { roleConfig } from '../../../utils/roleConfig';

const Sidebar = ({ isOpen, onClose, role = 'student' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = roleConfig[role]?.menuItems || roleConfig.student.menuItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold shadow-md shadow-green-200">
              NG
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-gray-900">
                    NeoGen
                </span>
            </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 py-6 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => clsx(
                "flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-5 bg-green-600 rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <Icon 
                    size={18} 
                    className={clsx(
                      "mr-3 transition-colors duration-200", 
                      isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
                    )} 
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut size={18} className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={clsx(
          "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 transform md:relative md:translate-x-0 md:inset-auto md:shadow-none md:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
