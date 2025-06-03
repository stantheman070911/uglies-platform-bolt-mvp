import React from 'react';
import { Link } from 'react-router-dom';
import { MaterialButton } from '../ui/MaterialButton';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, Package, Users, User, BarChart3, Settings,
  Sprout, ShoppingCart, HandHeart, Plus, Search,
  MapPin, Bell, Star
} from 'lucide-react';

interface NavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  isOpen = true,
  onClose,
  className = ''
}) => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    const commonItems = [
      { icon: Home, label: 'Dashboard', href: '/dashboard', badge: null },
      { icon: Package, label: 'Products', href: '/products', badge: null },
      { icon: Users, label: 'Group Buys', href: '/groups', badge: '3' }
    ];

    switch (user?.role) {
      case 'farmer':
        return [
          ...commonItems,
          { icon: Sprout, label: 'My Farm', href: '/farm', badge: null },
          { icon: BarChart3, label: 'Analytics', href: '/analytics', badge: null },
          { icon: Plus, label: 'Add Product', href: '/products/create', badge: null }
        ];

      case 'coordinator':
        return [
          ...commonItems,
          { icon: HandHeart, label: 'Coordination', href: '/coordination', badge: '2' },
          { icon: MapPin, label: 'Regional Hub', href: '/regional', badge: null },
          { icon: Plus, label: 'Create Group', href: '/groups/create', badge: null }
        ];

      default: // customer
        return [
          ...commonItems,
          { icon: ShoppingCart, label: 'My Orders', href: '/orders', badge: null },
          { icon: Star, label: 'Favorites', href: '/favorites', badge: null },
          { icon: Search, label: 'Discover', href: '/discover', badge: null }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const quickStats = {
    farmer: [
      { label: 'Active Products', value: '12', color: 'text-secondary-600' },
      { label: 'Total Groups', value: '8', color: 'text-primary-600' },
      { label: 'This Month Sales', value: '$2,340', color: 'text-tertiary-600' }
    ],
    customer: [
      { label: 'Groups Joined', value: '5', color: 'text-secondary-600' },
      { label: 'Money Saved', value: '$127', color: 'text-primary-600' },
      { label: 'Local Farmers', value: '12', color: 'text-tertiary-600' }
    ],
    coordinator: [
      { label: 'Active Coordination', value: '4', color: 'text-secondary-600' },
      { label: 'Community Size', value: '89', color: 'text-primary-600' },
      { label: 'Groups Facilitated', value: '23', color: 'text-tertiary-600' }
    ]
  };

  const currentStats = quickStats[user?.role as keyof typeof quickStats] || quickStats.customer;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Navigation Sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        w-64 bg-white border-r border-surface-200 shadow-lg lg:shadow-none
        ${className}
      `}>
        <div className="flex flex-col h-full">
          
          {/* User Profile Section */}
          <div className="p-4 border-b border-surface-100 bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.displayName}&background=007AFF&color=fff`}
                alt={user?.displayName || 'User'}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-900 truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-sm text-surface-600 capitalize">
                  {user?.role}
                </p>
                <div className="flex items-center mt-1">
                  <MapPin className="w-3 h-3 text-surface-400 mr-1" />
                  <span className="text-xs text-surface-500 capitalize">
                    {user?.region?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-surface-100">
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              {currentStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">{stat.label}</span>
                  <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-3">
              Navigation
            </h3>
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <MaterialButton
                  key={index}
                  variant="text"
                  href={item.href}
                  fullWidth
                  className="justify-start text-surface-700 hover:text-surface-900 hover:bg-surface-100"
                  badge={item.badge || undefined}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.label}
                </MaterialButton>
              );
            })}
          </div>

          {/* Agricultural Theme Section */}
          <div className="p-4 border-t border-surface-100 bg-gradient-to-r from-secondary-50 to-primary-50">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Sprout className="w-4 h-4 text-secondary-600" />
                <span className="text-sm font-medium text-surface-700">Supporting Local Agriculture</span>
              </div>
              <p className="text-xs text-surface-500">
                Building sustainable farming communities worldwide
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className="p-4 border-t border-surface-100">
            <MaterialButton
              variant="text"
              href="/settings"
              fullWidth
              className="justify-start text-surface-600 hover:text-surface-900"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </MaterialButton>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;