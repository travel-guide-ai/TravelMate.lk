import React, { useState, useEffect } from 'react';
import './SettingsPrivacy.css';

const SettingsPrivacy = ({ mongoUser }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: {
        newsletters: true,
        bookingConfirmations: true,
        itineraryUpdates: true,
        socialActivity: true,
        promotions: false,
        securityAlerts: true
      },
      push: {
        bookingReminders: true,
        socialActivity: true,
        itineraryUpdates: true,
        promotions: false
      }
    },
    privacy: {
      profileVisibility: 'public',
      socialVisibility: 'public',
      activityVisibility: 'friends',
      searchVisibility: true,
      dataCollection: true,
      locationSharing: 'friends'
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: '30',
      dataDownload: false,
      accountDeletion: false
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      units: 'metric',
      theme: 'light',
      timezone: 'auto'
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load settings when component mounts
  useEffect(() => {
    if (mongoUser?._id) {
      loadSettings();
    }
  }, [mongoUser]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...data.settings
          }));
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (section, subsection, key) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: !prev[section][subsection][key]
        }
      }
    }));
  };

  const handleSelectChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const exportData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/export`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `travelmate-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        setMessage({ type: 'success', text: 'Data export started! Check your downloads.' });
      } else {
        throw new Error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' });
    }
  };

  const requestAccountDeletion = async () => {
    const confirmation = window.prompt(
      'Are you sure you want to delete your account? This action cannot be undone. Type "DELETE" to confirm:'
    );

    if (confirmation === 'DELETE') {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${mongoUser._id}/delete-request`, {
          method: 'POST'
        });

        if (response.ok) {
          setMessage({ 
            type: 'warning', 
            text: 'Account deletion request submitted. You will receive an email with further instructions.' 
          });
        } else {
          throw new Error('Failed to submit deletion request');
        }
      } catch (error) {
        console.error('Error requesting account deletion:', error);
        setMessage({ type: 'error', text: 'Failed to submit deletion request. Please try again.' });
      }
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-privacy">
      {/* Header */}
      <div className="settings-header">
        <h2>⚙️ Settings & Privacy</h2>
        <button 
          onClick={saveSettings}
          disabled={saving}
          className="save-settings-btn"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-content">
        {/* Notification Settings */}
        <div className="settings-section">
          <h3>🔔 Notification Settings</h3>
          
          <div className="settings-subsection">
            <h4>Email Notifications</h4>
            <div className="settings-grid">
              <ToggleOption
                label="Newsletter & Updates"
                description="Receive travel tips, destination guides, and platform updates"
                checked={settings.notifications.email.newsletters}
                onChange={() => handleToggle('notifications', 'email', 'newsletters')}
              />
              <ToggleOption
                label="Booking Confirmations"
                description="Get confirmation emails for bookings and reservations"
                checked={settings.notifications.email.bookingConfirmations}
                onChange={() => handleToggle('notifications', 'email', 'bookingConfirmations')}
              />
              <ToggleOption
                label="Itinerary Updates"
                description="Notifications about changes to your travel plans"
                checked={settings.notifications.email.itineraryUpdates}
                onChange={() => handleToggle('notifications', 'email', 'itineraryUpdates')}
              />
              <ToggleOption
                label="Social Activity"
                description="Updates about followers, likes, and social interactions"
                checked={settings.notifications.email.socialActivity}
                onChange={() => handleToggle('notifications', 'email', 'socialActivity')}
              />
              <ToggleOption
                label="Promotions & Deals"
                description="Special offers and promotional content"
                checked={settings.notifications.email.promotions}
                onChange={() => handleToggle('notifications', 'email', 'promotions')}
              />
              <ToggleOption
                label="Security Alerts"
                description="Important security notifications and account alerts"
                checked={settings.notifications.email.securityAlerts}
                onChange={() => handleToggle('notifications', 'email', 'securityAlerts')}
              />
            </div>
          </div>

          <div className="settings-subsection">
            <h4>Push Notifications</h4>
            <div className="settings-grid">
              <ToggleOption
                label="Booking Reminders"
                description="Reminders about upcoming trips and check-ins"
                checked={settings.notifications.push.bookingReminders}
                onChange={() => handleToggle('notifications', 'push', 'bookingReminders')}
              />
              <ToggleOption
                label="Social Activity"
                description="Real-time notifications for social interactions"
                checked={settings.notifications.push.socialActivity}
                onChange={() => handleToggle('notifications', 'push', 'socialActivity')}
              />
              <ToggleOption
                label="Itinerary Updates"
                description="Push notifications for travel plan changes"
                checked={settings.notifications.push.itineraryUpdates}
                onChange={() => handleToggle('notifications', 'push', 'itineraryUpdates')}
              />
              <ToggleOption
                label="Promotions"
                description="Promotional push notifications"
                checked={settings.notifications.push.promotions}
                onChange={() => handleToggle('notifications', 'push', 'promotions')}
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section">
          <h3>🔒 Privacy Settings</h3>
          
          <div className="settings-grid">
            <SelectOption
              label="Profile Visibility"
              description="Who can see your profile information"
              value={settings.privacy.profileVisibility}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'friends', label: 'Friends Only' },
                { value: 'private', label: 'Private' }
              ]}
              onChange={(value) => handleSelectChange('privacy', 'profileVisibility', value)}
            />
            
            <SelectOption
              label="Social Activity Visibility"
              description="Who can see your likes, follows, and social interactions"
              value={settings.privacy.socialVisibility}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'friends', label: 'Friends Only' },
                { value: 'private', label: 'Private' }
              ]}
              onChange={(value) => handleSelectChange('privacy', 'socialVisibility', value)}
            />

            <SelectOption
              label="Activity Feed Visibility"
              description="Who can see your travel activities and posts"
              value={settings.privacy.activityVisibility}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'friends', label: 'Friends Only' },
                { value: 'private', label: 'Private' }
              ]}
              onChange={(value) => handleSelectChange('privacy', 'activityVisibility', value)}
            />

            <SelectOption
              label="Location Sharing"
              description="Who can see your location information"
              value={settings.privacy.locationSharing}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'friends', label: 'Friends Only' },
                { value: 'private', label: 'Private' }
              ]}
              onChange={(value) => handleSelectChange('privacy', 'locationSharing', value)}
            />

            <ToggleOption
              label="Appear in Search Results"
              description="Allow other users to find you through search"
              checked={settings.privacy.searchVisibility}
              onChange={() => handleToggle('privacy', '', 'searchVisibility')}
            />

            <ToggleOption
              label="Data Collection for Recommendations"
              description="Allow us to use your data to improve recommendations"
              checked={settings.privacy.dataCollection}
              onChange={() => handleToggle('privacy', '', 'dataCollection')}
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-section">
          <h3>🛡️ Security Settings</h3>
          
          <div className="settings-grid">
            <ToggleOption
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              checked={settings.security.twoFactorAuth}
              onChange={() => handleToggle('security', '', 'twoFactorAuth')}
              actionButton={!settings.security.twoFactorAuth ? "Enable 2FA" : "Disable 2FA"}
            />

            <ToggleOption
              label="Login Notifications"
              description="Get notified when someone logs into your account"
              checked={settings.security.loginNotifications}
              onChange={() => handleToggle('security', '', 'loginNotifications')}
            />

            <SelectOption
              label="Session Timeout"
              description="Automatically log out after period of inactivity"
              value={settings.security.sessionTimeout}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
                { value: '240', label: '4 hours' },
                { value: 'never', label: 'Never' }
              ]}
              onChange={(value) => handleSelectChange('security', 'sessionTimeout', value)}
            />
          </div>
        </div>

        {/* App Preferences */}
        <div className="settings-section">
          <h3>🎨 App Preferences</h3>
          
          <div className="settings-grid">
            <SelectOption
              label="Language"
              description="Choose your preferred language"
              value={settings.preferences.language}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' },
                { value: 'it', label: 'Italiano' },
                { value: 'pt', label: 'Português' }
              ]}
              onChange={(value) => handleSelectChange('preferences', 'language', value)}
            />

            <SelectOption
              label="Currency"
              description="Default currency for prices and bookings"
              value={settings.preferences.currency}
              options={[
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' },
                { value: 'GBP', label: 'British Pound (GBP)' },
                { value: 'CAD', label: 'Canadian Dollar (CAD)' },
                { value: 'AUD', label: 'Australian Dollar (AUD)' },
                { value: 'JPY', label: 'Japanese Yen (JPY)' }
              ]}
              onChange={(value) => handleSelectChange('preferences', 'currency', value)}
            />

            <SelectOption
              label="Units"
              description="Measurement units for distances and temperatures"
              value={settings.preferences.units}
              options={[
                { value: 'metric', label: 'Metric (km, °C)' },
                { value: 'imperial', label: 'Imperial (miles, °F)' }
              ]}
              onChange={(value) => handleSelectChange('preferences', 'units', value)}
            />

            <SelectOption
              label="Theme"
              description="Choose your preferred app theme"
              value={settings.preferences.theme}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto (system)' }
              ]}
              onChange={(value) => handleSelectChange('preferences', 'theme', value)}
            />

            <SelectOption
              label="Timezone"
              description="Set your timezone for accurate scheduling"
              value={settings.preferences.timezone}
              options={[
                { value: 'auto', label: 'Auto-detect' },
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' },
                { value: 'Europe/London', label: 'London' },
                { value: 'Europe/Paris', label: 'Paris' },
                { value: 'Asia/Tokyo', label: 'Tokyo' }
              ]}
              onChange={(value) => handleSelectChange('preferences', 'timezone', value)}
            />
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <h3>📊 Data Management</h3>
          
          <div className="settings-actions">
            <div className="action-item">
              <div className="action-info">
                <h4>Export Your Data</h4>
                <p>Download a copy of all your data including bookmarks, itineraries, and profile information.</p>
              </div>
              <button onClick={exportData} className="action-btn secondary">
                📥 Export Data
              </button>
            </div>

            <div className="action-item">
              <div className="action-info">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
              <button onClick={requestAccountDeletion} className="action-btn danger">
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle Option Component
const ToggleOption = ({ label, description, checked, onChange, actionButton }) => (
  <div className="toggle-option">
    <div className="toggle-info">
      <h5>{label}</h5>
      <p>{description}</p>
    </div>
    <div className="toggle-controls">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="toggle-slider"></span>
      </label>
      {actionButton && (
        <button className="toggle-action-btn">
          {actionButton}
        </button>
      )}
    </div>
  </div>
);

// Select Option Component
const SelectOption = ({ label, description, value, options, onChange }) => (
  <div className="select-option">
    <div className="select-info">
      <h5>{label}</h5>
      <p>{description}</p>
    </div>
    <div className="select-control">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default SettingsPrivacy;