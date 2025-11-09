export function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32">
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
                By accessing and using Sweepgoat ("Service"), you agree to be bound by these Terms of Service
                ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Use License</h2>
              <p>
                Permission is granted to temporarily access and use the Service for personal or commercial purposes.
                This license does not include the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose without prior written consent</li>
                <li>Attempt to decompile or reverse engineer any software contained in the Service</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Account Responsibilities</h2>
              <p className="mb-4">When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the security of your account and password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your use complies with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Prohibited Activities</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the Service for any illegal purpose or to violate any laws</li>
                <li>Transmit any viruses, malware, or other malicious code</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Engage in any automated use of the system without our express written permission</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by Sweepgoat and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual
                property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                Sweepgoat provides a platform for hosts to run giveaways. We are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Giveaways created and managed by hosts</li>
                <li>Prize fulfillment, delivery, or quality</li>
                <li>Disputes between hosts and participants</li>
                <li>Actions or omissions of hosts using our platform</li>
                <li>Compliance with local laws regarding giveaways (host's responsibility)</li>
              </ul>
              <p>
                In no event shall Sweepgoat, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use
                the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@sweepgoat.com" className="text-white hover:text-zinc-300 underline">
                  legal@sweepgoat.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}