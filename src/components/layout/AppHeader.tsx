import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MaterialButton } from '../ui/MaterialButton';
import { useAuth } from '@/hooks/useAuth';
import { 
  Bell, Search, Menu, X, User, Settings, LogOut, 
  Plus, Users, Package, Home, ChevronDown, Sprout,
  MapPin, Star, Heart, ShoppingCart
} from 'lucide-react';

interface AppHeaderProps {
  onMenuToggle?: () => void;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuToggle,
  className = ''
}) => {
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock notifications for demo
  const notifications = [
    { id: 1, type: 'group', message: 'New member joined your tomato group', time: '2 min ago', unread: true },
    { id: 2, type: 'product', message: 'Your carrots are getting popular!', time: '1 hour ago', unread: true },
    { id: 3, type: 'system', message: 'Group buy deadline approaching', time: '3 hours ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'farmer':
        return [
          { icon: Package, label: 'Add Product', href: '/products/create' },
          { icon: Users, label: 'My Groups', href: '/groups/my' }
        ];
      case 'coordinator':
        return [
          { icon: Plus, label: 'Create Group', href: '/groups/create' },
          { icon: Users, label: 'Manage Groups', href: '/groups/manage' }
        ];
      default:
        return [
          { icon: Plus, label: 'Start Group', href: '/groups/create' },
          { icon: Search, label: 'Find Products', href: '/products' }
        ];
    }
  };

  return (
    <header className={`bg-white border-b border-surface-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section - Logo & Mobile Menu */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <MaterialButton
              variant="text"
              size="small"
              onClick={onMenuToggle}
              iconType="menu"
              icon="only"
              className="lg:hidden mr-2"
              ariaLabel="Toggle menu"
            />

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-surface-900">UGLIES</h1>
                <p className="text-xs text-surface-500 -mt-1">Local Agriculture</p>
              </div>
            </Link>
          </div>

          {/* Center Section - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-surface-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, farmers, groups..."
                className="block w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-50 text-sm"
              />
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Actions (Desktop) */}
            <div className="hidden lg:flex items-center space-x-1">
              {getQuickActions().map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <MaterialButton
                    key={index}
                    variant="text"
                    size="small"
                    href={action.href}
                    className="text-surface-600 hover:text-surface-900"
                  >
                    <IconComponent className="w-4 h-4 mr-1" />
                    {action.label}
                  </MaterialButton>
                );
              })}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <MaterialButton
                variant="text"
                size="small"
                onClick={() => setShowNotifications(!showNotifications)}
                iconType="bell"
                icon="only"
                badge={unreadCount > 0 ? unreadCount : undefined}
                ariaLabel="Notifications"
              />

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-surface-200 z-50">
                  <div className="p-3 border-b border-surface-100">
                    <h3 className="font-semibold text-surface-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-surface-50 hover:bg-surface-50 ${
                          notification.unread ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? 'bg-primary-500' : 'bg-surface-300'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-surface-900">{notification.message}</p>
                            <p className="text-xs text-surface-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-surface-100">
                    <MaterialButton
                      variant="text"
                      size="small"
                      fullWidth
                      className="text-primary-600"
                    >
                      View all notifications
                    </MaterialButton>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <img
                  src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.displayName}&background=007AFF&color=fff`}
                  alt={user?.displayName || 'User'}
                  className="w-8 h-8 rounded-full border-2 border-primary-100"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-surface-900">{user?.displayName}</p>
                  <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-surface-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-surface-200 z-50">
                  <div className="p-3 border-b border-surface-100">
                    <p className="font-medium text-surface-900">{user?.displayName}</p>
                    <p className="text-sm text-surface-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full capitalize">
                      {user?.role}
                    </span>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100"
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-surface-100 py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-error-700 hover:bg-error-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search (when expanded) */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-surface-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="block w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface-50 text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;