import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubdomainUrl } from '../utils/environment';

export function SuccessPage() {
  const navigate = useNavigate();
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [subdomainUrl, setSubdomainUrl] = useState<string>('');

  useEffect(() => {
    // Retrieve data from localStorage
    const storedSubdomain = localStorage.getItem('subdomain');
    const storedCompanyName = localStorage.getItem('companyName');

    // If no subdomain, redirect to login
    if (!storedSubdomain) {
      navigate('/login');
      return;
    }

    setSubdomain(storedSubdomain);
    setCompanyName(storedCompanyName);
    setSubdomainUrl(getSubdomainUrl(storedSubdomain));
  }, [navigate]);

  const handleGoToDashboard = () => {
    if (subdomainUrl) {
      window.location.href = subdomainUrl;
    }
  };

  if (!subdomain) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold text-white">Sweepgoat</span>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight tracking-tight">
            Welcome Back!
          </h1>
          {companyName && (
            <p className="text-xl text-white font-normal mb-2">
              {companyName}
            </p>
          )}
          <p className="text-base text-zinc-400 font-light leading-relaxed">
            Your giveaway platform is ready.
          </p>
        </div>

        {/* Subdomain URL Display */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <p className="text-xs text-zinc-500 font-light uppercase tracking-wider mb-2">
            Your Dashboard
          </p>
          <p className="text-sm text-zinc-300 font-light break-all">
            {subdomainUrl}
          </p>
        </div>

        {/* Go to Dashboard Button */}
        <button
          onClick={handleGoToDashboard}
          className="w-full bg-white text-black px-8 py-4 text-sm font-light rounded hover:bg-zinc-200 active:bg-zinc-300 transition-all duration-300 cursor-pointer"
        >
          Go to My Dashboard
        </button>

        {/* Logout Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              localStorage.removeItem('hostToken');
              localStorage.removeItem('subdomain');
              localStorage.removeItem('companyName');
              navigate('/login');
            }}
            className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors font-light"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}