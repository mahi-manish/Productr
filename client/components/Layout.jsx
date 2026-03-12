import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Search, Home, ShoppingBag, Menu, X } from 'lucide-react';
import logo from '../assets/named-logo.png'; // Make sure this path is correct

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;
  const isProducts = currentPath === '/products';
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Mobile Header (Only visible on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1a1d27] text-white z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <img src={logo} alt="Productr" className="h-7 object-contain ml-2" />
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1d27] text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 flex flex-col h-full">
          {/* Internal Mobile Close Button */}
          <div className="flex items-center justify-between mb-2 md:block">
            <img src={logo} alt="Productr" className="h-8 object-contain md:mb-2" />
            <button className="md:hidden p-1 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative mb-6 pb-6 border-b border-[#2a2f3f] mx-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 mt-[-12px]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#2c3140] text-sm text-white placeholder-gray-400 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-gray-500 border border-[#3b4154]"
            />
          </div>

          <nav className="flex-1 space-y-1.5 mt-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${!isProducts ? 'bg-[#3b82f6]/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
            >
              <Home className={`w-5 h-5 ${!isProducts ? 'text-[#3b82f6]' : ''}`} />
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${isProducts ? 'bg-[#3b82f6]/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
            >
              <ShoppingBag className={`w-5 h-5 ${isProducts ? 'text-[#3b82f6]' : ''}`} />
              Products
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/90 border-b border-gray-100 flex-none z-30">
          <div className="flex justify-between h-[68px] items-center px-4 sm:px-8 bg-gradient-to-r from-[#ffe4e6]/30 via-[#fef3c7]/20 to-[#e0e7ff]/30">
            <div className="flex items-center gap-3">
              {/* Dynamic Page Title */}
              <div className="flex items-center gap-2 text-gray-700">
                {isProducts ? (
                  <>
                    <ShoppingBag className="w-5 h-5 text-gray-500" />
                    <span className="text-[16px] font-semibold">Products</span>
                  </>
                ) : (
                  <>
                    <Home className="w-5 h-5 text-gray-500" />
                    <span className="text-[16px] font-semibold">Home</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <div 
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-white/50 p-1.5 rounded-lg transition-colors"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.fullName} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                      <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || user?.phoneNumber}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
