import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    console.log('Support form submitted:', formData);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-2xl py-20 md:py-32 pt-32">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Contact Support
          </h1>
          <p className="text-base text-zinc-400 font-light leading-relaxed">
            Need help? We're here to assist you.
          </p>
        </div>

        {submitted ? (
          /* Success Message */
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-light text-white mb-2">Message Sent!</h2>
            <p className="text-zinc-400 font-light">
              We'll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-light text-zinc-400 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white font-light focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-zinc-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white font-light focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-light text-zinc-400 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white font-light focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-light text-zinc-400 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white font-light focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                placeholder="Describe your issue or question..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black px-8 py-4 text-sm font-light rounded hover:bg-zinc-200 active:bg-zinc-300 transition-all duration-300 cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}

        {/* Response Time Info */}
        <div className="mt-16 pt-16 border-t border-zinc-900 text-center">
          <p className="text-zinc-400 font-light text-sm">
            <span className="text-zinc-500">Expected Response Time:</span> Within 24 hours
          </p>
        </div>
      </div>

      <Footer onManagementLoginClick={() => navigate('/host/login')} />
    </div>
  );
}