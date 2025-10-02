import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  Save, 
  Check,
  Settings,
  Calendar,
  CreditCard,
  MapPin,
  Award,
  AlertTriangle
} from 'lucide-react';

const NotificationSettings = ({ className = '' }) => {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    // Notification type preferences
    bookingConfirmation: { email: true, push: true, sms: false },
    bookingReminder: { email: true, push: true, sms: true },
    paymentSuccess: { email: true, push: true, sms: false },
    paymentFailed: { email: true, push: true, sms: true },
    tripUpdate: { email: true, push: true, sms: false },
    weatherAlert: { email: false, push: true, sms: false },
    promotional: { email: true, push: false, sms: false },
    systemUpdate: { email: true, push: true, sms: false },
    reviewRequest: { email: true, push: true, sms: false },
    loyaltyReward: { email: true, push: true, sms: false },
    emergencyAlert: { email: true, push: true, sms: true },
    priceAlert: { email: true, push: true, sms: false },
    socialActivity: { email: false, push: true, sms: false },
    securityAlert: { email: true, push: true, sms: true }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch current settings
  const fetchSettings = async () => {
    if (!clerkUser) return;

    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/v1/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const userSettings = data.data.settings;
        
        if (userSettings) {
          setSettings(prev => ({
            ...prev,
            emailNotifications: userSettings.emailNotifications ?? true,
            pushNotifications: userSettings.pushNotifications ?? true,
            smsNotifications: userSettings.smsNotifications ?? false,
            ...userSettings.notificationTypes
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    if (!clerkUser) return;

    try {
      setSaving(true);
      const token = await getToken();
      
      const payload = {
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        smsNotifications: settings.smsNotifications,
        notificationTypes: {
          bookingConfirmation: settings.bookingConfirmation,
          bookingReminder: settings.bookingReminder,
          paymentSuccess: settings.paymentSuccess,
          paymentFailed: settings.paymentFailed,
          tripUpdate: settings.tripUpdate,
          weatherAlert: settings.weatherAlert,
          promotional: settings.promotional,
          systemUpdate: settings.systemUpdate,
          reviewRequest: settings.reviewRequest,
          loyaltyReward: settings.loyaltyReward,
          emergencyAlert: settings.emergencyAlert,
          priceAlert: settings.priceAlert,
          socialActivity: settings.socialActivity,
          securityAlert: settings.securityAlert
        }
      };

      const response = await fetch('http://localhost:5000/api/v1/profile/settings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000); // Hide success message after 3 seconds
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  // Toggle global setting
  const toggleGlobalSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle specific notification type setting
  const toggleNotificationSetting = (notificationType, channel) => {
    setSettings(prev => ({
      ...prev,
      [notificationType]: {
        ...prev[notificationType],
        [channel]: !prev[notificationType][channel]
      }
    }));
  };

  // Notification type configurations
  const notificationTypes = [
    {
      key: 'bookingConfirmation',
      title: 'Booking Confirmations',
      description: 'Receive confirmations when your bookings are confirmed',
      icon: Check,
      priority: 'high'
    },
    {
      key: 'bookingReminder',
      title: 'Booking Reminders',
      description: 'Get reminded about upcoming trips and check-ins',
      icon: Calendar,
      priority: 'high'
    },
    {
      key: 'paymentSuccess',
      title: 'Payment Success',
      description: 'Confirmations for successful payments',
      icon: CreditCard,
      priority: 'high'
    },
    {
      key: 'paymentFailed',
      title: 'Payment Issues',
      description: 'Alerts when payments fail or require attention',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      key: 'tripUpdate',
      title: 'Trip Updates',
      description: 'Changes to your itinerary, delays, or cancellations',
      icon: MapPin,
      priority: 'high'
    },
    {
      key: 'weatherAlert',
      title: 'Weather Alerts',
      description: 'Weather warnings for your destinations',
      icon: AlertTriangle,
      priority: 'medium'
    },
    {
      key: 'promotional',
      title: 'Promotions & Deals',
      description: 'Special offers and discounts on travel packages',
      icon: Award,
      priority: 'low'
    },
    {
      key: 'systemUpdate',
      title: 'System Updates',
      description: 'Important updates about the TravelMate platform',
      icon: Settings,
      priority: 'medium'
    },
    {
      key: 'reviewRequest',
      title: 'Review Requests',
      description: 'Invitations to review your travel experiences',
      icon: MessageSquare,
      priority: 'low'
    },
    {
      key: 'loyaltyReward',
      title: 'Loyalty Rewards',
      description: 'Updates about your loyalty points and rewards',
      icon: Award,
      priority: 'medium'
    },
    {
      key: 'emergencyAlert',
      title: 'Emergency Alerts',
      description: 'Critical safety information and emergency contacts',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      key: 'priceAlert',
      title: 'Price Alerts',
      description: 'Notifications when prices drop for saved trips',
      icon: CreditCard,
      priority: 'medium'
    },
    {
      key: 'socialActivity',
      title: 'Social Activity',
      description: 'Updates from friends and travel community',
      icon: MessageSquare,
      priority: 'low'
    },
    {
      key: 'securityAlert',
      title: 'Security Alerts',
      description: 'Account security notifications and login alerts',
      icon: AlertTriangle,
      priority: 'high'
    }
  ];

  // Load settings on component mount
  useEffect(() => {
    if (clerkUser) {
      fetchSettings();
    }
  }, [clerkUser]);

  if (!clerkUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please sign in to manage your notification settings.</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-gray-600 mt-1">Manage how you receive notifications from TravelMate</p>
          </div>
          {saved && (
            <div className="flex items-center text-green-600">
              <Check className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Settings saved!</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-6 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 space-y-8">
          {/* Global Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications via email</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => toggleGlobalSetting('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Push Notifications</div>
                    <div className="text-sm text-gray-500">Receive push notifications in your browser</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => toggleGlobalSetting('pushNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">SMS Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications via text message</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={() => toggleGlobalSetting('smsNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Type Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Type Settings</h2>
            <div className="space-y-4">
              {notificationTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div key={type.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{type.title}</span>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(type.priority)}`}>
                              {type.priority}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Email */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Email</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[type.key]?.email ?? true}
                            onChange={() => toggleNotificationSetting(type.key, 'email')}
                            disabled={!settings.emailNotifications}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                        </label>
                      </div>

                      {/* Push */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">Push</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[type.key]?.push ?? true}
                            onChange={() => toggleNotificationSetting(type.key, 'push')}
                            disabled={!settings.pushNotifications}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600 disabled:opacity-50"></div>
                        </label>
                      </div>

                      {/* SMS */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-700">SMS</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[type.key]?.sms ?? false}
                            onChange={() => toggleNotificationSetting(type.key, 'sms')}
                            disabled={!settings.smsNotifications}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 disabled:opacity-50"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;