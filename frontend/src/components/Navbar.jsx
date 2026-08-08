import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, UserCircle, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="bg-darkNavy/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group" aria-label="JobYtra Home">
              <img src="/logo.jpeg" alt="JobYtra Logo" className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105 rounded-md" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className="text-gray-300 hover:text-white font-medium transition-colors duration-200">Jobs</Link>
            {!user ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors duration-200 whitespace-nowrap">Login</Link>
                <Link to="/register" className="btn-primary whitespace-nowrap inline-block">Sign Up</Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4 border-l border-gray-700 pl-4">
                <span className="text-xs font-semibold text-accentBlue uppercase tracking-wider bg-accentBlue/10 px-2.5 py-1 rounded-full">
                  {user.role?.replace('ROLE_', '')}
                </span>
                <Link to={`/${user.role?.replace('ROLE_', '').toLowerCase()}/dashboard`} className="text-gray-300 hover:text-accentBlue transition-colors duration-200">
                  <UserCircle className="h-6 w-6" />
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors duration-200" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-lightNavy border-b border-gray-800 animate-slideUp origin-top">
          <div className="px-4 pt-2 pb-6 space-y-3">
            <Link 
              to="/jobs" 
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Jobs
            </Link>
            {!user ? (
              <div className="mt-4 flex flex-col space-y-3 px-3">
                <Link to="/login" className="btn-secondary block w-full text-center py-2.5" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary block w-full text-center py-2.5" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </div>
            ) : (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between px-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{user.name || 'User'}</span>
                    <span className="text-xs font-medium text-accentBlue uppercase">{user.role?.replace('ROLE_', '')}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Link 
                    to={`/${user.role?.replace('ROLE_', '').toLowerCase()}/dashboard`}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCircle className="h-5 w-5 mr-3" /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg"
                  >
                    <LogOut className="h-5 w-5 mr-3" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
