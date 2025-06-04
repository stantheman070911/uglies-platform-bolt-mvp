import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';
import { AppLayout } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  HomePage,
  ProductsPage,
  GroupsPage,
  GroupDetailsPage,
  CreateGroupPage,
  ProfilePage,
  AuthPage,
  ConsumerDashboardPage,
  FarmerDashboardPage,
  SettingsPage
} from '@/pages';

function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <Suspense 
          fallback={
            <LoadingSpinner 
              size="large"
              message="Loading..."
              timeout={15000}
            />
          }
        >
          <Routes>
            {/* Core Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/create" element={<CreateGroupPage />} />
            <Route path="/groups/:id" element={<GroupDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<ConsumerDashboardPage />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboardPage />} />
            
            {/* Settings Route */}
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-surface-900">
                  Page Not Found
                </h2>
                <p className="text-surface-600 mt-2">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            } />
          </Routes>
        </Suspense>
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;