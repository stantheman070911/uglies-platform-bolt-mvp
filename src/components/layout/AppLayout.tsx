import React, { useState } from 'react';
import { AppHeader } from './AppHeader';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useAuth } from '@/hooks/useAuth';

interface AppLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showNavigation = true,
  showFooter = true,
  className = ''
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Navigation Sidebar */}
      {showNavigation && (
        <Navigation 
          isOpen={isNavOpen}
          onClose={closeNav}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <AppHeader 
          onMenuToggle={toggleNav}
          isNavOpen={isNavOpen}
        />

        {/* Main Content */}
        <main className={`flex-1 p-4 lg:p-6 ${className}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default AppLayout;