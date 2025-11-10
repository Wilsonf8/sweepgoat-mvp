import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import api from '../services/api';

interface GiveawayDetail {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'ENDED' | 'CANCELLED' | 'COMPLETED';
  totalEntries: number;
  createdAt: string;
}

export function GiveawayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [giveaway, setGiveaway] = useState<GiveawayDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGiveawayDetails();
  }, [id]);

  const fetchGiveawayDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/public/giveaways/${id}`);
      setGiveaway(response.data);
    } catch (err: any) {
      console.error('Failed to fetch giveaway details:', err);
      setError('Failed to load giveaway details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-block px-4 py-2 text-sm font-light uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 rounded">
            Active
          </span>
        );
      case 'ENDED':
        return (
          <span className="inline-block px-4 py-2 text-sm font-light uppercase tracking-wider bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 rounded">
            Ended
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-block px-4 py-2 text-sm font-light uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-block px-4 py-2 text-sm font-light uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <p className="text-zinc-400 font-light text-center py-20">Loading...</p>
        </div>
        <Footer onManagementLoginClick={() => navigate('/host/login')} />
      </div>
    );
  }

  if (error || !giveaway) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="text-center py-20">
            <h2 className="text-2xl font-light text-white mb-4">
              Giveaway Not Found
            </h2>
            <p className="text-zinc-400 font-light mb-8">
              {error || 'The giveaway you are looking for does not exist.'}
            </p>
            <button
              onClick={() => navigate('/previous-giveaways')}
              className="text-white hover:text-zinc-300 underline font-light"
            >
              Back to Previous Giveaways
            </button>
          </div>
        </div>
        <Footer onManagementLoginClick={() => navigate('/host/login')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32 pt-32">
        {/* Back Button */}
        <button
          onClick={() => navigate('/previous-giveaways')}
          className="text-zinc-400 hover:text-white transition-colors mb-8 font-light flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to Previous Giveaways</span>
        </button>

        {/* Giveaway Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
              {giveaway.title}
            </h1>
            {getStatusBadge(giveaway.status)}
          </div>
        </div>

        {/* Giveaway Image */}
        <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden mb-8">
          <img
            src={giveaway.imageUrl}
            alt={giveaway.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-white mb-4 border-b border-zinc-800 pb-4">
            Description
          </h2>
          <p className="text-base text-zinc-300 font-light leading-relaxed whitespace-pre-wrap">
            {giveaway.description}
          </p>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
            Giveaway Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
              <p className="text-sm text-zinc-500 font-light uppercase tracking-wider mb-2">
                Start Date
              </p>
              <p className="text-lg text-white font-light">
                {formatDate(giveaway.startDate)}
              </p>
            </div>

            {/* End Date */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
              <p className="text-sm text-zinc-500 font-light uppercase tracking-wider mb-2">
                End Date
              </p>
              <p className="text-lg text-white font-light">
                {formatDate(giveaway.endDate)}
              </p>
            </div>

            {/* Total Entries */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
              <p className="text-sm text-zinc-500 font-light uppercase tracking-wider mb-2">
                Total Entries
              </p>
              <p className="text-lg text-white font-light">
                {giveaway.totalEntries} {giveaway.totalEntries === 1 ? 'entry' : 'entries'}
              </p>
            </div>

            {/* Status */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
              <p className="text-sm text-zinc-500 font-light uppercase tracking-wider mb-2">
                Status
              </p>
              <div className="mt-2">
                {getStatusBadge(giveaway.status)}
              </div>
            </div>
          </div>
        </section>

        {/* Action Section */}
        {giveaway.status === 'ACTIVE' && (
          <section className="text-center py-8 border-t border-zinc-800">
            <p className="text-zinc-400 font-light mb-4">
              Want to enter this giveaway?
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white text-black font-light uppercase tracking-wider hover:bg-zinc-200 transition-colors rounded"
            >
              Go to Home Page
            </button>
          </section>
        )}
      </div>

      <Footer onManagementLoginClick={() => navigate('/host/login')} />
    </div>
  );
}