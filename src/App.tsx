import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';
import { AppLayout } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import SupabaseTest from '@/components/SupabaseTest';
import {
  HomePage,
  ProductsPage,
  GroupsPage,
  GroupDetailsPage,
  CreateGroupPage,
  ProfilePage,
  AuthPage
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
            
            {/* Catch-all route */}
            <Route path="*" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-surface-900">
                  Page Not Found
                </h2>
              </div>
            } />
          </Routes>
        </Suspense>
        <SupabaseTest />
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;