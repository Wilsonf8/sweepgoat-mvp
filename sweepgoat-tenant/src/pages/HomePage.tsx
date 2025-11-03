import { getSubdomain } from '../utils/subdomain';

export function HomePage() {
  const subdomain = getSubdomain();

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>Subdomain Test Page</h1>
      <p>Current subdomain: <strong>{subdomain}</strong></p>
      <p>Hostname: <code>{window.location.hostname}</code></p>
      <p>Full URL: <code>{window.location.href}</code></p>
    </div>
  );
}