import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the navigation bar, fill out the registration form with your email, name, phone number, and password, then verify your email address.',
  },
  {
    category: 'Getting Started',
    question: 'Do I need to verify my email?',
    answer: 'Yes, email verification is required before you can log in and participate in giveaways. You will receive a 6-digit verification code via email after registration.',
  },
  {
    category: 'Giveaways',
    question: 'How do I enter a giveaway?',
    answer: 'Once logged in, click the "Enter Now" button on an active giveaway. If you are not logged in, you will be redirected to the login page first.',
  },
  {
    category: 'Giveaways',
    question: 'Can I enter a giveaway multiple times?',
    answer: 'This depends on the specific giveaway rules. Some giveaways allow multiple entries, while others limit you to one entry per person.',
  },
  {
    category: 'Giveaways',
    question: 'How will I know if I won?',
    answer: 'Winners are notified via email and can also see their winning status in their account under "My Giveaway Entries".',
  },
  {
    category: 'Giveaways',
    question: 'Who is responsible for prize fulfillment?',
    answer: 'The host organization running the giveaway is solely responsible for all prizes, including selection, procurement, delivery, and quality. Sweepgoat is not responsible for any prize-related issues. Contact the host directly for prize claims or delivery questions.',
  },
  {
    category: 'Account & Security',
    question: 'I forgot my password. What should I do?',
    answer: 'Click "Forgot Password" on the login page and follow the instructions to reset your password via email.',
  },
  {
    category: 'Account & Security',
    question: 'Can I change my email address?',
    answer: 'Currently, you cannot change your email address directly. Please contact support if you need to update your email.',
  },
  {
    category: 'Account & Security',
    question: 'How do I delete my account?',
    answer: 'You can delete your account from the Settings page. Note that this action is permanent and will remove all your data.',
  },
  {
    category: 'Privacy & Data',
    question: 'How is my personal information used?',
    answer: 'We use your information to process giveaway entries, send notifications, and improve our services. See our Privacy Policy for full details.',
  },
  {
    category: 'Privacy & Data',
    question: 'Is my data shared with third parties?',
    answer: 'We only share your information with the giveaway host organization and as required by law. We do not sell your personal information.',
  },
];

export function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Group FAQs by category
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32 pt-32">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-zinc-400 font-light leading-relaxed">
            Find answers to common questions about giveaways, accounts, and more.
          </p>
        </div>

        {/* FAQs by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
              {category}
            </h2>

            <div className="space-y-4">
              {faqs
                .filter(faq => faq.category === category)
                .map((faq, index) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={globalIndex}
                      className="border border-zinc-800 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
                      >
                        <span className="text-white font-light text-base">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-zinc-500 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="px-6 py-4 bg-zinc-900/30 border-t border-zinc-800">
                          <p className="text-zinc-400 font-light leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Still Need Help */}
        <div className="mt-16 pt-16 border-t border-zinc-900 text-center">
          <h3 className="text-xl font-light text-white mb-4">Still Need Help?</h3>
          <p className="text-zinc-400 font-light mb-6">
            Can't find what you're looking for? Get in touch with our support team.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-white text-black px-8 py-3 text-sm font-light rounded hover:bg-zinc-200 active:bg-zinc-300 transition-all duration-300 cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>

      <Footer onManagementLoginClick={() => navigate('/host/login')} />
    </div>
  );
}