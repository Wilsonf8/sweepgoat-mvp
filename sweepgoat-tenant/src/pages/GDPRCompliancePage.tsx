import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export function GDPRCompliancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32 pt-32">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            GDPR Compliance
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            General Data Protection Regulation Information
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-zinc-300 font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-white mb-4">Our Commitment to GDPR</h2>
              <p>
                We are committed to protecting your personal data in accordance with the General Data Protection
                Regulation (GDPR). This page outlines how we comply with GDPR requirements and your rights as a data subject.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Legal Basis for Processing</h2>
              <p className="mb-4">We process your personal data based on:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consent:</strong> When you register for giveaways and create an account</li>
                <li><strong>Contract:</strong> To provide services you've requested</li>
                <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Your GDPR Rights</h2>
              <p className="mb-4">Under GDPR, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Data We Collect</h2>
              <p className="mb-4">We collect and process the following personal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Account login information</li>
                <li>Giveaway entry data and participation history</li>
                <li>Device and usage information (IP address, browser type)</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Data Retention</h2>
              <p>
                We retain your personal data only as long as necessary to fulfill the purposes for which it
                was collected, comply with legal obligations, and resolve disputes. When you delete your account,
                we will delete or anonymize your personal data within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption,
                access controls, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Third-Party Data Sharing</h2>
              <p className="mb-4">We may share your personal data with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The giveaway host organization (with your consent)</li>
                <li>Service providers who assist in platform operations</li>
                <li>Law enforcement or regulatory authorities (when legally required)</li>
              </ul>
              <p className="mt-4">We do not sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">International Data Transfers</h2>
              <p>
                If your data is transferred outside the European Economic Area (EEA), we ensure appropriate
                safeguards are in place, such as standard contractual clauses approved by the European Commission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Exercising Your Rights</h2>
              <p>
                To exercise any of your GDPR rights, please contact us through our{' '}
                <a href="/contact" className="text-white hover:text-zinc-300 underline">
                  contact page
                </a>
                . We will respond to your request within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Complaints</h2>
              <p>
                If you believe we have not complied with GDPR, you have the right to lodge a complaint with
                your local data protection authority.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer onManagementLoginClick={() => navigate('/host/login')} />
    </div>
  );
}