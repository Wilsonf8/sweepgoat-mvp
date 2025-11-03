import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { HostLoginPage } from './pages/HostLoginPage';
import { SubdomainNotFoundPage } from './pages/SubdomainNotFoundPage';
import { validateSubdomain } from './services/subdomainService';
import { getSubdomain } from './utils/subdomain';

function App() {
  const [isValidating, setIsValidating] = useState(true);
  const [isValidSubdomain, setIsValidSubdomain] = useState(true);

  useEffect(() => {
    const checkSubdomain = async () => {
      const subdomain = getSubdomain();
      console.log('Detected subdomain:', subdomain);

      // Skip validation for localhost (no subdomain) or if we're in development
      if (!subdomain || subdomain === 'localhost') {
        console.log('Skipping validation for localhost');
        setIsValidating(false);
        return;
      }

      try {
        console.log('Validating subdomain...');
        const result = await validateSubdomain();
        console.log('Validation result:', result);

        if (result.exists) {
          setIsValidSubdomain(true);
          // Optionally store branding info for later use
          if (result.branding) {
            sessionStorage.setItem('branding', JSON.stringify(result.branding));
            sessionStorage.setItem('companyName', result.companyName || '');
          }
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

  // Normal app routing
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/host/login" element={<HostLoginPage />} />
    </Routes>
  );
}

export default App
