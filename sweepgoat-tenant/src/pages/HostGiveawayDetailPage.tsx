import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Trash2 } from 'lucide-react';
import api from '../services/api';

interface Giveaway {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'ENDED' | 'COMPLETED' | 'CANCELLED';
  winnerId?: number;
  winnerName?: string;
}

interface WinnerSelectionResponse {
  giveawayId: number;
  giveawayTitle: string;
  winnerId: number;
  winnerEmail: string;
  winnerFirstName: string;
  winnerLastName: string;
  winnerPhoneNumber: string;
  winnerPoints: number;
  selectedAt: string;
  totalEntries: number;
}

interface GiveawayStats {
  totalEntries: number;
  uniqueUsers: number;
  topEntrant?: {
    name: string;
    email: string;
    entries: number;
  };
}

interface EntryUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  points: number;
  entryId: number;
  freeEntryClaimed: boolean;
  enteredAt: string;
}

export function HostGiveawayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [stats, setStats] = useState<GiveawayStats | null>(null);
  const [entries, setEntries] = useState<EntryUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [winner, setWinner] = useState<WinnerSelectionResponse | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch giveaway details
  useEffect(() => {
    const fetchGiveaway = async () => {
      try {
        const [giveawayRes, statsRes, entriesRes] = await Promise.all([
          api.get(`/api/host/giveaways/${id}`),
          api.get(`/api/host/giveaways/${id}/stats`),
          api.get(`/api/host/giveaways/${id}/entries`),
        ]);

        setGiveaway(giveawayRes.data);
        setStats(statsRes.data);
        setEntries(entriesRes.data);
      } catch (error) {
        console.error('Error fetching giveaway:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGiveaway();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    try {
      await api.delete(`/api/host/giveaways/${id}`);
      navigate('/host/giveaways');
    } catch (error) {
      console.error('Error deleting giveaway:', error);
    }
  };

  // Handle select winner
  const handleSelectWinner = async () => {
    if (!giveaway) return;

    // Confirm action
    const confirmMessage =
      giveaway.status === 'COMPLETED'
        ? 'Are you sure you want to re-select a new winner? This will replace the current winner.'
        : 'Are you sure you want to select a winner? This action will mark the giveaway as completed.';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSelecting(true);
    setError(null);

    try {
      const response = await api.post(`/api/host/giveaways/${giveaway.id}/select-winner`);
      const winnerData = response.data;

      setWinner(winnerData);

      // Update giveaway status to COMPLETED
      setGiveaway({
        ...giveaway,
        status: 'COMPLETED',
      });

      alert(`Winner selected: ${winnerData.winnerFirstName} ${winnerData.winnerLastName}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to select winner';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSelecting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/10 text-green-400 border-green-500';
      case 'ENDED':
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500';
      case 'COMPLETED':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500';
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-400 border-red-500';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-zinc-500 font-light">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!giveaway) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-zinc-500 font-light">Giveaway not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-light text-white">{giveaway.title}</h1>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-light border ${getStatusColor(
                  giveaway.status
                )}`}
              >
                {giveaway.status}
              </span>
            </div>
            <p className="text-zinc-500 font-light">{giveaway.description}</p>
          </div>

          {/* Delete Button */}
          {deleteConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white text-sm font-light rounded hover:bg-red-600 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 bg-zinc-700 text-white text-sm font-light rounded hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors text-sm font-light"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <img
                src={giveaway.imageUrl}
                alt={giveaway.title}
                className="w-full h-auto"
              />
            </div>

            {/* Dates */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-1">
                  Start Date
                </p>
                <p className="text-sm font-light text-white">
                  {formatDate(giveaway.startDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-1">
                  End Date
                </p>
                <p className="text-sm font-light text-white">
                  {formatDate(giveaway.endDate)}
                </p>
              </div>
            </div>

            {/* Winner (if exists) */}
            {giveaway.winnerName && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                  Winner
                </p>
                <p className="text-lg font-light text-white">{giveaway.winnerName}</p>
              </div>
            )}
          </div>

          {/* Right Column - Stats and Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-light text-white mb-6">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                    Total Entries
                  </p>
                  <p className="text-3xl font-light text-white">
                    {stats?.totalEntries || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                    Unique Users
                  </p>
                  <p className="text-3xl font-light text-white">
                    {stats?.uniqueUsers || 0}
                  </p>
                </div>
                {stats?.topEntrant && (
                  <div>
                    <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                      Top Entrant
                    </p>
                    <p className="text-lg font-light text-white">{stats.topEntrant.name}</p>
                    <p className="text-sm font-light text-zinc-500">
                      {stats.topEntrant.entries} entries
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Winner Selection Section - Only show if ENDED and has entries */}
            {giveaway.status === 'ENDED' && (stats?.totalEntries || 0) > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-xl font-light text-white mb-4">Select Winner</h2>
                <p className="text-sm text-zinc-400 font-light mb-6">
                  This giveaway has ended with {stats?.totalEntries || 0}{' '}
                  {stats?.totalEntries === 1 ? 'entry' : 'entries'}. Click below to randomly
                  select a winner.
                </p>
                <button
                  onClick={handleSelectWinner}
                  disabled={isSelecting}
                  className="px-6 py-3 bg-white text-black font-light uppercase tracking-wider hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors rounded"
                >
                  {isSelecting ? 'Selecting Winner...' : 'Select Winner'}
                </button>
              </div>
            )}

            {/* No Entries Message */}
            {giveaway.status === 'ENDED' && (stats?.totalEntries || 0) === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-xl font-light text-white mb-4">No Entries</h2>
                <p className="text-sm text-zinc-400 font-light">
                  This giveaway has no entries. Winner selection is not available.
                </p>
              </div>
            )}

            {/* Winner Display Section */}
            {giveaway.status === 'COMPLETED' && winner && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-light text-white">Winner</h2>
                  <button
                    onClick={handleSelectWinner}
                    disabled={isSelecting}
                    className="px-4 py-2 border border-zinc-500 text-zinc-300 font-light uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50 transition-colors rounded text-sm"
                  >
                    {isSelecting ? 'Re-selecting...' : 'Re-select Winner'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <span className="text-sm text-zinc-500 font-light uppercase tracking-wider md:w-40">
                      Name
                    </span>
                    <span className="text-base text-white font-light">
                      {winner.winnerFirstName} {winner.winnerLastName}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center">
                    <span className="text-sm text-zinc-500 font-light uppercase tracking-wider md:w-40">
                      Email
                    </span>
                    <span className="text-base text-white font-light">
                      {winner.winnerEmail}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center">
                    <span className="text-sm text-zinc-500 font-light uppercase tracking-wider md:w-40">
                      Phone
                    </span>
                    <span className="text-base text-white font-light">
                      {winner.winnerPhoneNumber}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center">
                    <span className="text-sm text-zinc-500 font-light uppercase tracking-wider md:w-40">
                      Points
                    </span>
                    <span className="text-base text-white font-light">{winner.winnerPoints}</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center">
                    <span className="text-sm text-zinc-500 font-light uppercase tracking-wider md:w-40">
                      Selected
                    </span>
                    <span className="text-base text-white font-light">
                      {formatDate(winner.selectedAt)}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center">
                    <span className="text-sm text-zinc-500 font-light uppercase tracking-wider md:w-40">
                      Total Entries
                    </span>
                    <span className="text-base text-white font-light">
                      {winner.totalEntries}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <p className="text-sm text-red-400 font-light">{error}</p>
              </div>
            )}

            {/* Leaderboard */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-xl font-light text-white">Leaderboard</h2>
              </div>

              {entries.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-zinc-500 font-light">No entries yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-zinc-800">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="text-right px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                          Entries
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, index) => (
                        <tr
                          key={entry.userId}
                          className="border-b border-zinc-800 last:border-b-0"
                        >
                          <td className="px-6 py-4 text-sm font-light text-zinc-400">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-light text-white">
                            {entry.firstName} {entry.lastName}
                          </td>
                          <td className="px-6 py-4 text-sm font-light text-zinc-400">
                            {entry.email}
                          </td>
                          <td className="px-6 py-4 text-sm font-light text-white text-right">
                            {entry.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}