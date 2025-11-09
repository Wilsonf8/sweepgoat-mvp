import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32 pt-32">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            Last Updated: January 7, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-zinc-300 font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-white mb-4">Introduction</h2>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                you participate in giveaways and use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Information We Collect</h2>
              <p className="mb-4">When you register or enter a giveaway, we collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Entry data for giveaways</li>
                <li>Communications with us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process your giveaway entries</li>
                <li>Notify you of giveaway results</li>
                <li>Send important account and service updates</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with the host
                organization running the giveaway you entered, and as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Object to data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="/contact" className="text-white hover:text-zinc-300 underline">
                  our contact page
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer onManagementLoginClick={() => navigate('/host/login')} />
    </div>
  );
}