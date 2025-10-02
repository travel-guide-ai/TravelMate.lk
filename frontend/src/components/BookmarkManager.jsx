import React, { useState, useEffect } from 'react';
import './BookmarkManager.css';

const BookmarkManager = ({ mongoUser }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  // Available categories for filtering
  const categories = [
    'all', 'beaches', 'mountains', 'cities', 'nature', 'culture', 
    'adventure', 'food', 'historical', 'romantic', 'family'
  ];

  // Load bookmarks when component mounts or user changes
  useEffect(() => {
    if (mongoUser?._id) {
      fetchBookmarks();
    }
  }, [mongoUser]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/bookmarks`);
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks || []);
      } else {
        console.error('Failed to fetch bookmarks');
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/bookmarks/${bookmarkId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setBookmarks(prev => prev.filter(bookmark => bookmark._id !== bookmarkId));
      } else {
        console.error('Failed to remove bookmark');
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      const matchesSearch = bookmark.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bookmark.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bookmark.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || bookmark.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="bookmark-loading">
        <div className="loading-spinner"></div>
        <p>Loading your bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="bookmark-manager">
      {/* Header */}
      <div className="bookmark-header">
        <div className="bookmark-title">
          <h2>🔖 My Bookmarks</h2>
          <span className="bookmark-count">
            {filteredBookmarks.length} of {bookmarks.length} destinations
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="bookmark-controls">
        {/* Search */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="filter-section">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : 
                 category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">A-Z</option>
            <option value="location">By Location</option>
          </select>

          <div className="view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Bookmarks Content */}
      <div className="bookmark-content">
        {filteredBookmarks.length === 0 ? (
          <div className="empty-state">
            {bookmarks.length === 0 ? (
              <>
                <div className="empty-icon">🔖</div>
                <h3>No bookmarks yet</h3>
                <p>Start exploring destinations and save your favorites!</p>
                <button className="explore-btn">
                  Explore Destinations
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <h3>No bookmarks match your search</h3>
                <p>Try adjusting your search criteria or filters.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                  }}
                  className="clear-filters-btn"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={`bookmarks-${viewMode}`}>
            {filteredBookmarks.map(bookmark => (
              <BookmarkCard
                key={bookmark._id}
                bookmark={bookmark}
                viewMode={viewMode}
                onRemove={() => removeBookmark(bookmark._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Bookmark Card Component
const BookmarkCard = ({ bookmark, viewMode, onRemove }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const defaultImage = '/placeholder-destination.jpg';

  return (
    <div className={`bookmark-card ${viewMode}`}>
      {/* Image */}
      <div className="bookmark-image">
        <img
          src={imageError ? defaultImage : (bookmark.imageUrl || defaultImage)}
          alt={bookmark.title || 'Bookmark'}
          onError={handleImageError}
        />
        <div className="bookmark-overlay">
          <button
            onClick={onRemove}
            className="remove-bookmark-btn"
            title="Remove bookmark"
          >
            ❌
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bookmark-content-card">
        <div className="bookmark-meta">
          {bookmark.category && (
            <span className="bookmark-category">
              {bookmark.category}
            </span>
          )}
          <span className="bookmark-date">
            {new Date(bookmark.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="bookmark-title">
          {bookmark.title || 'Untitled Destination'}
        </h3>

        {bookmark.location && (
          <p className="bookmark-location">
            📍 {bookmark.location}
          </p>
        )}

        {bookmark.description && (
          <p className="bookmark-description">
            {bookmark.description.length > 100
              ? `${bookmark.description.substring(0, 100)}...`
              : bookmark.description
            }
          </p>
        )}

        {bookmark.price && (
          <div className="bookmark-price">
            💰 {bookmark.price}
          </div>
        )}

        {bookmark.rating && (
          <div className="bookmark-rating">
            {'⭐'.repeat(Math.floor(bookmark.rating))} 
            <span className="rating-value">({bookmark.rating})</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bookmark-actions">
          <button className="view-details-btn">
            View Details
          </button>
          <button className="plan-trip-btn">
            Plan Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkManager;