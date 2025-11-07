import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Gift, Users, Mail, Settings, LogOut, Menu, X } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyName } = useBranding();

  const handleLogout = () => {
    localStorage.removeItem('hostToken');
    localStorage.removeItem('userType');
    navigate('/');
  };

  const navItems = [
    { path: '/host/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/host/giveaways', label: 'Giveaways', icon: Gift },
    { path: '/host/crm', label: 'CRM', icon: Users },
    { path: '/host/campaigns', label: 'Campaigns', icon: Mail },
    { path: '/host/settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-black border-r border-zinc-900 flex flex-col z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Header */}
      <div className="p-6 border-b border-zinc-900">
        <Link to="/host/dashboard">
          <h1 className="text-xl font-light text-white">
            {companyName || 'Dashboard'}
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-1">Management Portal</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded transition-colors
                    ${isActive
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm font-light">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-900">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded transition-colors text-zinc-500 hover:text-white hover:bg-zinc-900/50 w-full"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm font-light">Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}