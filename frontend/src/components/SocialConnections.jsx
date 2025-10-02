import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import './SocialConnections.css';

const SocialConnections = ({ mongoUser }) => {
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mongoUser?._id) {
      fetchSocialData();
    }
  }, [mongoUser]);

  const fetchSocialData = async () => {
    if (!clerkUser) return;
    
    setLoading(true);
    try {
      const token = await clerkUser.getToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch followers
      const followersResponse = await fetch(`http://localhost:5000/api/v1/users/${mongoUser._id}/followers`, { headers });
      if (followersResponse.ok) {
        const followersData = await followersResponse.json();
        setFollowers(followersData.followers || []);
      }

      // Fetch following
      const followingResponse = await fetch(`http://localhost:5000/api/v1/users/${mongoUser._id}/following`, { headers });
      if (followingResponse.ok) {
        const followingData = await followingResponse.json();
        setFollowing(followingData.following || []);
      }

      // Fetch suggestions
      const suggestionsResponse = await fetch(`http://localhost:5000/api/v1/users/${mongoUser._id}/suggestions`, { headers });
      if (suggestionsResponse.ok) {
        const suggestionsData = await suggestionsResponse.json();
        setSuggestions(suggestionsData.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId) => {
    if (!clerkUser) return;
    
    try {
      const token = await clerkUser.getToken();
      const response = await fetch(`http://localhost:5000/api/v1/users/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetUserId: userId })
      });

      if (response.ok) {
        // Refresh social data after successful follow
        fetchSocialData();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async (userId) => {
    if (!clerkUser) return;
    
    try {
      const token = await clerkUser.getToken();
      const response = await fetch(`http://localhost:5000/api/v1/users/unfollow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetUserId: userId })
      });

      if (response.ok) {
        // Refresh social data after successful unfollow
        fetchSocialData();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const searchUsers = async (term) => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    if (!clerkUser) return;

    try {
      const token = await clerkUser.getToken();
      const response = await fetch(`http://localhost:5000/api/v1/users/search?q=${encodeURIComponent(term)}&exclude=${mongoUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.users || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim()) {
      setActiveTab('search');
      searchUsers(term);
    } else {
      setActiveTab('followers');
    }
  };

  const filteredFollowers = followers.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFollowing = following.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="social-loading">
        <div className="loading-spinner"></div>
        <p>Loading social connections...</p>
      </div>
    );
  }

  return (
    <div className="social-connections">
      {/* Header */}
      <div className="social-header">
        <div className="social-title">
          <h2>👥 Social Connections</h2>
          <div className="social-stats">
            <span className="stat">
              <strong>{followers.length}</strong> Followers
            </span>
            <span className="stat">
              <strong>{following.length}</strong> Following
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="social-search">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search for travelers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="social-nav">
        <button
          onClick={() => setActiveTab('followers')}
          className={`nav-tab ${activeTab === 'followers' ? 'active' : ''}`}
        >
          Followers ({followers.length})
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`nav-tab ${activeTab === 'following' ? 'active' : ''}`}
        >
          Following ({following.length})
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`nav-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
        >
          Discover
        </button>
        {searchTerm && (
          <button
            onClick={() => setActiveTab('search')}
            className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
          >
            Search Results
          </button>
        )}
      </div>

      {/* Content */}
      <div className="social-content">
        {activeTab === 'followers' && (
          <UserList
            users={filteredFollowers}
            title="Your Followers"
            emptyMessage="You don't have any followers yet. Share your travel experiences to attract fellow travelers!"
            showFollowButton={false}
            onFollow={followUser}
            onUnfollow={unfollowUser}
            currentUserId={mongoUser._id}
            followingList={following}
          />
        )}

        {activeTab === 'following' && (
          <UserList
            users={filteredFollowing}
            title="People You Follow"
            emptyMessage="You're not following anyone yet. Discover and connect with fellow travelers!"
            showFollowButton={true}
            action="unfollow"
            onFollow={followUser}
            onUnfollow={unfollowUser}
            currentUserId={mongoUser._id}
            followingList={following}
          />
        )}

        {activeTab === 'suggestions' && (
          <UserList
            users={suggestions}
            title="Discover Travelers"
            emptyMessage="No suggestions available at the moment. Try searching for specific users!"
            showFollowButton={true}
            action="follow"
            onFollow={followUser}
            onUnfollow={unfollowUser}
            currentUserId={mongoUser._id}
            followingList={following}
          />
        )}

        {activeTab === 'search' && (
          <UserList
            users={suggestions}
            title={`Search Results for "${searchTerm}"`}
            emptyMessage="No users found matching your search."
            showFollowButton={true}
            action="follow"
            onFollow={followUser}
            onUnfollow={unfollowUser}
            currentUserId={mongoUser._id}
            followingList={following}
          />
        )}
      </div>
    </div>
  );
};

// User List Component
const UserList = ({ 
  users, 
  title, 
  emptyMessage, 
  showFollowButton, 
  action, 
  onFollow, 
  onUnfollow, 
  currentUserId, 
  followingList 
}) => {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h3>No users found</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h3 className="list-title">{title}</h3>
      <div className="users-grid">
        {users.map(user => (
          <UserCard
            key={user._id}
            user={user}
            showFollowButton={showFollowButton}
            action={action}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            currentUserId={currentUserId}
            isFollowing={followingList.some(f => f._id === user._id)}
          />
        ))}
      </div>
    </div>
  );
};

// User Card Component
const UserCard = ({ 
  user, 
  showFollowButton, 
  action, 
  onFollow, 
  onUnfollow, 
  currentUserId, 
  isFollowing 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFollowAction = () => {
    if (isFollowing) {
      onUnfollow(user._id);
    } else {
      onFollow(user._id);
    }
  };

  const defaultAvatar = '/default-avatar.png';

  return (
    <div className="user-card">
      <div className="user-avatar">
        <img
          src={imageError ? defaultAvatar : (user.avatar || defaultAvatar)}
          alt={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
          onError={handleImageError}
        />
        {user.isOnline && <div className="online-indicator"></div>}
      </div>

      <div className="user-info">
        <h4 className="user-name">
          {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User'}
        </h4>
        
        {user.username && (
          <p className="user-username">@{user.username}</p>
        )}

        {user.location && (
          <p className="user-location">📍 {user.location}</p>
        )}

        {user.bio && (
          <p className="user-bio">
            {user.bio.length > 80 
              ? `${user.bio.substring(0, 80)}...` 
              : user.bio
            }
          </p>
        )}

        <div className="user-stats">
          <span className="stat">
            <strong>{user.followersCount || 0}</strong> followers
          </span>
          <span className="stat">
            <strong>{user.followingCount || 0}</strong> following
          </span>
        </div>

        {user.travelStyle && (
          <div className="user-travel-style">
            🎒 {user.travelStyle}
          </div>
        )}

        {user.interests && user.interests.length > 0 && (
          <div className="user-interests">
            {user.interests.slice(0, 3).map(interest => (
              <span key={interest} className="interest-tag">
                {interest}
              </span>
            ))}
            {user.interests.length > 3 && (
              <span className="interest-more">
                +{user.interests.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="user-actions">
        <button className="view-profile-btn">
          View Profile
        </button>
        
        {showFollowButton && user._id !== currentUserId && (
          <button
            onClick={handleFollowAction}
            className={`follow-btn ${isFollowing ? 'following' : 'follow'}`}
          >
            {isFollowing ? '✓ Following' : '+ Follow'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialConnections;