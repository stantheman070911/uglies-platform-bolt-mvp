import { User, UserRole } from '@/types/auth';

export const demoFarmers: User[] = [
  {
    id: '1',
    email: 'farmer@greenvalley.com',
    role: UserRole.FARMER,
    displayName: 'Green Valley Farms',
    avatarUrl: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg',
    bio: 'Family-owned organic farm specializing in avocados and seasonal vegetables.',
    region: 'local_area',
    createdAt: '2023-01-15T08:00:00Z',
    lastLogin: '2023-09-15T14:30:00Z',
    isVerified: true,
    isActive: true,
    preferences: {
      farmStory: 'Our journey began in 1985 when we decided to transform our traditional farm into a fully organic operation. Today, we proudly grow over 20 varieties of vegetables and fruits, focusing on sustainable farming practices that protect our soil and environment for future generations.',
      certifications: ['USDA Organic', 'Non-GMO Project'],
      specialties: ['Heirloom Tomatoes', 'Organic Avocados', 'Seasonal Greens'],
      socialMedia: {
        instagram: '@greenvalleyfarms',
        facebook: 'greenvalleyorganics'
      }
    },
    stats: {
      products: 12,
      groups: 8,
      participations: 0
    }
  },
  {
    id: '2',
    email: 'farmer@sunshineorganics.com',
    role: UserRole.FARMER,
    displayName: 'Sunshine Organics',
    avatarUrl: 'https://images.pexels.com/photos/2287252/pexels-photo-2287252.jpeg',
    bio: 'Specializing in berries and greenhouse vegetables grown with sustainable methods.',
    region: 'organic_certified',
    createdAt: '2023-02-20T10:00:00Z',
    lastLogin: '2023-09-16T09:15:00Z',
    isVerified: true,
    isActive: true,
    preferences: {
      farmStory: 'Since 2010, we\'ve been pioneering innovative greenhouse techniques that allow us to grow the sweetest berries and most flavorful vegetables year-round. Our hydroponic systems use 90% less water than traditional farming while producing exceptional quality produce.',
      certifications: ['Certified Organic', 'Regenerative Organic'],
      specialties: ['Premium Berries', 'Greenhouse Tomatoes', 'Fresh Herbs'],
      socialMedia: {
        instagram: '@sunshineorganics',
        twitter: '@sunshineorganics'
      }
    },
    stats: {
      products: 8,
      groups: 5,
      participations: 0
    }
  },
  {
    id: '3',
    email: 'farmer@heritageroots.com',
    role: UserRole.FARMER,
    displayName: 'Heritage Roots',
    avatarUrl: 'https://images.pexels.com/photos/7728009/pexels-photo-7728009.jpeg',
    bio: 'Traditional farming methods passed down through generations, specializing in heirloom varieties.',
    region: 'heritage_farms',
    createdAt: '2023-03-10T14:00:00Z',
    lastLogin: '2023-09-17T11:45:00Z',
    isVerified: true,
    isActive: true,
    preferences: {
      farmStory: 'Our family has been farming this land for three generations, preserving traditional agricultural practices while growing rare and heirloom varieties. We believe in maintaining biodiversity and keeping these unique flavors alive for future generations to enjoy.',
      certifications: ['Naturally Grown', 'Fair Trade'],
      specialties: ['Heirloom Vegetables', 'Ancient Grains', 'Heritage Apple Varieties'],
      socialMedia: {
        instagram: '@heritageroots',
        facebook: 'heritagerootsfarming'
      }
    },
    stats: {
      products: 15,
      groups: 6,
      participations: 0
    }
  }
];