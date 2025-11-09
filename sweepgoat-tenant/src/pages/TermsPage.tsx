import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32 pt-32">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            Last Updated: January 7, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-zinc-300 font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-white mb-4">Agreement to Terms</h2>
              <p>
                By accessing and using this platform, you agree to be bound by these Terms of Service.
                If you disagree with any part of these terms, you may not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Eligibility</h2>
              <p>
                You must be at least 18 years old to create an account and participate in giveaways.
                By using this service, you represent and warrant that you meet this age requirement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Account Responsibilities</h2>
              <p className="mb-4">When you create an account, you are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Providing accurate and truthful information</li>
                <li>Maintaining the security of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Giveaway Rules</h2>
              <p className="mb-4">When participating in giveaways:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may only create one account per person</li>
                <li>You must follow all giveaway-specific rules and restrictions</li>
                <li>Fraudulent entries or bot activity will result in disqualification</li>
                <li>Prize details and distribution are managed by the giveaway host</li>
                <li>We are not responsible for prize fulfillment or disputes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Prohibited Activities</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use automated systems or bots to enter giveaways</li>
                <li>Create multiple accounts</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with the platform's operation</li>
                <li>Attempt unauthorized access to any systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations
                of these Terms or fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                This platform is a service provided by Sweepgoat. <strong>The host organization is solely responsible
                for all giveaways, including:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Prize selection, procurement, and fulfillment</li>
                <li>Prize delivery and quality</li>
                <li>Giveaway rules and eligibility requirements</li>
                <li>Winner selection and notification</li>
                <li>Compliance with local, state, and federal laws regarding giveaways</li>
                <li>Handling disputes with participants</li>
              </ul>
              <p className="mb-4">
                <strong>Sweepgoat is not responsible for:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Any aspect of giveaway management or prize fulfillment</li>
                <li>Host compliance with applicable laws</li>
                <li>Disputes between hosts and participants</li>
                <li>Prize-related issues (lost, damaged, or undelivered prizes)</li>
              </ul>
              <p>
                The platform is provided "as is" without warranties. We are not liable for any indirect,
                incidental, or consequential damages arising from your use of the service or participation in giveaways.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Contact Us</h2>
              <p>
                Questions about these Terms? Please visit our{' '}
                <a href="/contact" className="text-white hover:text-zinc-300 underline">
                  contact page
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