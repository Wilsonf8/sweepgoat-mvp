import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { useBranding } from '../context/BrandingContext';
import api from '../services/api';

interface Giveaway {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: string;
}

export function HomePage() {
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const navigate = useNavigate();
  const { primaryColor } = useBranding();

  const isLoggedIn = !!localStorage.getItem('userToken');

  // Fetch active giveaway
  useEffect(() => {
    const fetchGiveaway = async () => {
      try {
        const response = await api.get('/api/public/giveaways', {
          params: { status: 'ACTIVE', size: 1 }
        });

        if (response.data.data && response.data.data.length > 0) {
          setGiveaway(response.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching giveaway:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGiveaway();
  }, []);

  // Check if user has entered (if logged in)
  useEffect(() => {
    const checkEntry = async () => {
      if (!isLoggedIn || !giveaway) return;

      try {
        const response = await api.get('/api/user/my-entries');
        const entered = response.data.some((entry: any) => entry.giveawayId === giveaway.id);
        setHasEntered(entered);
      } catch (error) {
        console.error('Error checking entry:', error);
      }
    };

    checkEntry();
  }, [giveaway, isLoggedIn]);

  // Countdown timer
  useEffect(() => {
    if (!giveaway) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(giveaway.endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [giveaway]);

  // Handle enter button click
  const handleEnter = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (hasEntered) return;

    try {
      await api.post(`/api/user/giveaways/${giveaway?.id}/enter/free`);
      setHasEntered(true);
    } catch (error) {
      console.error('Error entering giveaway:', error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-black flex items-center justify-center pt-16">
          <p className="text-zinc-500 font-light">Loading...</p>
        </div>
      </>
    );
  }

  // Empty state - no active giveaway
  if (!giveaway) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-black pt-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-32 md:py-40">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight mb-8">
                No Active Giveaway
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-12">
                Check back soon for exciting giveaways!
              </p>
              <button
                onClick={() => navigate('/previous-giveaways')}
                className="bg-white text-black hover:bg-zinc-200 px-8 py-4 text-sm font-light rounded transition-all duration-300 cursor-pointer"
              >
                View Previous Giveaways
              </button>
            </div>

            {/* Management Button - Footer */}
            <div className="border-t border-zinc-900 mt-20 md:mt-32 pt-8">
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/host/login')}
                  className="text-xs font-light text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-wider"
                >
                  Management Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Active giveaway display
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-black pt-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-8 md:py-20 lg:py-32">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Giveaway Image */}
            <div className="order-1 md:order-1">
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  src={giveaway.imageUrl.replace(/\/(public|banner|thumbnail)$/, '/width=800,height=450,fit=cover')}
                  srcSet={`
                    ${giveaway.imageUrl.replace(/\/(public|banner|thumbnail)$/, '/width=600,height=337,fit=cover')} 600w,
                    ${giveaway.imageUrl.replace(/\/(public|banner|thumbnail)$/, '/width=800,height=450,fit=cover')} 800w,
                    ${giveaway.imageUrl.replace(/\/(public|banner|thumbnail)$/, '/width=1200,height=675,fit=cover')} 1200w
                  `}
                  sizes="(max-width: 768px) 600px, (max-width: 1024px) 800px, 1200px"
                  alt={giveaway.title}
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
            </div>

            {/* Right: Giveaway Info */}
            <div className="order-2 md:order-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-tight tracking-tight mb-6 md:mb-8">
                {giveaway.title}
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-zinc-400 font-light leading-relaxed mb-6 md:mb-8">
                {giveaway.description}
              </p>

              {/* Countdown Timer */}
              <div className="mb-8 md:mb-12">
                <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                  Time Remaining
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white">
                  {timeLeft}
                </p>
              </div>

              {/* Enter Button */}
              {hasEntered ? (
                <button
                  disabled
                  className="w-full md:w-auto px-8 py-4 text-sm font-light rounded transition-all duration-300 cursor-not-allowed bg-zinc-800 text-zinc-500 min-h-[48px]"
                  style={{
                    backgroundColor: primaryColor !== '#FFFFFF' ? primaryColor : undefined,
                    color: primaryColor !== '#FFFFFF' ? '#000000' : undefined,
                    opacity: 0.6
                  }}
                >
                  You are entered!
                </button>
              ) : (
                <button
                  onClick={handleEnter}
                  className="w-full md:w-auto px-8 py-4 text-sm font-light rounded transition-all duration-300 cursor-pointer bg-white text-black hover:bg-zinc-200 active:bg-zinc-300 min-h-[48px]"
                  style={{
                    backgroundColor: primaryColor !== '#FFFFFF' ? primaryColor : '#FFFFFF',
                    color: '#000000'
                  }}
                >
                  {isLoggedIn ? 'Enter Now' : 'Login to Enter'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Management Button - Footer */}
        <div className="border-t border-zinc-900 mt-20 md:mt-32 pt-8">
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/host/login')}
              className="text-xs font-light text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-wider"
            >
              Management Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}