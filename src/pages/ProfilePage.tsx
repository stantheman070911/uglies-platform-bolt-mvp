// Replace with complete enhanced ProfilePage:
import React, { useState, useEffect } from 'react';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, MapPin, Camera, Edit, Save, X, 
  Package, Users, TrendingUp, Star, Calendar,
  Settings, Award, Heart
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
    region: user?.region || 'local_area'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const regions = [
    { value: 'local_area', label: '🏡 Local Area' },
    { value: 'nearby', label: '🌱 Nearby Farms' },
    { value: 'urban_farming', label: '🏢 Urban Agriculture' },
    { value: 'organic_certified', label: '🌿 Certified Organic' },
    { value: 'heritage_farms', label: '🌾 Heritage Varieties' },
    { value: 'seasonal_local', label: '📅 Seasonal Focus' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        region: user.region || 'local_area'
      });
    }
  }, [user]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      // Mock image upload - replace with actual Supabase storage upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockUrl = `https://ui-avatars.com/api/?name=${formData.displayName}&background=22c55e&color=fff&size=200`;
      setFormData(prev => ({ ...prev, avatarUrl: mockUrl }));
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await updateProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        region: formData.region
      });

      if (result.success) {
        setIsEditing(false);
      } else {
        setErrors({ submit: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatarUrl || '',
      region: user?.region || 'local_area'
    });
    setErrors({});
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  const getUserStats = () => {
    switch (user.role) {
      case 'farmer':
        return [
          { label: 'Products Listed', value: user.stats?.products || 0, icon: Package, color: 'text-green-600' },
          { label: 'Groups Created', value: user.stats?.groups || 0, icon: Users, color: 'text-blue-600' },
          { label: 'Total Sales', value: '$2,340', icon: TrendingUp, color: 'text-yellow-600' },
          { label: 'Rating', value: '4.8', icon: Star, color: 'text-yellow-500' }
        ];
      case 'coordinator':
        return [
          { label: 'Groups Managed', value: user.stats?.groups || 0, icon: Users, color: 'text-blue-600' },
          { label: 'Communities', value: '3', icon: MapPin, color: 'text-green-600' },
          { label: 'Total Facilitated', value: '$12,450', icon: TrendingUp, color: 'text-yellow-600' },
          { label: 'Member Rating', value: '4.9', icon: Star, color: 'text-yellow-500' }
        ];
      default: // customer
        return [
          { label: 'Groups Joined', value: user.stats?.participations || 0, icon: Users, color: 'text-blue-600' },
          { label: 'Orders Placed', value: '12', icon: Package, color: 'text-green-600' },
          { label: 'Money Saved', value: '$156', icon: TrendingUp, color: 'text-yellow-600' },
          { label: 'Favorite Farmers', value: '8', icon: Heart, color: 'text-red-500' }
        ];
    }
  };

  const stats = getUserStats();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white p-1">
                {imageUploading ? (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <LoadingSpinner size="small" />
                  </div>
                ) : (
                  <img
                    src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${user.displayName}&background=22c55e&color=fff`}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white">
              {isEditing ? (
                <div className="space-y-3">
                  <MaterialInput
                    value={formData.displayName}
                    onChange={handleInputChange('displayName')}
                    error={errors.displayName}
                    className="bg-white"
                    fullWidth
                  />
                  <select
                    value={formData.region}
                    onChange={handleInputChange('region')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    {regions.map(region => (
                      <option key={region.value} value={region.value}>{region.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-1">{user.displayName}</h1>
                  <div className="flex items-center gap-4 text-green-100">
                    <span className="capitalize bg-green-800 px-2 py-1 rounded-full text-sm">
                      {user.role}
                    </span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm capitalize">
                        {user.region?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <MaterialButton
                    onClick={handleSave}
                    loading={loading}
                    disabled={loading}
                    iconType="save"
                    icon="leading"
                    className="bg-white text-green-700 hover:bg-gray-50"
                  >
                    Save
                  </MaterialButton>
                  <MaterialButton
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading}
                    iconType="close"
                    icon="only"
                    className="border-white text-white hover:bg-white hover:bg-opacity-10"
                  />
                </>
              ) : (
                <MaterialButton
                  onClick={() => setIsEditing(true)}
                  iconType="edit"
                  icon="leading"
                  className="bg-white text-green-700 hover:bg-gray-50"
                >
                  Edit Profile
                </MaterialButton>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={handleInputChange('bio')}
              placeholder={
                user.role === 'farmer' 
                  ? "Tell people about your farm, growing methods, and what makes your produce special..."
                  : "Share a bit about yourself and your interests in local agriculture..."
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          ) : (
            <p className="text-gray-700">
              {user.bio || (
                <span className="text-gray-500 italic">
                  {user.role === 'farmer' 
                    ? "This farmer hasn't shared their story yet."
                    : "This user hasn't added a bio yet."}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Content Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-2 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Joined group buy', item: 'Organic Tomatoes', time: '2 hours ago', type: 'join' },
                    { action: 'Listed new product', item: 'Fresh Basil', time: '1 day ago', type: 'product' },
                    { action: 'Completed group', item: 'Heritage Apples', time: '3 days ago', type: 'complete' }
                  ].filter((_, i) => user.role === 'farmer' ? true : i !== 1).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'join' ? 'bg-blue-500' :
                          activity.type === 'product' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.item}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  {[
                    { title: 'First Group Buy', description: 'Joined your first group buy', earned: true },
                    { title: 'Community Builder', description: 'Created 5 successful groups', earned: user.role === 'farmer' },
                    { title: 'Loyal Customer', description: 'Made 10 purchases', earned: user.role === 'customer' },
                    { title: 'Local Hero', description: 'Supported 20+ local farmers', earned: false }
                  ].map((achievement, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-2 rounded ${
                      achievement.earned ? 'bg-yellow-50' : 'bg-gray-50'
                    }`}>
                      <Award className={`w-6 h-6 ${
                        achievement.earned ? 'text-yellow-500' : 'text-gray-400'
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          achievement.earned ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {[
                  { date: 'Today', activities: ['Joined Organic Tomatoes group', 'Updated profile bio'] },
                  { date: 'Yesterday', activities: ['Listed Fresh Basil', 'Completed Apple group delivery'] },
                  { date: '3 days ago', activities: ['Created new group buy', 'Received 5-star rating'] }
                ].map((day, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-gray-900 mb-2">{day.date}</h4>
                    <ul className="space-y-1 ml-4">
                      {day.activities.map((activity, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Notification Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'group_updates', label: 'Group buy updates', description: 'When someone joins your groups' },
                    { id: 'new_products', label: 'New products', description: 'When farmers in your area list new items' },
                    { id: 'price_drops', label: 'Price drops', description: 'When group discounts become available' },
                    { id: 'order_updates', label: 'Order updates', description: 'Delivery and pickup notifications' }
                  ].map((setting) => (
                    <label key={setting.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-900">Show my activity to other users</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-900">Allow farmers to contact me directly</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-900">Include me in marketing emails</span>
                  </label>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <MaterialButton
                    variant="outlined"
                    href="/change-password"
                    fullWidth
                    className="justify-start"
                  >
                    Change Password
                  </MaterialButton>
                  <MaterialButton
                    variant="outlined"
                    href="/export-data"
                    fullWidth
                    className="justify-start"
                  >
                    Export My Data
                  </MaterialButton>
                  <MaterialButton
                    variant="outlined"
                    color="error"
                    fullWidth
                    className="justify-start text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete Account
                  </MaterialButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
