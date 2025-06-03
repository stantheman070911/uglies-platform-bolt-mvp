import { GroupBuy, GroupStatus } from '@/types/groups';

export const demoGroups: GroupBuy[] = [
  {
    id: '1',
    productId: '1',
    name: 'Organic Avocados Group Buy',
    description: 'Join our group to purchase organic avocados directly from Green Valley Farms at a discounted price!',
    targetQuantity: 200,
    currentQuantity: 140,
    unitPrice: 2.99,
    discountUnitPrice: 1.99,
    currency: 'USD',
    creatorId: '101',
    status: GroupStatus.ACTIVE,
    startDate: '2023-09-15T08:00:00Z',
    endDate: '2023-09-22T08:00:00Z',
    minParticipants: 5,
    maxParticipants: 20,
    currentParticipants: 14,
    isPublic: true,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'San Francisco, CA'
    },
    createdAt: '2023-09-15T08:00:00Z',
    updatedAt: '2023-09-15T08:00:00Z'
  },
  {
    id: '2',
    productId: '2',
    name: 'Fresh Strawberries Group Buy',
    description: 'Get the freshest strawberries from Sunshine Organics at a special group discount!',
    targetQuantity: 100,
    currentQuantity: 45,
    unitPrice: 4.99,
    discountUnitPrice: 3.49,
    currency: 'USD',
    creatorId: '102',
    status: GroupStatus.ACTIVE,
    startDate: '2023-09-16T10:00:00Z',
    endDate: '2023-09-19T10:00:00Z',
    minParticipants: 3,
    maxParticipants: 20,
    currentParticipants: 9,
    isPublic: true,
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: 'Los Angeles, CA'
    },
    createdAt: '2023-09-16T10:00:00Z',
    updatedAt: '2023-09-16T10:00:00Z'
  },
  {
    id: '3',
    productId: '3',
    name: 'Heirloom Tomatoes Group Buy',
    description: 'Join us to purchase colorful, flavorful heirloom tomatoes from Heritage Roots!',
    targetQuantity: 150,
    currentQuantity: 38,
    unitPrice: 5.99,
    discountUnitPrice: 4.25,
    currency: 'USD',
    creatorId: '103',
    status: GroupStatus.ACTIVE,
    startDate: '2023-09-17T09:00:00Z',
    endDate: '2023-09-24T09:00:00Z',
    minParticipants: 5,
    maxParticipants: 20,
    currentParticipants: 5,
    isPublic: true,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY'
    },
    createdAt: '2023-09-17T09:00:00Z',
    updatedAt: '2023-09-17T09:00:00Z'
  }
];