import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LayoutDashboard, FileText, User, PlusCircle, Users, BarChart, Briefcase, Menu, X, Sparkles } from 'lucide-react';

const DashboardLayout = ({ role }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getLinks = () => {
    switch (role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Profile', path: '/student/profile', icon: User },
          { name: 'My Applications', path: '/student/applications', icon: FileText },
          { name: 'AI Tools', path: '/student/ai', icon: Sparkles },
        ];
      case 'company':
        return [
          { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
          { name: 'Post Job', path: '/company/post-job', icon: PlusCircle },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart },
          { name: 'Students', path: '/admin/students', icon: Users },
          { name: 'Companies', path: '/admin/companies', icon: Briefcase },
          { name: 'Jobs', path: '/admin/jobs', icon: FileText },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fadeIn"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-lightNavy border-r border-gray-800 p-4 
          transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0 pt-20 md:pt-4' : '-translate-x-full'}
        `}>
          {/* Mobile Close Button */}
          <button 
            className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          <nav className="space-y-2 mt-8 md:mt-4">
            {getLinks().map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-accentBlue text-white shadow-md shadow-accentBlue/20' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-accentBlue transition-colors'}`} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full animate-fadeIn">
          {/* Mobile Toggle Bar */}
          <div className="md:hidden mb-6 flex items-center bg-lightNavy p-3 rounded-xl border border-gray-800">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 bg-darkNavy rounded-lg text-gray-300 hover:text-white transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="ml-3 font-heading font-semibold text-gray-200">Dashboard Menu</span>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
