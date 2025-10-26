'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

interface UserPreferences {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    dealUpdates: boolean;
    payoutAlerts: boolean;
    documentAlerts: boolean;
    marketingEmails: boolean;
    systemAnnouncements: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    numberFormat: string;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'investors_only';
    showInvestmentHistory: boolean;
    showActivityStatus: boolean;
    allowDataSharing: boolean;
    allowAnalytics: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
    allowMultipleSessions: boolean;
  };
  dashboard: {
    defaultView: string;
    widgetsEnabled: string[];
    showQuickActions: boolean;
    compactMode: boolean;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch preferences');
      const data = await response.json();
      setPreferences(data.preferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      showMessage('error', 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const updatePreferences = async (category: string, updates: any) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = category === 'general'
        ? '/api/user/preferences'
        : `/api/user/preferences/${category}`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update preferences');
      const data = await response.json();
      setPreferences(data.preferences);
      showMessage('success', 'Settings updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      showMessage('error', 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (!confirm('Are you sure you want to reset all preferences to defaults?')) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to reset preferences');
      const data = await response.json();
      setPreferences(data.preferences);
      showMessage('success', 'Preferences reset to defaults');
    } catch (error) {
      console.error('Error resetting preferences:', error);
      showMessage('error', 'Failed to reset preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'display', label: 'Display', icon: '🎨' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileSettings onUpdate={updatePreferences} saving={saving} />
            )}

            {activeTab === 'notifications' && preferences && (
              <NotificationSettings
                preferences={preferences.notifications}
                onUpdate={(updates: any) => updatePreferences('notifications', updates)}
                saving={saving}
              />
            )}

            {activeTab === 'display' && preferences && (
              <DisplaySettings
                preferences={preferences.display}
                onUpdate={(updates: any) => updatePreferences('display', updates)}
                saving={saving}
              />
            )}

            {activeTab === 'privacy' && preferences && (
              <PrivacySettings
                preferences={preferences.privacy}
                onUpdate={(updates: any) => updatePreferences('privacy', updates)}
                saving={saving}
              />
            )}

            {activeTab === 'security' && preferences && (
              <SecuritySettings
                preferences={preferences.security}
                onUpdate={(updates: any) => updatePreferences('security', updates)}
                saving={saving}
              />
            )}

            {activeTab === 'dashboard' && preferences && (
              <DashboardSettings
                preferences={preferences.dashboard}
                onUpdate={(updates: any) => updatePreferences('dashboard', updates)}
                saving={saving}
              />
            )}
          </div>

          <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between">
            <button
              onClick={resetToDefaults}
              disabled={saving}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfileSettings({ onUpdate, saving }: { onUpdate: any; saving: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
        <p className="text-sm text-gray-500 mb-4">
          Update your profile information in the Profile page. This section is for managing your account preferences.
        </p>
      </div>
    </div>
  );
}

function NotificationSettings({ preferences, onUpdate, saving }: any) {
  const [settings, setSettings] = useState(preferences);

  useEffect(() => {
    setSettings(preferences);
  }, [preferences]);

  const handleToggle = (key: string) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
  };

  const handleSave = () => {
    onUpdate(settings);
  };

  const toggleOptions = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
    { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive important alerts via SMS' },
    { key: 'dealUpdates', label: 'Deal Updates', description: 'Get notified about deal status changes' },
    { key: 'payoutAlerts', label: 'Payout Alerts', description: 'Receive alerts for upcoming and completed payouts' },
    { key: 'documentAlerts', label: 'Document Alerts', description: 'Get notified when new documents are available' },
    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional offers and updates' },
    { key: 'systemAnnouncements', label: 'System Announcements', description: 'Important platform updates and maintenance' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <p className="text-sm text-gray-500 mb-6">
          Choose how you want to be notified about updates and activities
        </p>
      </div>

      <div className="space-y-4">
        {toggleOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{option.label}</p>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </div>
            <button
              onClick={() => handleToggle(option.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[option.key] ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[option.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

function DisplaySettings({ preferences, onUpdate, saving }: any) {
  const [settings, setSettings] = useState(preferences);

  useEffect(() => {
    setSettings(preferences);
  }, [preferences]);

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    onUpdate(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Display Preferences</h3>
        <p className="text-sm text-gray-500 mb-6">
          Customize how information is displayed throughout the platform
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={settings.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
          <select
            value={settings.timeFormat}
            onChange={(e) => handleChange('timeFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="12h">12-hour</option>
            <option value="24h">24-hour</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

function PrivacySettings({ preferences, onUpdate, saving }: any) {
  const [settings, setSettings] = useState(preferences);

  useEffect(() => {
    setSettings(preferences);
  }, [preferences]);

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    onUpdate(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
        <p className="text-sm text-gray-500 mb-6">
          Control your privacy and data sharing preferences
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleChange('profileVisibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="public">Public</option>
            <option value="investors_only">Investors Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Show Investment History</p>
            <p className="text-xs text-gray-500 mt-1">Display your investment history to other users</p>
          </div>
          <button
            onClick={() => handleChange('showInvestmentHistory', !settings.showInvestmentHistory)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.showInvestmentHistory ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showInvestmentHistory ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Show Activity Status</p>
            <p className="text-xs text-gray-500 mt-1">Let others see when you're active on the platform</p>
          </div>
          <button
            onClick={() => handleChange('showActivityStatus', !settings.showActivityStatus)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.showActivityStatus ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showActivityStatus ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Allow Data Sharing</p>
            <p className="text-xs text-gray-500 mt-1">Share anonymized data to improve the platform</p>
          </div>
          <button
            onClick={() => handleChange('allowDataSharing', !settings.allowDataSharing)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.allowDataSharing ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.allowDataSharing ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Allow Analytics</p>
            <p className="text-xs text-gray-500 mt-1">Help us improve by tracking usage patterns</p>
          </div>
          <button
            onClick={() => handleChange('allowAnalytics', !settings.allowAnalytics)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.allowAnalytics ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.allowAnalytics ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

function SecuritySettings({ preferences, onUpdate, saving }: any) {
  const [settings, setSettings] = useState(preferences);

  useEffect(() => {
    setSettings(preferences);
  }, [preferences]);

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    onUpdate(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <p className="text-sm text-gray-500 mb-6">
          Manage your account security and authentication preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
            <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => handleChange('twoFactorEnabled', !settings.twoFactorEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Login Alerts</p>
            <p className="text-xs text-gray-500 mt-1">Get notified of new login attempts</p>
          </div>
          <button
            onClick={() => handleChange('loginAlerts', !settings.loginAlerts)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.loginAlerts ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="5"
            max="1440"
          />
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Allow Multiple Sessions</p>
            <p className="text-xs text-gray-500 mt-1">Stay logged in on multiple devices simultaneously</p>
          </div>
          <button
            onClick={() => handleChange('allowMultipleSessions', !settings.allowMultipleSessions)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.allowMultipleSessions ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.allowMultipleSessions ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

function DashboardSettings({ preferences, onUpdate, saving }: any) {
  const [settings, setSettings] = useState(preferences);

  useEffect(() => {
    setSettings(preferences);
  }, [preferences]);

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    onUpdate(settings);
  };

  const availableWidgets = [
    'portfolio_overview',
    'recent_investments',
    'upcoming_payouts',
    'deal_alerts',
    'market_trends',
    'performance_chart',
  ];

  const toggleWidget = (widget: string) => {
    const current = settings.widgetsEnabled || [];
    const updated = current.includes(widget)
      ? current.filter((w: string) => w !== widget)
      : [...current, widget];
    handleChange('widgetsEnabled', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard Preferences</h3>
        <p className="text-sm text-gray-500 mb-6">
          Customize your dashboard layout and widgets
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
          <select
            value={settings.defaultView}
            onChange={(e) => handleChange('defaultView', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="overview">Overview</option>
            <option value="portfolio">Portfolio</option>
            <option value="deals">Deals</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Enabled Widgets</label>
          <div className="space-y-2">
            {availableWidgets.map((widget) => (
              <div key={widget} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(settings.widgetsEnabled || []).includes(widget)}
                  onChange={() => toggleWidget(widget)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-sm text-gray-700 capitalize">
                  {widget.replace(/_/g, ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Show Quick Actions</p>
            <p className="text-xs text-gray-500 mt-1">Display quick action buttons on dashboard</p>
          </div>
          <button
            onClick={() => handleChange('showQuickActions', !settings.showQuickActions)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.showQuickActions ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showQuickActions ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Compact Mode</p>
            <p className="text-xs text-gray-500 mt-1">Show more content with reduced spacing</p>
          </div>
          <button
            onClick={() => handleChange('compactMode', !settings.compactMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.compactMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.compactMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
