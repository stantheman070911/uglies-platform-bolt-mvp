/**
 * @file src/App.tsx
 * @description Main application component that sets up routing.
 * Adherence to "Violent Psychopath Maintenance Standard":
 * - Clear import statements.
 * - Organized routes.
 * - Consistent use of AppLayout and ThemeProvider.
 * - Suspense for lazy-loaded components (though pages are directly imported here for simplicity).
 */
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';
import { AppLayout } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { ErrorBoundary } from '@/components/monitoring/ErrorBoundary';

// Import all page components.
// For a larger application, consider lazy loading these with React.lazy()
// to improve initial load times, but for the hackathon, direct imports are fine.
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
  SettingsPage,
} from '@/pages';

// Import the new ProductDetailsPage
import ProductDetailsPage from '@/pages/ProductDetailsPage';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppLayout>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <LoadingSpinner
                  size="large"
                  message="Loading page..."
                  timeout={15000}
                />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/*" element={<AuthPage />} />
              
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/groups/create" element={<CreateGroupPage />} />
              <Route path="/groups/:id" element={<GroupDetailsPage />} />
              
              <Route path="/profile" element={<ProfilePage />} />
              
              <Route path="/dashboard" element={<ConsumerDashboardPage />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboardPage />} />
              
              <Route path="/settings" element={<SettingsPage />} />
              
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
                  <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
                  <h2 className="text-3xl font-semibold text-surface-900 mb-3">
                    Page Not Found
                  </h2>
                  <p className="text-surface-600 mb-8 max-w-md">
                    Oops! The page you're looking for seems to have taken a detour. 
                    Let's get you back on track.
                  </p>
                  <MaterialButton 
                    href="/"
                    color="primary"
                    size="large"
                    iconType="home"
                    icon="leading"
                  >
                    Go to Homepage
                  </MaterialButton>
                </div>
              } />
            </Routes>
          </Suspense>
        </AppLayout>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;