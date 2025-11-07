import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import api from '../services/api';

interface CampaignRecipient {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  status: string; // PENDING, SENT, DELIVERED, FAILED, OPENED, CLICKED
  sentAt: string | null;
  errorMessage: string | null;
}

interface CampaignDetail {
  id: number;
  name: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
  sentAt: string | null;
  createdAt: string;
  filtersJson: string;
  recipients: CampaignRecipient[];
}

export function HostCampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCampaignDetails();
    }
  }, [id]);

  const fetchCampaignDetails = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<CampaignDetail>(`/api/host/campaigns/${id}`);
      setCampaign(response.data);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Parse filters JSON
  const parseFilters = (filtersJson: string) => {
    try {
      const filters = JSON.parse(filtersJson);
      const filterChips: string[] = [];

      if (filters.emailVerified !== undefined) {
        filterChips.push(filters.emailVerified ? 'Email Verified' : 'Email Unverified');
      }
      if (filters.emailOptIn !== undefined) {
        filterChips.push(filters.emailOptIn ? 'Email Opt-In' : 'Email Opt-Out');
      }
      if (filters.smsOptIn !== undefined) {
        filterChips.push(filters.smsOptIn ? 'SMS Opt-In' : 'SMS Opt-Out');
      }
      if (filters.giveawayId) {
        filterChips.push(`Giveaway ID: ${filters.giveawayId}`);
      }
      if (filters.sortBy) {
        filterChips.push(`Sorted by: ${filters.sortBy} (${filters.sortOrder || 'asc'})`);
      }

      return filterChips;
    } catch (e) {
      return [];
    }
  };

  // Get recipient status badge
  const getRecipientStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">Sent</span>;
      case 'DELIVERED':
        return <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">Delivered</span>;
      case 'OPENED':
        return <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">Opened</span>;
      case 'CLICKED':
        return <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded">Clicked</span>;
      case 'FAILED':
        return <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded">Failed</span>;
      case 'PENDING':
        return <span className="text-xs px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded">Pending</span>;
      default:
        return <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-zinc-500 font-light">Loading campaign details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-zinc-500 font-light mb-4">Campaign not found</p>
          <button
            onClick={() => navigate('/host/campaigns')}
            className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light"
          >
            Back to Campaigns
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const filters = parseFilters(campaign.filtersJson);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/host/campaigns')}
            className="text-zinc-400 hover:text-white transition-colors text-sm font-light mb-4 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Campaigns
          </button>
          <h1 className="text-3xl font-light text-white mb-2">{campaign.name}</h1>
          <p className="text-zinc-500 font-light">{campaign.subject}</p>
        </div>

        {/* Campaign Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Type & Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Type & Status</p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
                {campaign.type}
              </span>
              <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">
                {campaign.status}
              </span>
            </div>
          </div>

          {/* Recipients */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Recipients</p>
            <p className="text-2xl font-light text-white">{campaign.totalRecipients}</p>
            <p className="text-xs text-zinc-500 mt-1">
              {campaign.totalSent} sent, {campaign.totalFailed} failed
            </p>
          </div>

          {/* Sent Date */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Sent</p>
            <p className="text-sm font-light text-white">{formatDate(campaign.sentAt)}</p>
          </div>
        </div>

        {/* Message Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-light text-white mb-4">Message Content</h2>
          <div className="bg-zinc-800 border border-zinc-700 rounded p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Subject</p>
            <p className="text-sm font-light text-white mb-4">{campaign.subject}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Message</p>
            <p className="text-sm font-light text-zinc-300 whitespace-pre-wrap font-mono">
              {campaign.message}
            </p>
          </div>
        </div>

        {/* Target Audience */}
        {filters.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-light text-white mb-4">Target Audience Filters</h2>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 bg-zinc-800 text-zinc-300 rounded"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Analytics */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-light text-white mb-4">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Sent</p>
              <p className="text-2xl font-light text-white">{campaign.totalSent}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {((campaign.totalSent / campaign.totalRecipients) * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Failed</p>
              <p className="text-2xl font-light text-red-400">{campaign.totalFailed}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {((campaign.totalFailed / campaign.totalRecipients) * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Delivered</p>
              <p className="text-2xl font-light text-zinc-500">N/A</p>
              <p className="text-xs text-zinc-600 mt-1">Tracking not enabled</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Opened</p>
              <p className="text-2xl font-light text-zinc-500">N/A</p>
              <p className="text-xs text-zinc-600 mt-1">Tracking not enabled</p>
            </div>
          </div>
        </div>

        {/* Recipients List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-light text-white">Recipients ({campaign.recipients.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaign.recipients.map((recipient) => (
                  <tr
                    key={recipient.userId}
                    className="border-t border-zinc-800"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-white">
                        {recipient.firstName} {recipient.lastName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-zinc-300">{recipient.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {getRecipientStatusBadge(recipient.status)}
                        {recipient.errorMessage && (
                          <p className="text-xs text-red-400 mt-1">{recipient.errorMessage}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-zinc-400">{formatDate(recipient.sentAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}