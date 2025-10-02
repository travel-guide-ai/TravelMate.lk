import React, { useState, useEffect } from 'react';
import './ItineraryManager.css';

const ItineraryManager = ({ mongoUser }) => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load itineraries when component mounts
  useEffect(() => {
    if (mongoUser?._id) {
      fetchItineraries();
    }
  }, [mongoUser]);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/itineraries`);
      if (response.ok) {
        const data = await response.json();
        setItineraries(data.itineraries || []);
      } else {
        console.error('Failed to fetch itineraries');
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const createItinerary = async (itineraryData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/itineraries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itineraryData)
      });
      
      if (response.ok) {
        const newItinerary = await response.json();
        setItineraries(prev => [newItinerary, ...prev]);
        setShowCreateModal(false);
      } else {
        console.error('Failed to create itinerary');
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
    }
  };

  const updateItinerary = async (itineraryId, updateData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/itineraries/${itineraryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const updatedItinerary = await response.json();
        setItineraries(prev => prev.map(itinerary => 
          itinerary._id === itineraryId ? updatedItinerary : itinerary
        ));
        setEditingItinerary(null);
      } else {
        console.error('Failed to update itinerary');
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
    }
  };

  const deleteItinerary = async (itineraryId) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/itineraries/${itineraryId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setItineraries(prev => prev.filter(itinerary => itinerary._id !== itineraryId));
      } else {
        console.error('Failed to delete itinerary');
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  const duplicateItinerary = async (itinerary) => {
    const duplicateData = {
      ...itinerary,
      title: `${itinerary.title} (Copy)`,
      status: 'planning'
    };
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    
    await createItinerary(duplicateData);
  };

  // Filter and sort itineraries
  const filteredItineraries = itineraries
    .filter(itinerary => {
      const matchesSearch = itinerary.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           itinerary.destination?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || itinerary.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'startDate':
          return new Date(a.startDate || 0) - new Date(b.startDate || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="itinerary-loading">
        <div className="loading-spinner"></div>
        <p>Loading your itineraries...</p>
      </div>
    );
  }

  return (
    <div className="itinerary-manager">
      {/* Header */}
      <div className="itinerary-header">
        <div className="itinerary-title">
          <h2>🗓️ My Itineraries</h2>
          <span className="itinerary-count">
            {filteredItineraries.length} of {itineraries.length} trips
          </span>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="create-itinerary-btn"
        >
          ✈️ Plan New Trip
        </button>
      </div>

      {/* Controls */}
      <div className="itinerary-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search itineraries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filter-section">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="booked">Booked</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">A-Z</option>
            <option value="startDate">By Start Date</option>
          </select>
        </div>
      </div>

      {/* Itineraries Content */}
      <div className="itinerary-content">
        {filteredItineraries.length === 0 ? (
          <div className="empty-state">
            {itineraries.length === 0 ? (
              <>
                <div className="empty-icon">🗓️</div>
                <h3>No itineraries yet</h3>
                <p>Start planning your next adventure!</p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="create-first-btn"
                >
                  Plan Your First Trip
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <h3>No itineraries match your search</h3>
                <p>Try adjusting your search criteria or filters.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="clear-filters-btn"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="itineraries-grid">
            {filteredItineraries.map(itinerary => (
              <ItineraryCard
                key={itinerary._id}
                itinerary={itinerary}
                onEdit={setEditingItinerary}
                onDelete={() => deleteItinerary(itinerary._id)}
                onDuplicate={() => duplicateItinerary(itinerary)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingItinerary) && (
        <ItineraryModal
          itinerary={editingItinerary}
          onSave={editingItinerary ? 
            (data) => updateItinerary(editingItinerary._id, data) : 
            createItinerary
          }
          onCancel={() => {
            setShowCreateModal(false);
            setEditingItinerary(null);
          }}
        />
      )}
    </div>
  );
};

// Itinerary Card Component
const ItineraryCard = ({ itinerary, onEdit, onDelete, onDuplicate }) => {
  const getStatusColor = (status) => {
    const colors = {
      planning: '#f59e0b',
      booked: '#3b82f6',
      ongoing: '#10b981',
      completed: '#6b7280',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      planning: '📝',
      booked: '✅',
      ongoing: '✈️',
      completed: '🏁',
      cancelled: '❌'
    };
    return icons[status] || '📝';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString();
  };

  const getDuration = () => {
    if (!itinerary.startDate || !itinerary.endDate) return 'Duration TBD';
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="itinerary-card">
      <div className="itinerary-card-header">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(itinerary.status) }}>
          <span className="status-icon">{getStatusIcon(itinerary.status)}</span>
          <span className="status-text">{itinerary.status}</span>
        </div>
        <div className="card-actions">
          <button 
            onClick={() => onEdit(itinerary)}
            className="action-btn edit"
            title="Edit"
          >
            ✏️
          </button>
          <button 
            onClick={onDuplicate}
            className="action-btn duplicate"
            title="Duplicate"
          >
            📋
          </button>
          <button 
            onClick={onDelete}
            className="action-btn delete"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="itinerary-card-content">
        <h3 className="itinerary-title">{itinerary.title}</h3>
        
        {itinerary.destination && (
          <p className="itinerary-destination">
            📍 {itinerary.destination}
          </p>
        )}

        <div className="itinerary-dates">
          <div className="date-item">
            <span className="date-label">Start:</span>
            <span className="date-value">{formatDate(itinerary.startDate)}</span>
          </div>
          <div className="date-item">
            <span className="date-label">End:</span>
            <span className="date-value">{formatDate(itinerary.endDate)}</span>
          </div>
          <div className="duration">
            {getDuration()}
          </div>
        </div>

        {itinerary.budget && (
          <div className="itinerary-budget">
            💰 Budget: ${itinerary.budget}
          </div>
        )}

        {itinerary.activities && itinerary.activities.length > 0 && (
          <div className="itinerary-activities">
            <span className="activities-label">Activities:</span>
            <span className="activities-count">{itinerary.activities.length} planned</span>
          </div>
        )}

        {itinerary.description && (
          <p className="itinerary-description">
            {itinerary.description.length > 100
              ? `${itinerary.description.substring(0, 100)}...`
              : itinerary.description
            }
          </p>
        )}
      </div>

      <div className="itinerary-card-footer">
        <button className="view-details-btn">
          View Details
        </button>
        <button className="share-btn">
          Share
        </button>
      </div>
    </div>
  );
};

// Itinerary Modal Component
const ItineraryModal = ({ itinerary, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning',
    description: '',
    activities: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (itinerary) {
      setFormData({
        title: itinerary.title || '',
        destination: itinerary.destination || '',
        startDate: itinerary.startDate ? new Date(itinerary.startDate).toISOString().split('T')[0] : '',
        endDate: itinerary.endDate ? new Date(itinerary.endDate).toISOString().split('T')[0] : '',
        budget: itinerary.budget || '',
        status: itinerary.status || 'planning',
        description: itinerary.description || '',
        activities: itinerary.activities || []
      });
    }
  }, [itinerary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (formData.startDate && formData.endDate && 
        new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.budget && (isNaN(formData.budget) || formData.budget < 0)) {
      newErrors.budget = 'Budget must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{itinerary ? 'Edit Itinerary' : 'Create New Itinerary'}</h3>
          <button onClick={onCancel} className="modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Trip Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Summer Vacation in Bali"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination *</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="e.g., Bali, Indonesia"
              className={errors.destination ? 'error' : ''}
            />
            {errors.destination && <span className="error-text">{errors.destination}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <span className="error-text">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">Budget ($)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="e.g., 2000"
                min="0"
                className={errors.budget ? 'error' : ''}
              />
              {errors.budget && <span className="error-text">{errors.budget}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="planning">Planning</option>
                <option value="booked">Booked</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your trip plans..."
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {itinerary ? 'Update' : 'Create'} Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryManager;