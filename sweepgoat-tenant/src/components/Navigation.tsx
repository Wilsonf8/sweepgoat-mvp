import { useState } from 'react';
import { useBranding } from '../context/BrandingContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const { companyName } = useBranding();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Left: Company Name */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-lg font-light text-white">
              {companyName || 'Loading...'}
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/previous-giveaways"
              className="text-xs font-light text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
            >
              Previous Giveaways
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/account"
                  className="text-xs font-light text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Account
                </Link>
                <Link
                  to="/settings"
                  className="text-xs font-light text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-light text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/signup"
                  className="text-xs font-light text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="text-xs font-light text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Mobile Menu - Slides down when open */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-900 py-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/previous-giveaways"
                onClick={closeMenu}
                className="text-sm font-light text-zinc-400 hover:text-white transition-colors uppercase tracking-wider py-2"
              >
                Previous Giveaways
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="text-sm font-light text-zinc-400 hover:text-white transition-colors uppercase tracking-wider py-2"
                  >
                    Account
                  </Link>
                  <Link
                    to="/settings"
                    onClick={closeMenu}
                    className="text-sm font-light text-zinc-400 hover:text-white transition-colors uppercase tracking-wider py-2"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-light text-zinc-400 hover:text-white transition-colors uppercase tracking-wider py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="text-sm font-light text-zinc-400 hover:text-white transition-colors uppercase tracking-wider py-2"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-sm font-light text-zinc-400 hover:text-white transition-colors uppercase tracking-wider py-2"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}