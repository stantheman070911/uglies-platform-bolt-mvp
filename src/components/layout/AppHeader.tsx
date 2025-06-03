import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, ShoppingCart, User, 
  ChevronDown, Search, Globe 
} from 'lucide-react';
import Navigation from './Navigation';

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-green-700 font-bold text-2xl mr-2">
                UGLIES
              </span>
              <span className="text-yellow-600 text-sm hidden sm:block">
                Global Agricultural Marketplace
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation />
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Search size={20} className="text-surface-600" />
            </button>
            
            <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
              <ShoppingCart size={20} className="text-surface-600" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>
            
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-gray-100 flex items-center">
                <User size={20} className="text-surface-600" />
                <ChevronDown size={16} className="text-surface-600" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                <Link to="/login" className="block px-4 py-2 text-sm text-surface-700 hover:bg-gray-100">
                  Sign In
                </Link>
                <Link to="/register" className="block px-4 py-2 text-sm text-surface-700 hover:bg-gray-100">
                  Register
                </Link>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X size={24} className="text-surface-600" />
              ) : (
                <Menu size={24} className="text-surface-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Search Bar (conditional) */}
        {isSearchOpen && (
          <div className="py-3 border-t border-surface-300">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for fruits, vegetables, or farmers..."
                className="w-full py-2 pl-10 pr-4 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
              />
            </div>
          </div>
        )}
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-surface-300">
            <Navigation isMobile={true} />
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;