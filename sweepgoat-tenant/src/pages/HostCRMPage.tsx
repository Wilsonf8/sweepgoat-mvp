import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { CampaignComposerModal } from '../components/CampaignComposerModal';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

interface PaginatedResponse {
  data: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function HostCRMPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 50;

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtering
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Campaign modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortBy, sortOrder, emailVerifiedFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortOrder,
      };

      if (emailVerifiedFilter !== 'all') {
        params.emailVerified = emailVerifiedFilter === 'verified';
      }

      const response = await api.get<PaginatedResponse>('/api/host/users', { params });

      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to asc
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    const allIds = new Set(users.map(u => u.id));
    setSelectedUserIds(allIds);
  };

  // Handle deselect all
  const handleDeselectAll = () => {
    setSelectedUserIds(new Set());
  };

  // Handle individual selection
  const handleToggleUser = (userId: number) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(0); // Reset to first page
    fetchUsers();
  };

  // Clear filters
  const handleClearFilters = () => {
    setEmailVerifiedFilter('all');
    setCurrentPage(0);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">CRM - User Management</h1>
          <p className="text-zinc-500 font-light">
            Manage users, apply filters, and launch campaigns
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-light text-white mb-4">Filters</h2>

          <div className="flex flex-wrap gap-4 items-end">
            {/* Email Verified Filter */}
            <div>
              <label className="block text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                Email Verification
              </label>
              <select
                value={emailVerifiedFilter}
                onChange={(e) => setEmailVerifiedFilter(e.target.value as any)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white text-sm font-light rounded focus:border-zinc-600 focus:outline-none"
              >
                <option value="all">All Users</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded transition-colors text-sm font-light"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUserIds.size > 0 && (
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-white font-light">
                <span className="font-medium">{selectedUserIds.size}</span> user{selectedUserIds.size !== 1 ? 's' : ''} selected
              </p>
              <button
                onClick={handleDeselectAll}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Deselect All
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light"
            >
              Launch Campaign
            </button>
          </div>
        )}

        {/* User Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-light text-white">
              Users ({totalItems})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                disabled={users.length === 0}
                className="text-xs text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select All
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-zinc-500 font-light">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <p className="text-zinc-500 font-light mb-2">No users found</p>
              <p className="text-xs text-zinc-600 font-light">
                {emailVerifiedFilter !== 'all' ? 'Try adjusting your filters' : 'Users will appear here when they register'}
              </p>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      {/* Checkbox column */}
                    </th>
                    <th
                      onClick={() => handleSort('email')}
                      className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    >
                      Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('firstName')}
                      className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    >
                      First Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('lastName')}
                      className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    >
                      Last Name {sortBy === 'lastName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider">
                      Verified
                    </th>
                    <th
                      onClick={() => handleSort('createdAt')}
                      className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    >
                      Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('lastLoginAt')}
                      className="px-6 py-3 text-left text-xs font-light text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    >
                      Last Login {sortBy === 'lastLoginAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.has(user.id)}
                          onChange={() => handleToggleUser(user.id)}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-white focus:ring-2 focus:ring-white focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-white">{user.email}</td>
                      <td className="px-6 py-4 text-sm font-light text-zinc-300">{user.firstName}</td>
                      <td className="px-6 py-4 text-sm font-light text-zinc-300">{user.lastName}</td>
                      <td className="px-6 py-4">
                        {user.emailVerified ? (
                          <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">
                            Verified
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-zinc-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-zinc-400">
                        {formatDate(user.lastLoginAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
              <p className="text-sm text-zinc-500 font-light">
                Page {currentPage + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded transition-colors text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded transition-colors text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Composer Modal */}
      <CampaignComposerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipientCount={selectedUserIds.size}
        emailVerifiedFilter={emailVerifiedFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </DashboardLayout>
  );
}