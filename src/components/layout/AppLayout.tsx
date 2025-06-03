import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;