import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useUserSync } from '../hooks/useUserSync';
import UserProfile from '../components/UserProfile';
import BookmarkManager from '../components/BookmarkManager';
import ItineraryManager from '../components/ItineraryManager';
import SocialConnections from '../components/SocialConnections';
import SettingsPrivacy from '../components/SettingsPrivacy';
import './Dashboard.css';

const Dashboard = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { user: mongoUser, loading, syncUser, updateUser } = useUserSync();
  const [activeTab, setActiveTab] = useState('overview');

  // Sync user data when component mounts
  useEffect(() => {
    if (isLoaded && clerkUser && !mongoUser && !loading) {
      syncUser();
    }
  }, [isLoaded, clerkUser, mongoUser, loading, syncUser]);

  // Handle profile updates
  const handleProfileUpdate = (updatedUser) => {
    updateUser(updatedUser);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'bookmarks', name: 'Bookmarks', icon: '🔖' },
    { id: 'itineraries', name: 'Itineraries', icon: '🗓️' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  if (!isLoaded || loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="dashboard-error">
        <h2>Access Denied</h2>
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="user-welcome">
            <img 
              src={clerkUser.imageUrl || '/default-avatar.png'} 
              alt={clerkUser.fullName || 'User'}
              className="user-avatar"
            />
            <div className="user-info">
              <h1>Welcome back, {clerkUser.firstName || 'Traveler'}!</h1>
              <p className="user-subtitle">
                Ready for your next adventure? Let's explore what's new.
              </p>
            </div>
          </div>
          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-number">{mongoUser?.bookmarks?.length || 0}</span>
              <span className="stat-label">Bookmarks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{mongoUser?.itineraries?.length || 0}</span>
              <span className="stat-label">Itineraries</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{mongoUser?.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="dashboard-nav">
        <div className="dashboard-nav-content">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div className="dashboard-content-inner">
          {renderTabContent(activeTab, mongoUser, clerkUser, handleProfileUpdate)}
        </div>
      </div>
    </div>
  );
};

const renderTabContent = (activeTab, mongoUser, clerkUser, onProfileUpdate) => {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab mongoUser={mongoUser} clerkUser={clerkUser} />;
    case 'profile':
      return <ProfileTab mongoUser={mongoUser} clerkUser={clerkUser} onProfileUpdate={onProfileUpdate} />;
    case 'bookmarks':
      return <BookmarksTab mongoUser={mongoUser} />;
    case 'itineraries':
      return <ItinerariesTab mongoUser={mongoUser} />;
    case 'social':
      return <SocialTab mongoUser={mongoUser} />;
    case 'settings':
      return <SettingsTab mongoUser={mongoUser} />;
    default:
      return <OverviewTab mongoUser={mongoUser} clerkUser={clerkUser} />;
  }
};

// Overview Tab Component
const OverviewTab = ({ mongoUser, clerkUser }) => {
  return (
    <div className="overview-tab">
      <div className="overview-grid">
        {/* Quick Stats */}
        <div className="overview-card">
          <h3>Your Travel Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🔖</span>
              <div>
                <span className="stat-value">{mongoUser?.bookmarks?.length || 0}</span>
                <span className="stat-text">Saved Destinations</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🗓️</span>
              <div>
                <span className="stat-value">{mongoUser?.itineraries?.length || 0}</span>
                <span className="stat-text">Travel Plans</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <div>
                <span className="stat-value">{mongoUser?.followers?.length || 0}</span>
                <span className="stat-text">Followers</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🌟</span>
              <div>
                <span className="stat-value">{mongoUser?.reviews?.length || 0}</span>
                <span className="stat-text">Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="overview-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">🔖</span>
              <span className="activity-text">No recent bookmarks</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🗓️</span>
              <span className="activity-text">No recent itineraries</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✍️</span>
              <span className="activity-text">No recent reviews</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="overview-card">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn primary">
              <span>🗓️</span>
              Plan New Trip
            </button>
            <button className="action-btn secondary">
              <span>🔍</span>
              Explore Destinations
            </button>
            <button className="action-btn secondary">
              <span>✍️</span>
              Write Review
            </button>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="overview-card">
          <h3>Profile Completion</h3>
          <div className="profile-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
            <p className="progress-text">60% Complete</p>
            <ul className="completion-list">
              <li className="completed">✓ Basic Info</li>
              <li className="completed">✓ Profile Photo</li>
              <li className="pending">○ Bio Description</li>
              <li className="pending">○ Travel Preferences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const ProfileTab = ({ mongoUser, clerkUser, onProfileUpdate }) => (
  <UserProfile 
    mongoUser={mongoUser} 
    clerkUser={clerkUser} 
    onUpdateProfile={onProfileUpdate}
  />
);

const BookmarksTab = ({ mongoUser }) => (
  <BookmarkManager mongoUser={mongoUser} />
);

const ItinerariesTab = ({ mongoUser }) => (
  <ItineraryManager mongoUser={mongoUser} />
);

const SocialTab = ({ mongoUser }) => (
  <SocialConnections mongoUser={mongoUser} />
);

const SettingsTab = ({ mongoUser }) => (
  <SettingsPrivacy mongoUser={mongoUser} />
);

export default Dashboard;