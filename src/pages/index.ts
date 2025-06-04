// Pages Index - Complete UGLIES Platform Page Exports
// Re-exports all pages for easy importing throughout the application

// Existing Pages (maintaining your current structure)
export { default as HomePage } from './HomePage';
export { default as ProductsPage } from './ProductsPage';
export { default as GroupsPage } from './GroupsPage';
export { default as GroupDetailsPage } from './GroupDetailsPage';
export { default as CreateGroupPage } from './CreateGroupPage';
export { default as ProfilePage } from './ProfilePage';
export { default as AuthPage } from './AuthPage';

// New Profile Management Pages
export { default as ConsumerDashboardPage } from './ConsumerDashboardPage';
export { default as FarmerDashboardPage } from './FarmerDashboardPage';
export { default as SettingsPage } from './SettingsPage';

// Route configuration for easy integration
export const pageRoutes = [
  // Existing routes (matches your current structure)
  { path: '/', component: 'HomePage', title: 'Home', public: true },
  { path: '/products', component: 'ProductsPage', title: 'Products', public: false },
  { path: '/groups', component: 'GroupsPage', title: 'Group Buys', public: false },
  { path: '/groups/:id', component: 'GroupDetailsPage', title: 'Group Details', public: false },
  { path: '/groups/create', component: 'CreateGroupPage', title: 'Create Group', public: false },
  { path: '/profile', component: 'ProfilePage', title: 'Profile', public: false },
  { path: '/auth', component: 'AuthPage', title: 'Sign In', public: true },
  
  // New profile management routes
  { path: '/dashboard', component: 'ConsumerDashboardPage', title: 'Dashboard', public: false, roles: ['customer', 'coordinator'] },
  { path: '/farmer-dashboard', component: 'FarmerDashboardPage', title: 'Farm Dashboard', public: false, roles: ['farmer'] },
  { path: '/settings', component: 'SettingsPage', title: 'Settings', public: false }
] as const;

// Navigation items for different user roles
export const navigationConfig = {
  customer: [
    { path: '/dashboard', label: 'Dashboard', icon: 'BarChart' },
    { path: '/products', label: 'Products', icon: 'Package' },
    { path: '/groups', label: 'Group Buys', icon: 'Users' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ],
  farmer: [
    { path: '/farmer-dashboard', label: 'Farm Dashboard', icon: 'BarChart' },
    { path: '/products', label: 'My Products', icon: 'Package' },
    { path: '/groups', label: 'Group Buys', icon: 'Users' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ],
  coordinator: [
    { path: '/dashboard', label: 'Dashboard', icon: 'BarChart' },
    { path: '/products', label: 'Products', icon: 'Package' },
    { path: '/groups', label: 'Manage Groups', icon: 'Users' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ]
} as const;

// Helper function to get appropriate dashboard route for user role
export const getDashboardRoute = (userRole: string): string => {
  switch (userRole) {
    case 'farmer':
      return '/farmer-dashboard';
    case 'customer':
    case 'coordinator':
    default:
      return '/dashboard';
  }
};

// Helper function to get navigation items for user role
export const getNavigationForRole = (userRole: string) => {
  return navigationConfig[userRole as keyof typeof navigationConfig] || navigationConfig.customer;
};
