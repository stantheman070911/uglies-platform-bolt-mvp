```typescript
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { UserProfile } from '@/components/profile/UserProfile';
import { FarmerProfile } from '@/components/profile/FarmerProfile';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, Clock, Settings, Heart,
  Package, Users, Star, Award
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const recentActivity = [
    { type: 'group_join', message: 'Joined Organic Tomatoes group buy', time: '2 hours ago' },
    { type: 'product_view', message: 'Viewed Fresh Basil', time: '4 hours ago' },
    { type: 'group_complete', message: 'Completed Heritage Apples group', time: '1 day ago' },
    { type: 'review', message: 'Left a review for Green Valley Farms', time: '2 days ago' }
  ];

  const achievements = [
    { title: 'First Group Buy', description: 'Joined your first group buy', earned: true },
    { title: 'Community Builder', description: 'Created 5 successful groups', earned: user.role === 'farmer' },
    { title: 'Loyal Customer', description: 'Made 10 purchases', earned: user.role === 'customer' },
    { title: 'Local Hero', description: 'Supported 20+ local farmers', earned: false }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tabs Navigation */}
      <div className="mb-8 border-b border-surface-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                  }
                `}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <>
            <UserProfile />
            {user.role === 'farmer' && <FarmerProfile />}
          </>
        )}

        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.type === 'group_join' ? 'bg-blue-500' :
                      activity.type === 'product_view' ? 'bg-green-500' :
                      activity.type === 'group_complete' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`} />
                    <div>
                      <p className="text-surface-900">{activity.message}</p>
                      <p className="text-sm text-surface-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-6">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-yellow-50' : 'bg-surface-50'
                  }`}>
                    <Award className={`w-6 h-6 ${
                      achievement.earned ? 'text-yellow-500' : 'text-surface-400'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        achievement.earned ? 'text-surface-900' : 'text-surface-500'
                      }`}>
                        {achievement.title}
                      </p>
                      <p className="text-sm text-surface-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { id: 'group_updates', label: 'Group buy updates', description: 'When someone joins your groups' },
                  { id: 'new_products', label: 'New products', description: 'When farmers in your area list new items' },
                  { id: 'price_drops', label: 'Price drops', description: 'When group discounts become available' }
                ].map((setting) => (
                  <label key={setting.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-surface-300 rounded"
                    />
                    <div>
                      <p className="font-medium text-surface-900">{setting.label}</p>
                      <p className="text-sm text-surface-500">{setting.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-surface-300 rounded"
                  />
                  <span className="text-surface-900">Show my activity to other users</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-surface-300 rounded"
                  />
                  <span className="text-surface-900">Allow farmers to contact me directly</span>
                </label>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <MaterialButton
                  variant="outlined"
                  fullWidth
                  className="justify-start"
                >
                  Change Password
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  fullWidth
                  className="justify-start"
                >
                  Export My Data
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  color="error"
                  fullWidth
                  className="justify-start"
                >
                  Delete Account
                </MaterialButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
```