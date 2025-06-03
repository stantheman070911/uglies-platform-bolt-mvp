import { User, UserRole } from '@/types/auth';

export const demoFarmers: User[] = [
  {
    id: '1',
    email: 'farmer@greenvalley.com',
    role: UserRole.FARMER,
    displayName: 'Green Valley Farms',
    avatarUrl: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg',
    createdAt: '2023-01-15T08:00:00Z',
    lastLogin: '2023-09-15T14:30:00Z',
    isVerified: true,
    isActive: true,
    metadata: {
      location: 'California, USA',
      bio: 'Family-owned organic farm specializing in avocados and seasonal vegetables.',
      founded: '1985',
      certifications: ['USDA Organic', 'Non-GMO Project'],
      socialMedia: {
        instagram: '@greenvalleyfarms',
        facebook: 'greenvalleyorganics'
      }
    }
  },
  {
    id: '2',
    email: 'farmer@sunshineorganics.com',
    role: UserRole.FARMER,
    displayName: 'Sunshine Organics',
    avatarUrl: 'https://images.pexels.com/photos/2287252/pexels-photo-2287252.jpeg',
    createdAt: '2023-02-20T10:00:00Z',
    lastLogin: '2023-09-16T09:15:00Z',
    isVerified: true,
    isActive: true,
    metadata: {
      location: 'Ontario, Canada',
      bio: 'Specializing in berries and greenhouse vegetables grown with sustainable methods.',
      founded: '2010',
      certifications: ['Certified Organic', 'Regenerative Organic'],
      socialMedia: {
        instagram: '@sunshineorganics',
        twitter: '@sunshineorganics'
      }
    }
  },
  {
    id: '3',
    email: 'farmer@heritageroots.com',
    role: UserRole.FARMER,
    displayName: 'Heritage Roots',
    avatarUrl: 'https://images.pexels.com/photos/7728009/pexels-photo-7728009.jpeg',
    createdAt: '2023-03-10T14:00:00Z',
    lastLogin: '2023-09-17T11:45:00Z',
    isVerified: true,
    isActive: true,
    metadata: {
      location: 'Oaxaca, Mexico',
      bio: 'Traditional farming methods passed down through generations, specializing in heirloom varieties.',
      founded: '1978',
      certifications: ['Naturally Grown', 'Fair Trade'],
      socialMedia: {
        instagram: '@heritageroots',
        facebook: 'heritagerootsfarming'
      }
    }
  }
];