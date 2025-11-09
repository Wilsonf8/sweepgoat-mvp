export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32">
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
                Sweepgoat ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website
                and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Information We Collect</h2>
              <p className="mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Business information (company name, subdomain)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communications with us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@sweepgoat.com" className="text-white hover:text-zinc-300 underline">
                  privacy@sweepgoat.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}