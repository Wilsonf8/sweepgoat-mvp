import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export function DocumentationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32 pt-32">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Documentation
          </h1>
          <p className="text-base text-zinc-400 font-light leading-relaxed">
            Learn how to use the platform and participate in giveaways.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Getting Started */}
          <section>
            <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
              Getting Started
            </h2>
            <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
              <div>
                <h3 className="text-lg font-normal text-white mb-2">1. Create an Account</h3>
                <p>
                  Click "Sign Up" in the navigation bar and fill out the registration form with your email,
                  name, phone number, and password. You'll receive a 6-digit verification code via email.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-white mb-2">2. Verify Your Email</h3>
                <p>
                  Check your email for the verification code and enter it on the verification page. Email
                  verification is required before you can log in.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-white mb-2">3. Log In</h3>
                <p>
                  Once verified, use your email and password to log in to your account.
                </p>
              </div>
            </div>
          </section>

          {/* Entering Giveaways */}
          <section>
            <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
              Entering Giveaways
            </h2>
            <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
              <div>
                <h3 className="text-lg font-normal text-white mb-2">Finding Active Giveaways</h3>
                <p>
                  The home page displays the currently active giveaway with a countdown timer showing when it ends.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-white mb-2">How to Enter</h3>
                <p className="mb-2">To enter a giveaway:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Make sure you're logged in</li>
                  <li>Click the "Enter Now" button on the giveaway page</li>
                  <li>Your entry will be submitted immediately</li>
                  <li>The button will change to "You are entered!" once confirmed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-normal text-white mb-2">Entry Rules</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>One account per person</li>
                  <li>Follow all giveaway-specific rules</li>
                  <li>No automated or bot entries</li>
                  <li>Fraudulent activity will result in disqualification</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section>
            <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
              Account Management
            </h2>
            <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
              <div>
                <h3 className="text-lg font-normal text-white mb-2">My Account Page</h3>
                <p>
                  View your profile information and see all giveaways you've entered. Shows which giveaways
                  are active, which have ended, and if you've won any prizes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-white mb-2">Previous Giveaways</h3>
                <p>
                  Browse past giveaways, see winners, and view results. Filter by status and navigate through
                  paginated results (5 giveaways per page).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-white mb-2">Settings</h3>
                <p>
                  Change your password and manage account settings. You can also delete your account if needed
                  (this action is permanent).
                </p>
              </div>
            </div>
          </section>

          {/* Winning & Prizes */}
          <section>
            <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
              Winning & Prizes
            </h2>
            <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
              <div>
                <h3 className="text-lg font-normal text-white mb-2">How Winners Are Selected</h3>
                <p>
                  Winners are selected by the giveaway host according to the specific rules of each giveaway.
                  Selection methods may vary (random draw, most entries, etc.).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-white mb-2">Winner Notification</h3>
                <p>
                  If you win, you'll be notified via email and your account will show "WON" status in your
                  giveaway history.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-white mb-2">Prize Fulfillment</h3>
                <p>
                  Prizes are provided and fulfilled by the giveaway host organization, not by this platform.
                  Contact the host directly regarding prize claims and delivery.
                </p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
              Need More Help?
            </h2>
            <div className="space-y-4 text-zinc-300 font-light leading-relaxed">
              <p>
                Can't find what you're looking for? Check out our{' '}
                <a href="/faq" className="text-white hover:text-zinc-300 underline">
                  FAQ page
                </a>
                {' '}or{' '}
                <a href="/contact" className="text-white hover:text-zinc-300 underline">
                  contact support
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer onManagementLoginClick={() => navigate('/host/login')} />
    </div>
  );
}