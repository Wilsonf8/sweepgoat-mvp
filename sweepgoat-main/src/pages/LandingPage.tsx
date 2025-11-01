import React from 'react';
import { Navigation } from '../components/Navigation';
import { Section } from '../components/Section';
import { Button } from '../components/Button';

export const LandingPage: React.FC = () => {
  const handleSignUpClick = () => {
    // TODO: Navigate to /signup
    console.log('Navigate to signup');
  };

  const handleLoginClick = () => {
    // TODO: Navigate to /login
    console.log('Navigate to login');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation onSignUpClick={handleSignUpClick} onLoginClick={handleLoginClick} />

      {/* Hero Section */}
      <Section background="gradient" size="lg" className="pt-32 md:pt-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge/Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Your Complete Giveaway Platform
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Run Legal Giveaways
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Under Your Brand
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Launch white-labeled giveaway campaigns, manage your CRM, and grow your audience—all from one powerful platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="primary" size="lg" onClick={handleSignUpClick}>
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Hero Visual/Screenshot Placeholder */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden bg-gray-900 border border-gray-800">
            <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/20 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium text-gray-400">Dashboard Preview</p>
                <p className="text-sm">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* White Labeling Section */}
      <Section id="white-labeling" background="white" size="md">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Complete White Labeling
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Make it yours. Customize colors, add your logo, and run giveaways that match your brand perfectly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
              title: 'Custom Branding',
              description: 'Upload your logo and choose your brand colors. Every touchpoint reflects your identity.',
            },
            {
              icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
              title: 'Your Subdomain',
              description: 'Get your own branded subdomain like yourbrand.sweepgoat.com for a professional look.',
            },
            {
              icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
              title: 'Seamless Experience',
              description: 'Your users see only your brand—no Sweepgoat watermarks or logos anywhere.',
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
              <div className="text-gray-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CRM & Marketing Section */}
      <Section id="crm-marketing" background="gray" size="md">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built-In CRM & Marketing Tools
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage your audience, segment users, and run targeted email campaigns—all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: 'User Management',
              features: ['View all registered users', 'Filter by engagement', 'Export user data', 'Track last login'],
            },
            {
              title: 'Email Campaigns',
              features: ['Segment your audience', 'Send targeted emails', 'Track open rates', 'A/B testing'],
            },
          ].map((section, idx) => (
            <div key={idx} className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h3 className="text-2xl font-semibold text-white mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Giveaway Setup Section */}
      <Section id="giveaway-setup" background="white" size="md">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Set Up Giveaways in Minutes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Create, customize, and launch giveaways with an intuitive interface designed for speed.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-purple-950/50 rounded-2xl p-12 border border-gray-800">
          <div className="space-y-6">
            {[
              '1. Create your giveaway with title, description, and prize details',
              '2. Set start and end dates',
              '3. Configure entry mechanics (free entries, paid points, etc.)',
              '4. Launch and share with your audience',
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-lg text-gray-200 pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Get Started Section */}
      <Section id="get-started" background="gradient" size="md">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Launch Your First Giveaway?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join hundreds of brands using Sweepgoat to grow their audience and boost engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={handleSignUpClick}>
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </Section>

      {/* Legal Compliance Section */}
      <Section id="legal-compliance" background="white" size="md">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Legal & Compliant
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Run giveaways with confidence. We help you stay compliant with regulations.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
              label: 'GDPR Compliant'
            },
            {
              icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
              label: 'Terms & Conditions'
            },
            {
              icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
              label: 'Data Security'
            },
            {
              icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              label: 'Fair & Transparent'
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center p-6 rounded-xl border border-gray-800 bg-gray-900">
              <div className="text-gray-500 mb-3 flex justify-center">{item.icon}</div>
              <p className="font-semibold text-white">{item.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">Sweepgoat</span>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              The complete platform for running legal, branded giveaways.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-gray-500 mt-8">
              © 2025 Sweepgoat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};