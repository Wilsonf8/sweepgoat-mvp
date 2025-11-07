import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import api from '../services/api';

interface Campaign {
  id: number;
  name: string;
  type: string; // EMAIL, SMS, BOTH
  subject: string;
  status: string; // DRAFT, SCHEDULED, SENDING, SENT, CANCELLED
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
  sentAt: string | null;
  createdAt: string;
}

export function HostCampaignsPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Campaign[]>('/api/host/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not sent';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get type badge color
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">Email</span>;
      case 'SMS':
        return <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">SMS</span>;
      case 'BOTH':
        return <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded">Email + SMS</span>;
      default:
        return <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">{type}</span>;
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">Sent</span>;
      case 'SENDING':
        return <span className="text-xs px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded">Sending</span>;
      case 'DRAFT':
        return <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">Draft</span>;
      case 'SCHEDULED':
        return <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">Scheduled</span>;
      case 'CANCELLED':
        return <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded">Cancelled</span>;
      default:
        return <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">{status}</span>;
    }
  };

  // Calculate success rate
  const getSuccessRate = (campaign: Campaign) => {
    if (campaign.totalRecipients === 0) return 'N/A';
    const rate = (campaign.totalSent / campaign.totalRecipients) * 100;
    return `${rate.toFixed(0)}%`;
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">Campaigns</h1>
          <p className="text-zinc-500 font-light">
            View and analyze your email marketing campaigns
          </p>
        </div>

        {/* Campaigns List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {/* Loading State */}
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-zinc-500 font-light">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <p className="text-zinc-500 font-light mb-2">No campaigns yet</p>
              <p className="text-xs text-zinc-600 font-light mb-4">
                Launch your first campaign from the CRM page
              </p>
              <button
                onClick={() => navigate('/host/crm')}
                className="px-6 py-2 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light"
              >
                Go to CRM
              </button>
            </div>
          ) : (
            /* Campaigns Table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                      Sent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      onClick={() => navigate(`/host/campaigns/${campaign.id}`)}
                      className="border-t border-zinc-800 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-light text-white">{campaign.name}</p>
                          <p className="text-xs text-zinc-500 font-light mt-1">{campaign.subject}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getTypeBadge(campaign.type)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-light text-white">{campaign.totalRecipients}</p>
                          {campaign.totalFailed > 0 && (
                            <p className="text-xs text-red-400 font-light mt-1">
                              {campaign.totalFailed} failed
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-light text-zinc-300">{getSuccessRate(campaign)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-light text-zinc-400">{formatDate(campaign.sentAt)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}