import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { Slideshow } from '../components/Slideshow';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation onSignUpClick={handleSignUpClick} onLoginClick={handleLoginClick} />

      {/* Hero Section */}
      <Section background="gradient" size="lg" className="pt-32 md:pt-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge/Tag */}
          <div className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-zinc-500 mb-8">
            Your Complete Giveaway Platform
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight tracking-tight">
            Run Legal Giveaways
            <br />
            <span className="font-normal">Under Your Brand</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-xs text-zinc-500 font-light">
            <span>No credit card required</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span>Setup in 5 minutes</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Hero Visual - Dashboard Preview Slideshow */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
            <Slideshow
              images={[
                'https://via.placeholder.com/1280x720/1a1a1a/666666?text=Dashboard+Preview+1',
                'https://via.placeholder.com/1280x720/1a1a1a/666666?text=Dashboard+Preview+2',
                'https://via.placeholder.com/1280x720/1a1a1a/666666?text=Dashboard+Preview+3',
              ]}
              interval={5000}
            />
          </div>
        </div>
      </Section>

      {/* White Labeling Section */}
      <Section id="white-labeling" background="white" size="md">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
            Complete White Labeling
          </h2>
          <p className="text-base text-zinc-500 max-w-xl mx-auto font-light">
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
              title: 'Your Sweepgoat Domain',
              description: 'Get your own branded Sweepgoat domain for a professional look.',
            },
            {
              icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
              title: 'Seamless Experience',
              description: 'Your users see only your brand—no Sweepgoat watermarks or logos anywhere.',
            },
          ].map((feature, idx) => (
            <div key={idx} className="p-8 border-l border-zinc-800">
              <div className="text-zinc-600 mb-6">{feature.icon}</div>
              <h3 className="text-lg font-normal text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CRM & Marketing Section */}
      <Section id="crm-marketing" background="gray" size="md">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
            Built-In CRM & Marketing Tools
          </h2>
          <p className="text-base text-zinc-500 max-w-xl mx-auto font-light">
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
            <div key={idx} className="p-10 border border-zinc-800">
              <h3 className="text-xl font-normal text-white mb-8">{section.title}</h3>
              <ul className="space-y-4">
                {section.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-start gap-3">
                    <span className="text-zinc-700 mt-1">—</span>
                    <span className="text-sm text-zinc-400 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Giveaway Setup Section */}
      <Section id="giveaway-setup" background="white" size="md">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
            Set Up Giveaways in Minutes
          </h2>
          <p className="text-base text-zinc-500 max-w-xl mx-auto font-light">
            Create, customize, and launch giveaways with an intuitive interface designed for speed.
          </p>
        </div>

        <div className="max-w-2xl mx-auto border-l border-zinc-800 pl-12">
          <div className="space-y-10">
            {[
              'Create your giveaway with title, description, and prize details',
              'Set start and end dates',
              'Configure entry mechanics (free entries, paid points, etc.)',
              'Launch and share with your audience',
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-6">
                <div className="text-zinc-700 text-sm font-light flex-shrink-0 w-8">
                  0{idx + 1}
                </div>
                <p className="text-sm text-zinc-400 font-light pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Get Started Section */}
      <Section id="get-started" background="gradient" size="md">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">
            Ready to Launch Your First Giveaway?
          </h2>
          <p className="text-base text-zinc-500 mb-12 font-light">
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
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
            Legal & Compliant
          </h2>
          <p className="text-base text-zinc-500 max-w-xl mx-auto font-light">
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
            <div key={idx} className="text-center p-8">
              <div className="text-zinc-700 mb-4 flex justify-center">{item.icon}</div>
              <p className="text-xs font-light text-zinc-500 uppercase tracking-wider">{item.label}</p>
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