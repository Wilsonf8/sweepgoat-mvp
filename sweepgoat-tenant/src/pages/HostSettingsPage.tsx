import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useBranding } from '../context/BrandingContext';
import api from '../services/api';

interface BrandingSettings {
  companyName: string;
  primaryColor: string;
  logoUrl: string | null;
}

export function HostSettingsPage() {
  const { companyName: currentCompanyName, primaryColor: currentPrimaryColor } = useBranding();

  const [companyName, setCompanyName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch current branding settings
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const response = await api.get('/api/host/branding');
        const data = response.data;

        setPrimaryColor(data.primaryColor || '#FFFFFF');
        // Use company name from context (loaded on app init)
        setCompanyName(currentCompanyName || '');
      } catch (error) {
        console.error('Error fetching branding:', error);
        setErrorMessage('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranding();
  }, [currentCompanyName]);

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Update branding
      await api.patch('/api/host/branding', {
        companyName: companyName.trim(),
        primaryColor: primaryColor,
      });

      setSuccessMessage('Settings saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // Optionally reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reset to defaults
  const handleReset = () => {
    setPrimaryColor('#FFFFFF');
    setCompanyName(currentCompanyName || '');
    setSuccessMessage('');
    setErrorMessage('');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-zinc-500 font-light">Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">Settings</h1>
          <p className="text-zinc-500 font-light">Customize your branding and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg">
            <p className="text-green-400 text-sm font-light">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm font-light">{errorMessage}</p>
          </div>
        )}

        {/* Branding Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-light text-white mb-6">Branding</h2>

          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-light text-zinc-400 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white font-light placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                placeholder="Enter company name"
              />
              <p className="text-xs text-zinc-500 font-light mt-2">
                This will be displayed in your public site and dashboard
              </p>
            </div>

            {/* Primary Color */}
            <div>
              <label className="block text-sm font-light text-zinc-400 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-4">
                {/* Color Picker */}
                <div className="relative">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-12 rounded cursor-pointer border-2 border-zinc-800"
                  />
                </div>

                {/* Hex Input */}
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only update if it's a valid hex color format
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                      setPrimaryColor(value);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-black border border-zinc-800 rounded text-white font-light font-mono uppercase focus:outline-none focus:border-zinc-600"
                  placeholder="#FFFFFF"
                  maxLength={7}
                />
              </div>

              {/* Color Preview */}
              <div className="mt-4 p-4 bg-black border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 font-light mb-3">Preview:</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    style={{ backgroundColor: primaryColor }}
                    className="px-6 py-3 rounded font-light text-black transition-opacity hover:opacity-80"
                  >
                    Primary Button
                  </button>
                  <a
                    style={{ color: primaryColor }}
                    className="font-light underline cursor-pointer"
                  >
                    Link Example
                  </a>
                </div>
              </div>

              <p className="text-xs text-zinc-500 font-light mt-2">
                Default: <span className="font-mono">#FFFFFF</span> (white)
              </p>
            </div>

            {/* Logo - Coming Soon */}
            <div className="opacity-50 pointer-events-none">
              <label className="block text-sm font-light text-zinc-400 mb-2">
                Logo
              </label>
              <div className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center">
                <p className="text-zinc-500 font-light mb-2">Logo upload coming soon</p>
                <p className="text-xs text-zinc-600 font-light">
                  Recommended: 500x500px, PNG or JPG, max 2MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !companyName.trim()}
            className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded transition-colors font-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleReset}
            disabled={isSaving}
            className="px-6 py-3 bg-zinc-800 text-white hover:bg-zinc-700 rounded transition-colors font-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>

        {/* Password Change Section - Coming Soon */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6 opacity-50">
          <h2 className="text-xl font-light text-white mb-6">Security</h2>
          <p className="text-zinc-500 font-light mb-4">Password change coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  );
}