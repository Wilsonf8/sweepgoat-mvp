import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Trash2 } from 'lucide-react';
import api from '../services/api';

interface Giveaway {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'ENDED' | 'CANCELLED';
  winnerId?: number;
  winnerName?: string;
  totalEntries?: number;
}

type FilterTab = 'ALL' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export function HostGiveawaysPage() {
  const navigate = useNavigate();
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Fetch giveaways
  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        const response = await api.get('/api/host/giveaways');
        setGiveaways(response.data);
      } catch (error) {
        console.error('Error fetching giveaways:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGiveaways();
  }, []);

  // Filter giveaways by tab
  const filteredGiveaways = giveaways.filter((g) => {
    if (activeTab === 'ALL') return true;
    return g.status === activeTab;
  });

  // Handle delete giveaway
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/host/giveaways/${id}`);
      setGiveaways(giveaways.filter((g) => g.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting giveaway:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Giveaways</h1>
            <p className="text-zinc-500 font-light">Manage your giveaways</p>
          </div>
          <button
            onClick={() => navigate('/host/giveaways/new')}
            className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light"
          >
            Create New Giveaway
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800">
          {(['ALL', 'ACTIVE', 'ENDED', 'CANCELLED'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-light transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-white'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Giveaways Table */}
        {filteredGiveaways.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
            <p className="text-zinc-500 font-light">No giveaways found</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                      Entries
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                      Winner
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-light text-zinc-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGiveaways.map((giveaway) => (
                    <tr
                      key={giveaway.id}
                      onClick={() => navigate(`/host/giveaways/${giveaway.id}`)}
                      className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-light text-white">
                        {giveaway.title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-light border ${getStatusColor(
                            giveaway.status
                          )}`}
                        >
                          {giveaway.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-zinc-400">
                        {formatDate(giveaway.startDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-zinc-400">
                        {formatDate(giveaway.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-zinc-400">
                        {giveaway.totalEntries || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-zinc-400">
                        {giveaway.winnerName || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {deleteConfirm === giveaway.id ? (
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleDelete(giveaway.id)}
                              className="px-3 py-1 bg-red-500 text-white text-xs font-light rounded hover:bg-red-600 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-zinc-700 text-white text-xs font-light rounded hover:bg-zinc-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(giveaway.id);
                            }}
                            className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}