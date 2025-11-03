import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import api from '../services/api';

interface Giveaway {
  id: number;
  title: string;
  endDate: string;
  status: string;
}

export function HostDashboardPage() {
  const navigate = useNavigate();
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [entriesCount, setEntriesCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch active giveaway
  useEffect(() => {
    const fetchActiveGiveaway = async () => {
      try {
        const response = await api.get('/api/host/giveaways/active');
        if (response.data) {
          setGiveaway(response.data);
        }
      } catch (error) {
        console.error('Error fetching active giveaway:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveGiveaway();
  }, []);

  // Fetch entries count for active giveaway
  useEffect(() => {
    const fetchEntriesCount = async () => {
      if (!giveaway) return;

      try {
        const response = await api.get(`/api/host/giveaways/${giveaway.id}/stats`);
        setEntriesCount(response.data.totalEntries || 0);
      } catch (error) {
        console.error('Error fetching entries count:', error);
      }
    };

    fetchEntriesCount();
  }, [giveaway]);

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-zinc-500 font-light">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">Dashboard</h1>
          <p className="text-zinc-500 font-light">Overview of your current giveaway</p>
        </div>

        {/* Active Giveaway Card */}
        {giveaway ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
            <h2 className="text-2xl font-light text-white mb-6">{giveaway.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Total Entries */}
              <div>
                <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                  Total Entries
                </p>
                <p className="text-4xl font-light text-white">{entriesCount}</p>
              </div>

              {/* Time Remaining */}
              <div>
                <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                  Time Remaining
                </p>
                <p className="text-4xl font-light text-white">{timeLeft}</p>
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-8">
              <button
                onClick={() => navigate(`/host/giveaways/${giveaway.id}`)}
                className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light"
              >
                View Details
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
            <h2 className="text-2xl font-light text-white mb-4">No Active Giveaway</h2>
            <p className="text-zinc-500 font-light mb-8">
              Create a new giveaway to get started
            </p>
            <button
              onClick={() => navigate('/host/giveaways/new')}
              className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light"
            >
              Create Giveaway
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}