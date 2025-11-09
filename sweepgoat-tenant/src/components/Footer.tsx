import { Link } from 'react-router-dom';

interface FooterProps {
  onManagementLoginClick?: () => void;
}

export function Footer({ onManagementLoginClick }: FooterProps) {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-20 md:mt-32 py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">

        {/* Three-Column Links */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Navigation Column */}
          <div>
            <h4 className="text-sm font-light text-white mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-3 text-xs text-zinc-500 font-light">
              <li>
                <Link to="/previous-giveaways" className="hover:text-white transition-colors">
                  Previous Giveaways
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-light text-white mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3 text-xs text-zinc-500 font-light">
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/gdpr" className="hover:text-white transition-colors">
                  GDPR Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-sm font-light text-white mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3 text-xs text-zinc-500 font-light">
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/docs" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-900 pt-8 mb-6 text-center">
          <p className="text-xs text-zinc-600">© 2025 Sweepgoat. All rights reserved.</p>
        </div>

        {/* Management Login Button (Bottom Center, Subtle) */}
        {onManagementLoginClick && (
          <div className="text-center">
            <button
              onClick={onManagementLoginClick}
              className="text-xs font-light text-zinc-700 hover:text-zinc-400 transition-colors uppercase tracking-wider"
            >
              Management Login
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}