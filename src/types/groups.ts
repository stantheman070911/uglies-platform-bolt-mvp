export enum GroupStatus {
  FORMING = 'forming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface GroupBuy {
  id: string;
  productId: string;
  name: string;
  description?: string;
  targetQuantity: number;
  currentQuantity: number;
  unitPrice: number;
  discountUnitPrice: number;
  currency: string;
  creatorId: string;
  status: GroupStatus;
  startDate: string;
  endDate: string;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  isPublic: boolean;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GroupParticipant {
  id: string;
  groupId: string;
  userId: string;
  quantity: number;
  joinedAt: string;
  status: 'joined' | 'left' | 'removed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  createdAt: string;
  isSystemMessage: boolean;
}