// Profile Components Index
// Exports all profile-related components for easy importing

// Existing components
export { default as FarmerDashboard } from './FarmerDashboard';

// New profile management components
export { default as ConsumerDashboard } from './ConsumerDashboard';

// Component types for TypeScript
export type DashboardComponent = React.ComponentType<{
  className?: string;
}>;

// Dashboard component mapping for dynamic rendering
export const dashboardComponents = {
  farmer: FarmerDashboard,
  consumer: ConsumerDashboard,
  customer: ConsumerDashboard, // Alias for consumer
  coordinator: ConsumerDashboard // Coordinators use consumer dashboard
} as const;

// Helper function to get appropriate dashboard component for user role
export const getDashboardComponent = (userRole: string) => {
  return dashboardComponents[userRole as keyof typeof dashboardComponents] || ConsumerDashboard;
};
