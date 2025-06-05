export enum UserRole {
  FARMER = 'farmer',
  CUSTOMER = 'customer',
  COORDINATOR = 'coordinator',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  region?: string;
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
  isActive: boolean;
  preferences: Record<string, any>;
  stats?: {
    products: number;
    groups: number;
    participations: number;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  displayName: string;
  role: UserRole;
}