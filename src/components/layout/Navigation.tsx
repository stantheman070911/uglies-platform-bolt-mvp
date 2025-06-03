import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, ShoppingBag, Users, 
  BarChart, Heart, Settings
} from 'lucide-react';

interface NavigationProps {
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false }) => {
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={isMobile ? 18 : 16} /> },
    { name: 'Products', path: '/products', icon: <ShoppingBag size={isMobile ? 18 : 16} /> },
    { name: 'Group Buys', path: '/groups', icon: <Users size={isMobile ? 18 : 16} /> },
    { name: 'My Farm', path: '/farm', icon: <BarChart size={isMobile ? 18 : 16} /> },
    { name: 'Favorites', path: '/favorites', icon: <Heart size={isMobile ? 18 : 16} /> },
  ];

  if (isMobile) {
    return (
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="flex items-center space-x-1 text-gray-700 hover:text-green-700 px-1 py-2 border-b-2 border-transparent hover:border-green-500 transition-colors"
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;