import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { PreviousGiveawaysPage } from './pages/PreviousGiveawaysPage';
import { GiveawayDetailPage } from './pages/GiveawayDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { AccountPage } from './pages/AccountPage';
import { SettingsPage } from './pages/SettingsPage';
import { HostLoginPage } from './pages/HostLoginPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { HostGiveawaysPage } from './pages/HostGiveawaysPage';
import { HostCreateGiveawayPage } from './pages/HostCreateGiveawayPage';
import { HostGiveawayDetailPage } from './pages/HostGiveawayDetailPage';
import { HostCRMPage } from './pages/HostCRMPage';
import { HostCampaignsPage } from './pages/HostCampaignsPage';
import { HostCampaignDetailPage } from './pages/HostCampaignDetailPage';
import { HostSettingsPage } from './pages/HostSettingsPage';
import { SubdomainNotFoundPage } from './pages/SubdomainNotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { GDPRCompliancePage } from './pages/GDPRCompliancePage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { validateSubdomain } from './services/subdomainService';
import { getSubdomain } from './utils/subdomain';
import { BrandingProvider } from './context/BrandingContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isValidating, setIsValidating] = useState(true);
  const [isValidSubdomain, setIsValidSubdomain] = useState(true);
  const [brandingData, setBrandingData] = useState({
    companyName: '',
    primaryColor: '#FFFFFF',
    subdomain: ''
  });

  useEffect(() => {
    const checkSubdomain = async () => {
      const subdomain = getSubdomain();
      console.log('Detected subdomain:', subdomain);

      // Skip validation for localhost (no subdomain) or if we're in development
      if (!subdomain || subdomain === 'localhost') {
        console.log('Skipping validation for localhost');
        setBrandingData({
          companyName: 'Demo Company',
          primaryColor: '#FFFFFF',
          subdomain: subdomain || 'demo'
        });
        setIsValidating(false);
        return;
      }

      try {
        console.log('Validating subdomain...');
        const result = await validateSubdomain();
        console.log('Validation result:', result);

        if (result.exists) {
          setIsValidSubdomain(true);
          setBrandingData({
            companyName: result.companyName || '',
            primaryColor: result.branding?.primaryColor || '#FFFFFF',
            subdomain: result.subdomain || subdomain
          });
        } else {
          console.log('Subdomain does not exist');
          setIsValidSubdomain(false);
        }
      } catch (error) {
        console.error('Error validating subdomain:', error);
        setIsValidSubdomain(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkSubdomain();
  }, []);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui'
      }}>
        Loading...
      </div>
    );
  }

  // Show 404 page if subdomain is invalid
  if (!isValidSubdomain) {
    return <SubdomainNotFoundPage />;
  }

  // Normal app routing with BrandingProvider and AuthProvider
  return (
    <BrandingProvider
      companyName={brandingData.companyName}
      primaryColor={brandingData.primaryColor}
      subdomain={brandingData.subdomain}
    >
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/previous-giveaways" element={<PreviousGiveawaysPage />} />
          <Route path="/giveaways/:id" element={<GiveawayDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/gdpr" element={<GDPRCompliancePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/host/login" element={<HostLoginPage />} />
          <Route path="/host/dashboard" element={<HostDashboardPage />} />
          <Route path="/host/giveaways" element={<HostGiveawaysPage />} />
          <Route path="/host/giveaways/new" element={<HostCreateGiveawayPage />} />
          <Route path="/host/giveaways/:id" element={<HostGiveawayDetailPage />} />
          <Route path="/host/crm" element={<HostCRMPage />} />
          <Route path="/host/campaigns" element={<HostCampaignsPage />} />
          <Route path="/host/campaigns/:id" element={<HostCampaignDetailPage />} />
          <Route path="/host/settings" element={<HostSettingsPage />} />
        </Routes>
      </AuthProvider>
    </BrandingProvider>
  );
}

export default App
