import React, { useState, useEffect } from 'react';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { 
  Settings, Bell, Shield, MapPin, Leaf, Users, 
  Save, ChevronRight, Eye, EyeOff, Smartphone,
  Mail, MessageSquare, Calendar, DollarSign, Award
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('notifications');

  const [settings, setSettings] = useState({
    // Notification preferences
    notifications: {
      groupUpdates: true,
      newProducts: true,
      priceDrops: true,
      orderUpdates: true,
      farmerMessages: true,
      weeklyDigest: false,
      marketingEmails: false,
      smsNotifications: false
    },
    // Privacy settings
    privacy: {
      profileVisibility: 'public',
      showActivity: true,
      allowDirectContact: true,
      showLocation: false,
      dataSharing: false
    },
    // Agricultural preferences
    agricultural: {
      preferredCategories: ['vegetables', 'fruits'],
      qualityPreference: 'premium',
      organicOnly: false,
      localRadius: 25,
      sustainabilityFocus: true,
      seasonalPreference: true
    },
    // Regional targeting
    regional: {
      primaryRegion: user?.region || 'local_area',
      expandedRegions: [],
      deliveryPreferences: ['home', 'pickup'],
      maxDeliveryDistance: 50
    },
    // Group buying preferences
    groupBuying: {
      autoJoinFavorites: false,
      priceAlertThreshold: 10,
      groupSizePreference: 'medium',
      reminderDaysBefore: 1,
      maxGroupsPerMonth: 5
    }
  });

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'agricultural', label: 'Agricultural Preferences', icon: Leaf },
    { id: 'regional', label: 'Regional Settings', icon: MapPin },
    { id: 'groupBuying', label: 'Group Buying', icon: Users },
    { id: 'account', label: 'Account Management', icon: Settings }
  ];

  const regions = [
    { value: 'local_area', label: '🏡 Local Area', description: 'Farms within 25 miles' },
    { value: 'nearby', label: '🌱 Nearby Farms', description: 'Regional agricultural communities' },
    { value: 'urban_farming', label: '🏢 Urban Agriculture', description: 'City-based growing operations' },
    { value: 'organic_certified', label: '🌿 Certified Organic', description: 'Certified organic producers' },
    { value: 'heritage_farms', label: '🌾 Heritage Varieties', description: 'Traditional producers' },
    { value: 'seasonal_local', label: '📅 Seasonal Focus', description: 'Peak season harvest' }
  ];

  const categories = [
    { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'fruits', label: 'Fruits', icon: '🍎' },
    { value: 'grains', label: 'Grains & Legumes', icon: '🌾' },
    { value: 'herbs', label: 'Herbs & Spices', icon: '🌿' }
  ];

  useEffect(() => {
    if (user) {
      // Load user preferences from database
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    // Mock loading user settings - replace with actual Supabase query
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleArrayToggle = (section: string, key: string, value: string) => {
    setSettings(prev => {
      const currentArray = (prev[section as keyof typeof prev] as any)[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [key]: newArray
        }
      };
    });
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveSuccess(false);

    try {
      // Save settings to Supabase
      // const result = await updateUserSettings(user.id, settings);
      
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading settings..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your UGLIES platform preferences</p>
            </div>
            <MaterialButton
              onClick={handleSaveSettings}
              loading={loading}
              iconType="save"
              icon="leading"
              className={saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {saveSuccess ? 'Saved!' : 'Save Changes'}
            </MaterialButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{section.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              
              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                    <p className="text-gray-600 mb-6">Choose how you want to be notified about platform activity</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'groupUpdates', label: 'Group Buy Updates', description: 'When someone joins your groups or groups you participate in' },
                      { key: 'newProducts', label: 'New Products', description: 'When farmers in your preferred regions list new items' },
                      { key: 'priceDrops', label: 'Price Drops & Discounts', description: 'When group discounts become available' },
                      { key: 'orderUpdates', label: 'Order & Delivery Updates', description: 'Status updates for your purchases' },
                      { key: 'farmerMessages', label: 'Direct Messages', description: 'Messages from farmers and coordinators' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of platform activity in your area' },
                      { key: 'marketingEmails', label: 'Marketing Emails', description: 'Platform updates and promotional content' },
                      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Text message alerts for urgent updates' }
                    ].map((notification) => (
                      <label key={notification.key} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                          onChange={(e) => handleSettingChange('notifications', notification.key, e.target.checked)}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{notification.label}</p>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h2>
                    <p className="text-gray-600 mb-6">Control who can see your information and activity</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="public">Public - Anyone can see your profile</option>
                        <option value="community">Community - Only platform members</option>
                        <option value="private">Private - Only people you approve</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'showActivity', label: 'Show Activity Timeline', description: 'Let others see your recent platform activity' },
                        { key: 'allowDirectContact', label: 'Allow Direct Contact', description: 'Farmers and coordinators can message you directly' },
                        { key: 'showLocation', label: 'Show Location', description: 'Display your region publicly' },
                        { key: 'dataSharing', label: 'Analytics Data Sharing', description: 'Help improve the platform with anonymous usage data' }
                      ].map((setting) => (
                        <label key={setting.key} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy[setting.key as keyof typeof settings.privacy]}
                            onChange={(e) => handleSettingChange('privacy', setting.key, e.target.checked)}
                            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{setting.label}</p>
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Agricultural Preferences */}
              {activeSection === 'agricultural' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Agricultural Preferences</h2>
                    <p className="text-gray-600 mb-6">Customize your agricultural interests and preferences</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preferred Product Categories
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <label key={category.value} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={settings.agricultural.preferredCategories.includes(category.value)}
                              onChange={() => handleArrayToggle('agricultural', 'preferredCategories', category.value)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-medium text-gray-900">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quality Preference
                      </label>
                      <select
                        value={settings.agricultural.qualityPreference}
                        onChange={(e) => handleSettingChange('agricultural', 'qualityPreference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="premium">🏆 Premium Grade - Highest quality</option>
                        <option value="standard">✓ Standard Grade - Excellent everyday quality</option>
                        <option value="cosmetic">💝 Cosmetic Seconds - Great taste, minor imperfections</option>
                        <option value="any">🌟 Any Quality - I'm flexible</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'organicOnly', label: 'Organic Products Only', description: 'Show only certified organic products' },
                        { key: 'sustainabilityFocus', label: 'Sustainability Focus', description: 'Prioritize environmentally sustainable farming practices' },
                        { key: 'seasonalPreference', label: 'Seasonal Preference', description: 'Prefer seasonal, locally-grown produce' }
                      ].map((setting) => (
                        <label key={setting.key} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.agricultural[setting.key as keyof typeof settings.agricultural]}
                            onChange={(e) => handleSettingChange('agricultural', setting.key, e.target.checked)}
                            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{setting.label}</p>
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Regional Settings */}
              {activeSection === 'regional' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Regional Settings</h2>
                    <p className="text-gray-600 mb-6">Configure your location preferences and delivery options</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Region
                      </label>
                      <select
                        value={settings.regional.primaryRegion}
                        onChange={(e) => handleSettingChange('regional', 'primaryRegion', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {regions.map((region) => (
                          <option key={region.value} value={region.value}>
                            {region.label} - {region.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Additional Regions of Interest
                      </label>
                      <div className="space-y-2">
                        {regions.filter(r => r.value !== settings.regional.primaryRegion).map((region) => (
                          <label key={region.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={settings.regional.expandedRegions.includes(region.value)}
                              onChange={() => handleArrayToggle('regional', 'expandedRegions', region.value)}
                              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{region.label}</p>
                              <p className="text-sm text-gray-500">{region.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preferred Delivery Methods
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'home', label: '🏠 Home Delivery', description: 'Direct to your door' },
                          { value: 'pickup', label: '🚜 Farm Pickup', description: 'Pick up from farm' },
                          { value: 'market', label: '🏪 Farmers Market', description: 'Meet at market' },
                          { value: 'hub', label: '📍 Community Hub', description: 'Central pickup point' }
                        ].map((method) => (
                          <label key={method.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={settings.regional.deliveryPreferences.includes(method.value)}
                              onChange={() => handleArrayToggle('regional', 'deliveryPreferences', method.value)}
                              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{method.label}</p>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Group Buying Preferences */}
              {activeSection === 'groupBuying' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Buying Preferences</h2>
                    <p className="text-gray-600 mb-6">Customize your group buying experience and notifications</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { key: 'autoJoinFavorites', label: 'Auto-join Favorite Farmers', description: 'Automatically join groups for your favorite farmers (when space available)' }
                      ].map((setting) => (
                        <label key={setting.key} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.groupBuying[setting.key as keyof typeof settings.groupBuying]}
                            onChange={(e) => handleSettingChange('groupBuying', setting.key, e.target.checked)}
                            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{setting.label}</p>
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Alert Threshold (% discount)
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        step="5"
                        value={settings.groupBuying.priceAlertThreshold}
                        onChange={(e) => handleSettingChange('groupBuying', 'priceAlertThreshold', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>5%</span>
                        <span className="font-medium text-green-600">{settings.groupBuying.priceAlertThreshold}%</span>
                        <span>25%</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Get notified when groups reach this discount level</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Group Size
                      </label>
                      <select
                        value={settings.groupBuying.groupSizePreference}
                        onChange={(e) => handleSettingChange('groupBuying', 'groupSizePreference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="small">Small Groups (5-10 people) - More personal</option>
                        <option value="medium">Medium Groups (10-20 people) - Balanced</option>
                        <option value="large">Large Groups (20+ people) - Maximum savings</option>
                        <option value="any">Any Size - I'm flexible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deadline Reminder (days before)
                      </label>
                      <select
                        value={settings.groupBuying.reminderDaysBefore}
                        onChange={(e) => handleSettingChange('groupBuying', 'reminderDaysBefore', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value={1}>1 day before deadline</option>
                        <option value={2}>2 days before deadline</option>
                        <option value={3}>3 days before deadline</option>
                        <option value={0}>No reminders</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Management */}
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Management</h2>
                    <p className="text-gray-600 mb-6">Manage your account settings and data</p>
                  </div>

                  <div className="space-y-4">
                    <MaterialButton
                      variant="outlined"
                      fullWidth
                      className="justify-start"
                      iconType="key"
                      icon="leading"
                    >
                      Change Password
                    </MaterialButton>
                    
                    <MaterialButton
                      variant="outlined"
                      fullWidth
                      className="justify-start"
                      iconType="download"
                      icon="leading"
                    >
                      Download My Data
                    </MaterialButton>

                    <MaterialButton
                      variant="outlined"
                      fullWidth
                      className="justify-start"
                      iconType="upload"
                      icon="leading"
                    >
                      Import Preferences
                    </MaterialButton>

                    <hr className="my-6" />

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-700 mb-4">
                        These actions cannot be undone. Please be careful.
                      </p>
                      <div className="space-y-2">
                        <MaterialButton
                          variant="outlined"
                          color="error"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          iconType="trash"
                          icon="leading"
                        >
                          Delete All Activity History
                        </MaterialButton>
                        <MaterialButton
                          variant="outlined"
                          color="error"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          iconType="user-x"
                          icon="leading"
                        >
                          Deactivate Account
                        </MaterialButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
