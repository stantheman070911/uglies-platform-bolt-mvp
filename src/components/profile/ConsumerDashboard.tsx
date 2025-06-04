import React, { useState, useEffect } from 'react';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { 
  DollarSign, Users, ShoppingBag, Heart, TrendingUp, 
  Calendar, MapPin, Star, Award, Clock, Package, 
  Leaf, ChevronRight, Plus, Filter, Sparkles, Target,
  TrendingDown, Eye, MessageCircle
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
  productImage: string;
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
  coverImage: string;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<ConsumerStats>({
    totalSavings: 247,
    groupsJoined: 15,
    ordersCompleted: 12,
    favoriteFarmers: 8,
    achievementsUnlocked: 9,
    thisMonthSavings: 67
  });

  const [groupParticipations, setGroupParticipations] = useState<GroupParticipation[]>([
    {
      id: '1',
      groupName: 'Organic Summer Harvest',
      productName: 'Heritage Tomatoes',
      farmerName: "Sarah's Valley Farm",
      farmerAvatar: 'https://images.unsplash.com/photo-1594736797933-d0c6e8b58b3c?w=150&h=150&fit=crop&crop=face',
      quantity: 4,
      unitPrice: 5.20,
      savings: 3.80,
      status: 'active',
      deadline: '2025-06-07T14:00:00Z',
      progress: 82,
      productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      groupName: 'Fresh Greens Collective',
      productName: 'Baby Spinach & Arugula',
      farmerName: "Chen's Mountain Fresh",
      farmerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      quantity: 2,
      unitPrice: 3.75,
      savings: 2.25,
      status: 'active',
      deadline: '2025-06-09T16:00:00Z',
      progress: 65,
      productImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop'
    }
  ]);

  const [favoriteFarmers, setFavoriteFarmers] = useState<FavoriteFarmer[]>([
    {
      id: '1',
      name: "Sarah's Valley Farm",
      avatar: 'https://images.unsplash.com/photo-1594736797933-d0c6e8b58b3c?w=150&h=150&fit=crop&crop=face',
      region: 'Organic Certified',
      specialties: ['Heritage Tomatoes', 'Seasonal Herbs'],
      rating: 4.9,
      totalProducts: 15,
      lastInteraction: '2 days ago',
      coverImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      name: "Chen's Mountain Fresh",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      region: 'Local Area',
      specialties: ['Mountain Greens', 'Wild Herbs'],
      rating: 4.8,
      totalProducts: 12,
      lastInteraction: '5 days ago',
      coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop'
    }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    // Simulate API calls - replace with actual Supabase queries
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
  };

  const quickActions = [
    { 
      label: 'Browse Fresh Produce', 
      href: '/products', 
      icon: Package, 
      gradient: 'from-green-400 to-green-600',
      description: 'Discover local farmers'
    },
    { 
      label: 'Join Active Groups', 
      href: '/groups', 
      icon: Users, 
      gradient: 'from-blue-400 to-blue-600',
      description: 'Save money together'
    },
    { 
      label: 'Find New Farmers', 
      href: '/farmers', 
      icon: Heart, 
      gradient: 'from-pink-400 to-pink-600',
      description: 'Build connections'
    },
    { 
      label: 'Track Your Impact', 
      href: '/impact', 
      icon: Leaf, 
      gradient: 'from-emerald-400 to-emerald-600',
      description: 'See your difference'
    }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center ${className}`}>
        <div className="glass-card p-8 rounded-3xl">
          <LoadingSpinner message="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="glass-card rounded-3xl p-8 relative">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 bg-clip-text text-transparent">
                      Welcome back, {user?.displayName}! 
                    </h1>
                    <p className="text-gray-600 text-lg">
                      You're building a sustainable food future 🌱
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="font-medium">${stats.totalSavings} saved this year</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{stats.favoriteFarmers} local farmers supported</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span className="font-medium capitalize">{user?.region?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Stats Display */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Saved', value: `$${stats.totalSavings}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
                  { label: 'Groups', value: stats.groupsJoined, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { label: 'Orders', value: stats.ordersCompleted, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
                  { label: 'Achievements', value: stats.achievementsUnlocked, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-100' }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="glass-card-mini rounded-2xl p-4 text-center hover-lift">
                      <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <MaterialButton
                  key={index}
                  href={action.href}
                  className="group relative overflow-hidden rounded-2xl p-6 text-left bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300"
                  fullWidth
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </MaterialButton>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Groups */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Active Group Buys
              </h2>
              <MaterialButton
                href="/groups"
                variant="text"
                size="small"
                className="text-blue-600 hover:bg-blue-50"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </MaterialButton>
            </div>
            
            <div className="space-y-4">
              {groupParticipations.map((group) => (
                <div key={group.id} className="group-card rounded-2xl p-5 hover-lift cursor-pointer">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={group.productImage}
                        alt={group.productName}
                        className="w-20 h-20 rounded-xl object-cover shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{group.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">{group.productName}</h3>
                          <p className="text-sm text-gray-600">{group.groupName}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">${group.unitPrice}</div>
                          <div className="text-sm text-green-600 font-medium">Save ${group.savings}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={group.farmerAvatar}
                          alt={group.farmerName}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        />
                        <span className="text-sm text-gray-600">{group.farmerName}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{group.quantity} items</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Group Progress</span>
                          <span>{group.progress}% to target</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500 relative"
                            style={{ width: `${group.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Ends {new Date(group.deadline).toLocaleDateString()}</span>
                          </div>
                          <span className="text-green-600 font-medium">
                            {Math.round((group.progress / 100) * 20)} of 20 people joined
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Farmers */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Favorite Farmers
              </h2>
              <MaterialButton
                href="/farmers"
                variant="text"
                size="small"
                className="text-pink-600 hover:bg-pink-50"
              >
                Discover <ChevronRight className="w-4 h-4 ml-1" />
              </MaterialButton>
            </div>
            
            <div className="space-y-4">
              {favoriteFarmers.map((farmer) => (
                <div key={farmer.id} className="farmer-card rounded-2xl overflow-hidden hover-lift cursor-pointer">
                  <div className="relative h-24 bg-gradient-to-r from-green-400 to-blue-500">
                    <img
                      src={farmer.coverImage}
                      alt={`${farmer.name} farm`}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                  </div>
                  
                  <div className="p-4 -mt-8 relative">
                    <div className="flex items-start gap-4">
                      <img
                        src={farmer.avatar}
                        alt={farmer.name}
                        className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg bg-white"
                      />
                      <div className="flex-1 pt-2">
                        <h3 className="font-semibold text-gray-900">{farmer.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{farmer.region}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{farmer.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {farmer.specialties.slice(0, 2).map((specialty, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <MaterialButton
                          variant="text"
                          size="small"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </MaterialButton>
                        <span className="text-xs text-gray-500">{farmer.lastInteraction}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Impact */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Your Impact This Month
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (stats.thisMonthSavings / 100))}`}
                    className="text-green-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">${stats.thisMonthSavings}</div>
                    <div className="text-xs text-gray-600">Saved</div>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Money Saved</h3>
              <p className="text-sm text-gray-600">Through group buying</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.groupsJoined}</div>
                  <div className="text-xs text-blue-600">Groups</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Groups Joined</h3>
              <p className="text-sm text-gray-600">Building community</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.favoriteFarmers}</div>
                  <div className="text-xs text-purple-600">Farmers</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Farmers Supported</h3>
              <p className="text-sm text-gray-600">Local relationships</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;