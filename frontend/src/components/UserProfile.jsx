import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import './UserProfile.css';

const UserProfile = ({ mongoUser, clerkUser, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    travelStyle: '',
    interests: [],
    website: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    preferences: {
      newsletter: true,
      socialVisibility: 'public',
      profileVisibility: 'public'
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableInterests] = useState([
    'Adventure', 'Beaches', 'Culture', 'Food', 'History', 'Nature', 
    'Photography', 'Shopping', 'Sports', 'Wildlife', 'Mountains', 
    'Cities', 'Backpacking', 'Luxury', 'Budget Travel', 'Solo Travel'
  ]);

  // Initialize form data with existing user data
  useEffect(() => {
    if (mongoUser) {
      setFormData({
        bio: mongoUser.bio || '',
        location: mongoUser.location || '',
        travelStyle: mongoUser.travelStyle || '',
        interests: mongoUser.interests || [],
        website: mongoUser.website || '',
        phone: mongoUser.phone || '',
        dateOfBirth: mongoUser.dateOfBirth || '',
        gender: mongoUser.gender || '',
        emergencyContact: mongoUser.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        preferences: mongoUser.preferences || {
          newsletter: true,
          socialVisibility: 'public',
          profileVisibility: 'public'
        }
      });
    }
  }, [mongoUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.emergencyContact.phone && !isValidPhone(formData.emergencyContact.phone)) {
      newErrors['emergencyContact.phone'] = 'Please enter a valid emergency contact phone';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Call API to update user profile
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (onUpdateProfile) {
          onUpdateProfile(updatedUser);
        }
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (mongoUser) {
      setFormData({
        bio: mongoUser.bio || '',
        location: mongoUser.location || '',
        travelStyle: mongoUser.travelStyle || '',
        interests: mongoUser.interests || [],
        website: mongoUser.website || '',
        phone: mongoUser.phone || '',
        dateOfBirth: mongoUser.dateOfBirth || '',
        gender: mongoUser.gender || '',
        emergencyContact: mongoUser.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        preferences: mongoUser.preferences || {
          newsletter: true,
          socialVisibility: 'public',
          profileVisibility: 'public'
        }
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <img 
            src={clerkUser?.imageUrl || '/default-avatar.png'} 
            alt={clerkUser?.fullName || 'User'}
            className="profile-avatar-large"
          />
          <div className="profile-basic-info">
            <h2>{clerkUser?.fullName || 'Anonymous User'}</h2>
            <p className="profile-email">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
            <p className="profile-joined">
              Member since {new Date(clerkUser?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-profile-btn"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                onClick={handleCancel}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="save-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}

      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Bio Section */}
          <div className="form-section">
            <h3>About Me</h3>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              {isEditing ? (
                <div>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and your travel experiences..."
                    rows={4}
                    maxLength={500}
                    className={errors.bio ? 'error' : ''}
                  />
                  <div className="char-count">
                    {formData.bio.length}/500 characters
                  </div>
                  {errors.bio && <span className="error-text">{errors.bio}</span>}
                </div>
              ) : (
                <p className="field-value">
                  {formData.bio || 'No bio added yet'}
                </p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="field-value">
                    {formData.location || 'Not specified'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="field-value">
                    {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not specified'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                {isEditing ? (
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="field-value">
                    {formData.gender || 'Not specified'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                ) : (
                  <p className="field-value">
                    {formData.phone || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="form-section">
            <h3>Travel Preferences</h3>
            <div className="form-group">
              <label htmlFor="travelStyle">Travel Style</label>
              {isEditing ? (
                <select
                  id="travelStyle"
                  name="travelStyle"
                  value={formData.travelStyle}
                  onChange={handleInputChange}
                >
                  <option value="">Select travel style</option>
                  <option value="budget">Budget Traveler</option>
                  <option value="mid-range">Mid-range Traveler</option>
                  <option value="luxury">Luxury Traveler</option>
                  <option value="backpacker">Backpacker</option>
                  <option value="family">Family Traveler</option>
                  <option value="solo">Solo Traveler</option>
                  <option value="group">Group Traveler</option>
                </select>
              ) : (
                <p className="field-value">
                  {formData.travelStyle || 'Not specified'}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Travel Interests</label>
              {isEditing ? (
                <div className="interests-grid">
                  {availableInterests.map(interest => (
                    <label key={interest} className="interest-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="interests-display">
                  {formData.interests.length > 0 ? (
                    formData.interests.map(interest => (
                      <span key={interest} className="interest-tag">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="field-value">No interests selected</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Additional Contact</h3>
            <div className="form-group">
              <label htmlFor="website">Website</label>
              {isEditing ? (
                <div>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://your-website.com"
                    className={errors.website ? 'error' : ''}
                  />
                  {errors.website && <span className="error-text">{errors.website}</span>}
                </div>
              ) : (
                <p className="field-value">
                  {formData.website ? (
                    <a href={formData.website} target="_blank" rel="noopener noreferrer">
                      {formData.website}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="form-section">
            <h3>Emergency Contact</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="emergencyContact.name">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="emergencyContact.name"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    placeholder="Emergency contact name"
                  />
                ) : (
                  <p className="field-value">
                    {formData.emergencyContact.name || 'Not specified'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContact.phone">Phone</label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      id="emergencyContact.phone"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      className={errors['emergencyContact.phone'] ? 'error' : ''}
                    />
                    {errors['emergencyContact.phone'] && (
                      <span className="error-text">{errors['emergencyContact.phone']}</span>
                    )}
                  </div>
                ) : (
                  <p className="field-value">
                    {formData.emergencyContact.phone || 'Not specified'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContact.relationship">Relationship</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="emergencyContact.relationship"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    placeholder="e.g., Parent, Spouse, Friend"
                  />
                ) : (
                  <p className="field-value">
                    {formData.emergencyContact.relationship || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Preferences */}
          <div className="form-section">
            <h3>Privacy Preferences</h3>
            <div className="form-group">
              <label htmlFor="preferences.profileVisibility">Profile Visibility</label>
              {isEditing ? (
                <select
                  id="preferences.profileVisibility"
                  name="preferences.profileVisibility"
                  value={formData.preferences.profileVisibility}
                  onChange={handleInputChange}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              ) : (
                <p className="field-value">
                  {formData.preferences.profileVisibility || 'Public'}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="preferences.socialVisibility">Social Activity Visibility</label>
              {isEditing ? (
                <select
                  id="preferences.socialVisibility"
                  name="preferences.socialVisibility"
                  value={formData.preferences.socialVisibility}
                  onChange={handleInputChange}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              ) : (
                <p className="field-value">
                  {formData.preferences.socialVisibility || 'Public'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={handleInputChange}
                  />
                  <span>Subscribe to newsletter and travel updates</span>
                </label>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;