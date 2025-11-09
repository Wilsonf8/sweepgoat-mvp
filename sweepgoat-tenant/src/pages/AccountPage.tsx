import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface GiveawayEntry {
  giveawayId: number;
  giveawayTitle: string;
  giveawayImageUrl: string;
  giveawayEndDate: string;
  points: number;
  status: 'ACTIVE' | 'ENDED' | 'WON';
  freeEntryClaimed: boolean;
}

interface PaginatedResponse {
  data: GiveawayEntry[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function AccountPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries(0);
    }
  }, [isAuthenticated]);

  const fetchEntries = async (page: number) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get<PaginatedResponse>(
        `/api/user/my-giveaway-entries?page=${page}&size=5`
      );

      setEntries(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
        hasNext: response.data.hasNext,
        hasPrevious: response.data.hasPrevious,
      });
    } catch (error: any) {
      console.error('Failed to fetch entries:', error);
      setError('Failed to load your giveaway entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchEntries(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-block px-3 py-1 text-xs font-light uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 rounded">
            Active
          </span>
        );
      case 'WON':
        return (
          <span className="inline-block px-3 py-1 text-xs font-light uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
            Won
          </span>
        );
      case 'ENDED':
        return (
          <span className="inline-block px-3 py-1 text-xs font-light uppercase tracking-wider bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 rounded">
            Ended
          </span>
        );
      default:
        return null;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400 font-light">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-20 md:py-32 pt-32">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            My Account
          </h1>
          <p className="text-base text-zinc-400 font-light leading-relaxed">
            View your profile and giveaway entries
          </p>
        </div>

        {/* Profile Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
            Profile Information
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <span className="text-sm text-zinc-500 font-light uppercase tracking-wider md:w-40">
                Name
              </span>
              <span className="text-base text-white font-light">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <span className="text-sm text-zinc-500 font-light uppercase tracking-wider md:w-40">
                Email
              </span>
              <span className="text-base text-white font-light">{user.email}</span>
            </div>
          </div>
        </section>

        {/* Giveaway Entries Section */}
        <section>
          <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
            My Giveaway Entries
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 font-light">Loading entries...</p>
            </div>
          ) : error ? (
            <div className="p-4 border border-red-500 bg-red-500/10 rounded">
              <p className="text-sm text-red-400 font-light">{error}</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 font-light mb-4">
                You haven't entered any giveaways yet.
              </p>
              <button
                onClick={() => navigate('/')}
                className="text-white hover:text-zinc-300 underline font-light"
              >
                Browse active giveaways
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.giveawayId}
                    className="border border-zinc-800 rounded-lg p-6 hover:bg-zinc-900/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-light text-white mb-2">
                          {entry.giveawayTitle}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-500 font-light">
                            Ended: {formatDate(entry.giveawayEndDate)}
                          </p>
                          <p className="text-sm text-zinc-500 font-light">
                            Points: {entry.points}
                          </p>
                        </div>
                      </div>
                      <div>{getStatusBadge(entry.status)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevious}
                    className="px-4 py-2 text-sm font-light text-zinc-500 hover:text-white disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors uppercase tracking-wider"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-zinc-400 font-light">
                    Page {pagination.currentPage + 1} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 text-sm font-light text-zinc-500 hover:text-white disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors uppercase tracking-wider"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Footer onManagementLoginClick={() => navigate('/host/login')} />
    </div>
  );
}