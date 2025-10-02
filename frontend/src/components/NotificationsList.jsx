import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { 
  Bell, 
  Filter, 
  CheckCheck, 
  Archive, 
  Trash2,
  RefreshCw,
  Settings 
} from 'lucide-react';
import NotificationItem from './NotificationItem';

const NotificationsList = ({ className = '' }) => {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = async (page = 1, newFilters = filters) => {
    if (!clerkUser) return;

    try {
      setLoading(true);
      const token = await getToken();
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...newFilters
      }).toString();

      const response = await fetch(`http://localhost:5000/api/v1/notifications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data.notifications);
        setPagination({
          currentPage: data.data.currentPage,
          totalPages: data.data.totalPages,
          totalItems: data.data.totalItems
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notification statistics
  const fetchStats = async () => {
    if (!clerkUser) return;

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/v1/notifications/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    if (!clerkUser) return;

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/v1/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, status: 'read' }
              : notif
          )
        );
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark multiple notifications as read
  const handleBulkMarkAsRead = async (notificationIds = selectedNotifications) => {
    if (!clerkUser || notificationIds.length === 0) return;

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/v1/notifications/read-bulk', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notificationIds.includes(notif._id)
              ? { ...notif, status: 'read' }
              : notif
          )
        );
        setSelectedNotifications([]);
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error bulk marking notifications as read:', error);
    }
  };

  // Archive notifications
  const handleArchive = async (notificationIds = selectedNotifications) => {
    if (!clerkUser || notificationIds.length === 0) return;

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/v1/notifications/archive-bulk', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds })
      });

      if (response.ok) {
        // Remove archived notifications from view
        setNotifications(prev => 
          prev.filter(notif => !notificationIds.includes(notif._id))
        );
        setSelectedNotifications([]);
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error archiving notifications:', error);
    }
  };

  // Delete notifications
  const handleDelete = async (notificationIds = selectedNotifications) => {
    if (!clerkUser || notificationIds.length === 0) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${notificationIds.length} notification(s)? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/v1/notifications/delete-bulk', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds })
      });

      if (response.ok) {
        // Remove deleted notifications from view
        setNotifications(prev => 
          prev.filter(notif => !notificationIds.includes(notif._id))
        );
        setSelectedNotifications([]);
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchNotifications(1, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchNotifications(page, filters);
  };

  // Toggle notification selection
  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Select all visible notifications
  const toggleSelectAll = () => {
    const visibleIds = notifications.map(notif => notif._id);
    setSelectedNotifications(prev => 
      prev.length === visibleIds.length ? [] : visibleIds
    );
  };

  // Initial data fetch
  useEffect(() => {
    if (clerkUser) {
      fetchNotifications();
      fetchStats();
    }
  }, [clerkUser]);

  if (!clerkUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please sign in to view your notifications.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header with Stats */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchNotifications(pagination.currentPage, filters)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <a
              href="/notifications/settings"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total || 0}</div>
            <div className="text-sm text-blue-700">Total</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.unread || 0}</div>
            <div className="text-sm text-orange-700">Unread</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.read || 0}</div>
            <div className="text-sm text-green-700">Read</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{stats.archived || 0}</div>
            <div className="text-sm text-gray-700">Archived</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="booking_confirmation">Booking Confirmed</option>
            <option value="booking_reminder">Booking Reminder</option>
            <option value="payment_success">Payment Success</option>
            <option value="system_update">System Updates</option>
            <option value="promotional">Promotional</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="border-b border-gray-200 p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedNotifications.length} notification(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkMarkAsRead()}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <CheckCheck className="w-4 h-4 inline mr-1" />
                Mark as Read
              </button>
              <button
                onClick={() => handleArchive()}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Archive className="w-4 h-4 inline mr-1" />
                Archive
              </button>
              <button
                onClick={() => handleDelete()}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <>
            {/* Select All Checkbox */}
            <div className="p-4 flex items-center border-b border-gray-200">
              <input
                type="checkbox"
                checked={selectedNotifications.length === notifications.length && notifications.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm text-gray-700">
                Select all visible notifications
              </label>
            </div>

            {/* Notifications */}
            {notifications.map((notification) => (
              <div key={notification._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification._id)}
                    onChange={() => toggleNotificationSelection(notification._id)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      showActions={false}
                      className="border-none p-0 bg-transparent hover:bg-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {filters.status !== 'all' || filters.type !== 'all' || filters.priority !== 'all'
                ? 'Try adjusting your filters to see more notifications.'
                : "You're all caught up! No notifications at the moment."
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalItems)} of {pagination.totalItems} notifications
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      pagination.currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;