import React, { useState, useEffect } from 'react';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { 
  DollarSign, Users, ShoppingBag, Heart, TrendingUp, 
  Calendar, MapPin, Star, Award, Clock, Package, 
  Leaf, ChevronRight, Plus, Filter
} from 'lucide-react';

interface ConsumerDashboardProps {
  className?: string;
}

interface ConsumerStats {
  totalSavings: number;
  groupsJoined: number;
  ordersCompleted: number;
  favoriteFarmers: number;
  achievementsUnlocked: number;
  thisMonthSavings: number;
}

interface GroupParticipation {
  id: string;
  groupName: string;
  productName: string;
  farmerName: string;
  farmerAvatar: string;
  quantity: number;
  unitPrice: number;
  savings: number;
  status: 'active' | 'completed' | 'expired';
  deadline: string;
  progress: number;
}

interface FavoriteFarmer {
  id: string;
  name: string;
  avatar: string;
  region: string;
  specialties: string[];
  rating: number;
  totalProducts: number;
  lastInteraction: string;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<ConsumerStats>({
    totalSavings: 156,
    groupsJoined: 12,
    ordersCompleted: 8,
    favoriteFarmers: 5,
    achievementsUnlocked: 7,
    thisMonthSavings: 34
  });

  const [groupParticipations, setGroupParticipations] = useState<GroupParticipation[]>([
    {
      id: '1',
      groupName: 'Fresh Organic Tomatoes',
      productName: 'Cherry Tomatoes',
      farmerName: "Sarah's Green Valley",
      farmerAvatar: 'https://ui-avatars.com/api/?name=Sarah&background=22c55e&color=fff',
      quantity: 3,
      unitPrice: 4.20,
      savings: 2.10,
      status: 'active',
      deadline: '2025-06-07T10:00:00Z',
      progress: 75
    },
    {
      id: '2',
      groupName: 'Heritage Apple Collection',
      productName: 'Heirloom Apples',
      farmerName: "Miguel's Heritage Groves",
      farmerAvatar: 'https://ui-avatars.com/api/?name=Miguel&background=f59e0b&color=fff',
      quantity: 5,
      unitPrice: 4.95,
      savings: 5.25,
      status: 'completed',
      deadline: '2025-06-01T15:00:00Z',
      progress: 100
    }
  ]);

  const [favoriteFarmers, setFavoriteFarmers] = useState<FavoriteFarmer[]>([
    {
      id: '1',
      name: "Sarah's Green Valley",
      avatar: 'https://ui-avatars.com/api/?name=Sarah&background=22c55e&color=fff',
      region: 'Organic Certified',
      specialties: ['Organic Vegetables', 'Seasonal Herbs'],
      rating: 4.9,
      totalProducts: 12,
      lastInteraction: '2 days ago'
    },
    {
      id: '2',
      name: "Chen's Mountain Fresh",
      avatar: 'https://ui-avatars.com/api/?name=Chen&background=3b82f6&color=fff',
      region: 'Local Area',
      specialties: ['Mountain Herbs', 'Wild Greens'],
      rating: 4.8,
      totalProducts: 8,
      lastInteraction: '1 week ago'
    }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    // Simulate API calls - replace with actual Supabase queries
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const achievements = [
    { id: 1, title: 'First Group Buy', description: 'Joined your first group purchase', completed: true, icon: Users },
    { id: 2, title: 'Savvy Shopper', description: 'Saved $50 through group buying', completed: true, icon: DollarSign },
    { id: 3, title: 'Local Supporter', description: 'Purchased from 5 different farmers', completed: true, icon: Heart },
    { id: 4, title: 'Community Builder', description: 'Invited 3 friends to groups', completed: false, icon: Users },
    { id: 5, title: 'Eco Champion', description: 'Bought 50lbs of organic produce', completed: false, icon: Leaf }
  ];

  const quickActions = [
    { label: 'Browse Products', href: '/products', icon: Package, color: 'bg-green-500' },
    { label: 'Join Active Groups', href: '/groups', icon: Users, color: 'bg-blue-500' },
    { label: 'Find New Farmers', href: '/farmers', icon: Heart, color: 'bg-red-500' },
    { label: 'Track Orders', href: '/orders', icon: ShoppingBag, color: 'bg-yellow-500' }
  ];

  if (loading) {
    return (
      <div className={className}>
        <LoadingSpinner message="Loading your consumer dashboard..." />
      </div>
    );
  }

  const savingsPercentage = stats.thisMonthSavings > 0 ? '+12%' : '0%';

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.displayName}! 🛒</h2>
            <p className="text-blue-100">
              You've saved <span className="font-bold">${stats.totalSavings}</span> by shopping with local farmers
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-blue-100">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.groupsJoined}</div>
              <div className="text-xs">Groups Joined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.favoriteFarmers}</div>
              <div className="text-xs">Favorite Farmers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Savings', value: `$${stats.totalSavings}`, icon: DollarSign, color: 'text-green-600', change: savingsPercentage },
          { label: 'Groups Joined', value: stats.groupsJoined, icon: Users, color: 'text-blue-600', change: '+3 this month' },
          { label: 'Orders Completed', value: stats.ordersCompleted, icon: ShoppingBag, color: 'text-purple-600', change: '+2 this week' },
          { label: 'Favorite Farmers', value: stats.favoriteFarmers, icon: Heart, color: 'text-red-600', change: '+1 this month' },
          { label: 'Achievements', value: stats.achievementsUnlocked, icon: Award, color: 'text-yellow-600', change: '7 of 12' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <MaterialButton
                key={index}
                href={action.href}
                variant="outlined"
                className="flex flex-col items-center justify-center h-20 space-y-2"
                fullWidth
              >
                <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                  <IconComponent className={`w-5 h-5 ${action.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </MaterialButton>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active & Recent Groups */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Group Buys</h3>
              <MaterialButton
                href="/groups"
                variant="text"
                size="small"
                iconType="arrow"
                icon="trailing"
              >
                View All
              </MaterialButton>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {groupParticipations.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={group.farmerAvatar}
                      alt={group.farmerName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{group.productName}</p>
                      <p className="text-sm text-gray-600">by {group.farmerName}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    group.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    group.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {group.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div>Quantity: <span className="font-medium">{group.quantity} items</span></div>
                  <div>Price: <span className="font-medium">${group.unitPrice}</span></div>
                  <div>Your Savings: <span className="font-medium text-green-600">${group.savings}</span></div>
                  <div>Progress: <span className="font-medium">{group.progress}%</span></div>
                </div>

                {group.status === 'active' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Group Progress</span>
                      <span>{group.progress}% to target</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${group.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Ends {new Date(group.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Farmers */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Favorite Farmers</h3>
              <MaterialButton
                href="/farmers"
                variant="text"
                size="small"
                iconType="plus"
                icon="leading"
              >
                Find More
              </MaterialButton>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {favoriteFarmers.map((farmer) => (
              <div key={farmer.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-12 h-12 rounded-full border-2 border-green-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{farmer.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{farmer.region}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span>{farmer.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {farmer.specialties.slice(0, 2).map((specialty, i) => (
                      <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <MaterialButton
                  variant="text"
                  size="small"
                  iconType="custom"
                  customIcon={<ChevronRight className="w-4 h-4" />}
                  icon="only"
                  href={`/farmers/${farmer.id}`}
                />
              </div>
            ))}
            
            {favoriteFarmers.length === 0 && (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No favorite farmers yet</p>
                <MaterialButton
                  href="/farmers"
                  iconType="plus"
                  icon="leading"
                  size="small"
                >
                  Discover Local Farmers
                </MaterialButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Achievements</h3>
          <p className="text-sm text-gray-600">Earn badges by participating in the UGLIES community</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.completed
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      achievement.completed
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <p className={`font-medium text-sm mb-1 ${
                      achievement.completed ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </p>
                    <p className={`text-xs ${
                      achievement.completed ? 'text-yellow-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Savings Trend */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Savings This Month</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-green-600">${stats.thisMonthSavings}</p>
              <p className="text-sm text-gray-600">Total saved this month</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">+12% vs last month</p>
              <p className="text-xs text-gray-500">Keep up the great work!</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Target: $50</span>
              <span className="font-medium">{Math.round((stats.thisMonthSavings / 50) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.thisMonthSavings / 50) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
