import React, { useState } from 'react';
import { MaterialButton } from '../ui/MaterialButton';
import { MaterialInput } from '../ui/MaterialInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { 
  Camera, MapPin, Calendar, Star, 
  Package, Users, Heart, Award 
} from 'lucide-react';

interface UserProfileProps {
  onEditComplete?: () => void;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  onEditComplete,
  className = ''
}) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
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

  const getUserStats = () => {
    switch (user?.role) {
      case 'farmer':
        return [
          { label: 'Products Listed', value: user.stats?.products || 0, icon: Package, color: 'text-green-600' },
          { label: 'Groups Created', value: user.stats?.groups || 0, icon: Users, color: 'text-blue-600' },
          { label: 'Total Sales', value: '$2,340', icon: Star, color: 'text-yellow-600' }
        ];
      case 'coordinator':
        return [
          { label: 'Groups Managed', value: user.stats?.groups || 0, icon: Users, color: 'text-blue-600' },
          { label: 'Total Facilitated', value: '$12,450', icon: Star, color: 'text-yellow-600' },
          { label: 'Member Rating', value: '4.9', icon: Award, color: 'text-purple-600' }
        ];
      default: // customer
        return [
          { label: 'Groups Joined', value: user.stats?.participations || 0, icon: Users, color: 'text-blue-600' },
          { label: 'Money Saved', value: '$156', icon: Star, color: 'text-yellow-600' },
          { label: 'Favorite Farmers', value: '8', icon: Heart, color: 'text-red-600' }
        ];
    }
  };

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockUrl = \`https://ui-avatars.com/api/?name=${formData.displayName}&background=22c55e&color=fff`;
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
        onEditComplete?.();
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

  if (!user) return null;

  const stats = getUserStats();

  return (
    <div className={\`space-y-6 ${className}`}>
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white p-1">
                {imageUploading ? (
                  <div className="w-full h-full rounded-full bg-surface-100 flex items-center justify-center">
                    <LoadingSpinner size="small" />
                  </div>
                ) : (
                  <img
                    src={formData.avatarUrl || \`https://ui-avatars.com/api/?name=${user.displayName}&background=22c55e&color=fff`}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-surface-50">
                  <Camera className="w-4 h-4 text-surface-600" />
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
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg text-surface-900"
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
                    className="bg-white text-green-700 hover:bg-surface-50"
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
                  className="bg-white text-green-700 hover:bg-surface-50"
                >
                  Edit Profile
                </MaterialButton>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="px-6 py-4">
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={handleInputChange('bio')}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          ) : (
            <p className="text-surface-700">
              {user.bio || (
                <span className="text-surface-500 italic">
                  No bio added yet.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 p-6 border-t border-surface-200">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={\`inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-100 mb-2`}>
                  <IconComponent className={\`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-xl font-bold text-surface-900">{stat.value}</div>
                <div className="text-sm text-surface-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-error-700 text-sm">{errors.submit}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
```