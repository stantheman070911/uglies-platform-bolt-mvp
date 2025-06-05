import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MaterialButton } from '../ui/MaterialButton';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, Package, Users, User, BarChart3, Settings,
  Sprout, ShoppingCart, HandHeart, Plus, Search,
  MapPin, Bell, Star, ShieldCheck
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
  const location = useLocation();

  const getNavigationItems = () => {
    const getDashboardItem = () => {
      switch (user?.role) {
        case 'farmer':
          return { icon: BarChart3, label: 'Farm Dashboard', href: '/farmer-dashboard' };
        case 'coordinator':
          return { icon: BarChart3, label: 'Coordinator Dashboard', href: '/coordinator-dashboard' }; 
        default: // customer
          return { icon: BarChart3, label: 'Dashboard', href: '/consumer-dashboard' };
      }
    };

    const dashboardItem = getDashboardItem();

    const commonItems = [
      dashboardItem,
      { icon: Package, label: 'Products', href: '/products' },
      { icon: Users, label: 'Group Buys', href: '/groups', badge: '3' }
    ];

    switch (user?.role) {
      case 'farmer':
        return [
          ...commonItems,
          { icon: ShieldCheck, label: 'My Products', href: '/my-products' },
          { icon: Plus, label: 'Add Product', href: '/products/create' },
        ];
      case 'coordinator':
        return [
          ...commonItems,
          { icon: HandHeart, label: 'Coordination', href: '/coordination', badge: '2' },
          { icon: Plus, label: 'Create Group', href: '/groups/create' },
        ];
      default: // customer
        return [
          ...commonItems,
          { icon: ShoppingCart, label: 'My Orders', href: '/orders' },
          { icon: Star, label: 'Favorites', href: '/favorites' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

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
        flex flex-col
        ${className}
      `}>
        <div className="p-4 border-b border-surface-200">
           <Link to="/" className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">UGLIES</span>
          </Link>
        </div>
        
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <MaterialButton
                key={index}
                variant={isActive ? 'filled' : 'text'}
                color={isActive ? 'primary' : 'default'}
                href={item.href}
                fullWidth
                className="justify-start text-surface-700"
                badge={item.badge || undefined}
              >
                <IconComponent className={`w-5 h-5 mr-3 ${isActive ? '' : 'text-surface-500'}`} />
                {item.label}
              </MaterialButton>
            );
          })}
        </div>
        
        <div className="p-2 border-t border-surface-200">
           <MaterialButton
              variant="text"
              href="/profile"
              fullWidth
              className="justify-start text-surface-700"
            >
              <User className="w-5 h-5 mr-3 text-surface-500" />
              Profile
            </MaterialButton>
            <MaterialButton
              variant="text"
              href="/settings"
              fullWidth
              className="justify-start text-surface-700"
            >
              <Settings className="w-5 h-5 mr-3 text-surface-500" />
              Settings
            </MaterialButton> 
        </div>
      </nav>
    </>
  );
};

export default Navigation;