import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import api from '../services/api';

interface Giveaway {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  endDate: string;
  status: 'ENDED' | 'CANCELLED';
  winnerId?: number;
  winnerName?: string;
}

export function PreviousGiveawaysPage() {
  const navigate = useNavigate();
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    fetchGiveaways();
  }, [currentPage]);

  const fetchGiveaways = async () => {
    setIsLoading(true);
    try {
      // Backend supports pagination with status filter
      // Filter to only ENDED and CANCELLED giveaways
      // Note: Backend doesn't support multiple status values, so we'll fetch all and filter
      const response = await api.get('/api/public/giveaways', {
        params: {
          page: currentPage,
          size: pageSize,
          // We'll fetch all statuses and filter client-side since backend doesn't support OR filters
        }
      });

      // Response is a PaginatedResponse object
      const paginatedData = response.data;

      // Filter to only ended/cancelled giveaways from the current page
      const pastGiveaways = paginatedData.data.filter(
        (g: Giveaway) => g.status === 'ENDED' || g.status === 'CANCELLED'
      );

      setGiveaways(pastGiveaways);
      setTotalPages(paginatedData.totalPages);
    } catch (error) {
      console.error('Error fetching giveaways:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === 'ENDED') {
      return (
        <span className="inline-block px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-xs font-light">
          Ended
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-xs font-light border border-red-500">
        Cancelled
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-4">Previous Giveaways</h1>
          <p className="text-zinc-500 font-light">
            Browse our past giveaways and see who won
          </p>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 font-light">Loading giveaways...</p>
          </div>
        ) : giveaways.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-white mb-2">
                No previous giveaways yet!
              </h2>
              <p className="text-zinc-500 font-light mb-8">
                Check back later to see past giveaways
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded transition-colors font-light"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          /* Giveaways grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {giveaways.map((giveaway) => (
                <div
                  key={giveaway.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors"
                >
                  {/* Image */}
                  <div className="aspect-video bg-zinc-800 overflow-hidden">
                    <img
                      src={giveaway.imageUrl}
                      alt={giveaway.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-light text-white flex-1">
                        {giveaway.title}
                      </h3>
                      {getStatusBadge(giveaway.status)}
                    </div>

                    <p className="text-sm text-zinc-500 font-light mb-4">
                      Ended {formatDate(giveaway.endDate)}
                    </p>

                    {giveaway.winnerName && (
                      <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                          Winner
                        </p>
                        <p className="text-sm font-light text-white">
                          {giveaway.winnerName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 rounded transition-colors text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`
                        w-10 h-10 rounded transition-colors text-sm font-light
                        ${
                          currentPage === i
                            ? 'bg-white text-black'
                            : 'bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800'
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 rounded transition-colors text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}