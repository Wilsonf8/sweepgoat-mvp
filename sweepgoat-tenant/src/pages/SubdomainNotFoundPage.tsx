import { getSubdomain } from '../utils/subdomain';

export function SubdomainNotFoundPage() {
  const subdomain = getSubdomain();

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'system-ui',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '100px auto'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Site Not Found</h2>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
        The subdomain <strong>"{subdomain}"</strong> doesn't exist or hasn't been set up yet.
      </p>
      <p style={{ fontSize: '14px', color: '#999' }}>
        Please check the URL and try again.
      </p>
    </div>
  );
}