import React, { useState, useEffect } from 'react';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProductCard, GroupCard } from '@/components/ui/MaterialCard';
import { useAuth } from '@/hooks/useAuth';
import { ProductService } from '@/services/products';
import { GroupBuyingService } from '@/services/groups';
import { 
  Plus, Package, Users, TrendingUp, DollarSign,
  Eye, Edit, Calendar, MapPin, Star, BarChart
} from 'lucide-react';

interface FarmerDashboardProps {
  className?: string;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeGroups: 0,
    totalRevenue: 0,
    avgRating: 4.8
  });

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Load farmer's products
      const productsResult = await ProductService.getProducts({
        farmerId: user.id,
        limit: 6
      });

      // Load farmer's groups
      const groupsResult = await GroupBuyingService.getActiveGroups(user.region, 10);

      if (productsResult.success) {
        setProducts(productsResult.data);
        setStats(prev => ({ ...prev, totalProducts: productsResult.data.length }));
      }

      if (groupsResult.success) {
        // Filter groups for this farmer's products
        const farmerGroups = groupsResult.data.filter(group => 
          group.product?.farmer_id === user.id
        );
        setGroups(farmerGroups);
        setStats(prev => ({ ...prev, activeGroups: farmerGroups.length }));
      }

      // Mock additional stats
      setStats(prev => ({
        ...prev,
        totalRevenue: 2340,
        avgRating: 4.8
      }));

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <LoadingSpinner message="Loading your farm dashboard..." />
      </div>
    );
  }

  const quickStats = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+2 this month'
    },
    {
      label: 'Active Groups',
      value: stats.activeGroups,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+5 this week'
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+12% vs last month'
    },
    {
      label: 'Average Rating',
      value: stats.avgRating,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      change: 'From 234 reviews'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.displayName}! 🌱</h2>
            <p className="text-green-100">
              Here's what's happening with your farm today
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-green-100">
            <MapPin className="w-4 h-4" />
            <span className="text-sm capitalize">{user?.region?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MaterialButton
            href="/products/create"
            iconType="plus"
            icon="leading"
            fullWidth
            color="secondary"
          >
            Add New Product
          </MaterialButton>
          <MaterialButton
            href="/analytics"
            iconType="custom"
            customIcon={<BarChart className="w-4 h-4" />}
            icon="leading"
            variant="outlined"
            fullWidth
          >
            View Analytics
          </MaterialButton>
          <MaterialButton
            href="/orders"
            iconType="package"
            icon="leading"
            variant="outlined"
            fullWidth
          >
            Manage Orders
          </MaterialButton>
        </div>
      </div>

      {/* Products and Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Your Products */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Products</h3>
              <MaterialButton
                href="/products?farmer=me"
                variant="text"
                size="small"
                iconType="arrow"
                icon="trailing"
              >
                View All
              </MaterialButton>
            </div>
          </div>
          
          <div className="p-4">
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No products listed yet</p>
                <MaterialButton
                  href="/products/create"
                  iconType="plus"
                  icon="leading"
                  size="small"
                >
                  Add Your First Product
                </MaterialButton>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.base_price} • {product.inventory_available} available</p>
                    </div>
                    <div className="flex space-x-1">
                      <MaterialButton
                        variant="text"
                        size="small"
                        iconType="edit"
                        icon="only"
                        href={`/products/${product.id}/edit`}
                      />
                      <MaterialButton
                        variant="text"
                        size="small"
                        iconType="custom"
                        customIcon={<Eye className="w-4 h-4" />}
                        icon="only"
                        href={`/products/${product.id}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Group Buys */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Group Buys</h3>
              <MaterialButton
                href="/groups?farmer=me"
                variant="text"
                size="small"
                iconType="arrow"
                icon="trailing"
              >
                View All
              </MaterialButton>
            </div>
          </div>
          
          <div className="p-4">
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No active group buys</p>
                <p className="text-xs text-gray-400">Groups will appear here when customers create them for your products</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groups.slice(0, 2).map((group) => (
                  <div key={group.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{group.product?.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {group.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{group.current_quantity}/{group.target_quantity} items</span>
                      <span>${group.current_price_per_unit} each</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (group.current_quantity / group.target_quantity) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[
              { type: 'group_join', message: 'New member joined your Organic Tomatoes group', time: '2 hours ago' },
              { type: 'product_view', message: 'Your Fresh Basil was viewed 15 times today', time: '4 hours ago' },
              { type: 'group_complete', message: 'Heritage Apples group completed successfully', time: '1 day ago' },
              { type: 'review', message: 'Received 5-star review from Sarah M.', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'group_join' ? 'bg-blue-500' :
                  activity.type === 'product_view' ? 'bg-green-500' :
                  activity.type === 'group_complete' ? 'bg-yellow-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
