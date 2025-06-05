import React, { useState, useEffect } from 'react';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { GroupCard } from '@/components/ui/MaterialCard';
import { LoadingSpinner, GroupLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { JoinGroupModal, ShareGroupModal } from '@/components/ui/Modal';
import { GroupBuyingService } from '@/services/groups';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, Search, Filter, Users, Clock, 
  TrendingUp, MapPin, Package, Share2 
} from 'lucide-react';

interface GroupFilters {
  status: string;
  region: string;
  category: string;
  timeLeft: string;
  searchQuery: string;
}

const GroupsPage: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [filters, setFilters] = useState<GroupFilters>({
    status: '',
    region: user?.region || '',
    category: '',
    timeLeft: '',
    searchQuery: ''
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'forming', label: '🔄 Forming Groups' },
    { value: 'active', label: '✅ Active Groups' },
    { value: 'completed', label: '🎉 Completed' }
  ];

  const regionOptions = [
    { value: '', label: 'All Regions' },
    { value: 'local_area', label: '🏡 Local Area' },
    { value: 'nearby', label: '🌱 Nearby Farms' },
    { value: 'urban_farming', label: '🏢 Urban Agriculture' },
    { value: 'organic_certified', label: '🌿 Certified Organic' },
    { value: 'heritage_farms', label: '🌾 Heritage Varieties' },
    { value: 'seasonal_local', label: '📅 Seasonal Focus' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'vegetables', label: '🥬 Vegetables' },
    { value: 'fruits', label: '🍎 Fruits' },
    { value: 'grains', label: '🌾 Grains & Legumes' },
    { value: 'herbs', label: '🌿 Herbs & Spices' }
  ];

  useEffect(() => {
    loadGroups();
  }, [filters]);

  useEffect(() => {
    // Set up real-time subscriptions for group updates using the new method
    const subscription = GroupBuyingService.subscribeToAllGroupChanges(() => {
      loadGroups();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const result = await GroupBuyingService.getActiveGroups(
        filters.region || undefined,
        50
      );

      if (result.success) {
        let filteredGroups = result.data || [];

        // Apply client-side filters
        if (filters.status) {
          filteredGroups = filteredGroups.filter(group => group.status === filters.status);
        }

        if (filters.category) {
          filteredGroups = filteredGroups.filter(group => 
            group.product?.category === filters.category
          );
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredGroups = filteredGroups.filter(group =>
            group.product?.name.toLowerCase().includes(query) ||
            group.product?.farmer?.display_name.toLowerCase().includes(query)
          );
        }

        if (filters.timeLeft) {
          const now = new Date();
          filteredGroups = filteredGroups.filter(group => {
            const deadline = new Date(group.deadline);
            const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
            
            switch (filters.timeLeft) {
              case 'urgent': return hoursLeft <= 6;
              case 'today': return hoursLeft <= 24;
              case 'week': return hoursLeft <= 168;
              default: return true;
            }
          });
        }

        setGroups(filteredGroups);
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = (group: any) => {
    setSelectedGroup(group);
    setJoinModalOpen(true);
  };

  const handleShareGroup = (group: any) => {
    setSelectedGroup(group);
    setShareModalOpen(true);
  };

  const handleGroupJoin = async (quantity: number) => {
    if (!selectedGroup || !user?.id) return;

    try {
      const result = await GroupBuyingService.joinGroup(
        selectedGroup.id,
        user.id,
        quantity
      );

      if (result.success) {
        setJoinModalOpen(false);
        loadGroups(); // Refresh to show updated group
      } else {
        console.error('Failed to join group:', result.error);
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const stats = {
    totalGroups: groups.length,
    formingGroups: groups.filter(g => g.status === 'forming').length,
    activeGroups: groups.filter(g => g.status === 'active').length,
    nearDeadline: groups.filter(g => {
      const deadline = new Date(g.deadline);
      const hoursLeft = (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60);
      return hoursLeft <= 24;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Group Buying</h1>
          <p className="text-surface-600 mt-1">
            Join forces with neighbors to get better prices on fresh produce
          </p>
        </div>
        
        <MaterialButton
          iconType="plus"
          icon="leading"
          href="/groups/create"
          color="secondary"
        >
          Start New Group
        </MaterialButton>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-600">Total Groups</p>
              <p className="text-2xl font-bold text-surface-900">{stats.totalGroups}</p>
            </div>
            <Users className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-600">Forming</p>
              <p className="text-2xl font-bold text-secondary-600">{stats.formingGroups}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-secondary-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-600">Active</p>
              <p className="text-2xl font-bold text-tertiary-600">{stats.activeGroups}</p>
            </div>
            <Package className="w-8 h-8 text-tertiary-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-600">Ending Soon</p>
              <p className="text-2xl font-bold text-error-600">{stats.nearDeadline}</p>
            </div>
            <Clock className="w-8 h-8 text-error-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-surface-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="xl:col-span-2">
            <MaterialInput
              placeholder="Search groups, products, farmers..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              startIcon={<Search className="w-5 h-5" />}
              showClearButton
              onClear={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              fullWidth
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={filters.region}
              onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {regionOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Left Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-surface-100">
          <span className="text-sm font-medium text-surface-700 mr-2">Time Left:</span>
          {[
            { value: '', label: 'All' },
            { value: 'urgent', label: '⚡ Urgent (6h)' },
            { value: 'today', label: '📅 Today (24h)' },
            { value: 'week', label: '📆 This Week' }
          ].map(option => (
            <MaterialButton
              key={option.value}
              variant={filters.timeLeft === option.value ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setFilters(prev => ({ ...prev, timeLeft: option.value }))}
            >
              {option.label}
            </MaterialButton>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <GroupLoadingSpinner key={index} />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No groups found</h3>
          <p className="text-surface-600 mb-6">
            Be the first to start a group buy in your area!
          </p>
          <MaterialButton
            href="/groups/create"
            iconType="plus"
            icon="leading"
            color="secondary"
          >
            Start New Group
          </MaterialButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onJoin={() => handleJoinGroup(group)}
              onViewDetails={() => console.log('View details:', group.id)}
              className="hover:shadow-lg transition-shadow"
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {!loading && groups.length >= 20 && (
        <div className="text-center">
          <MaterialButton
            variant="outlined"
            size="large"
            onClick={loadGroups}
          >
            Load More Groups
          </MaterialButton>
        </div>
      )}

      {/* Join Group Modal */}
      <JoinGroupModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoin={handleGroupJoin}
        group={selectedGroup}
      />

      {/* Share Group Modal */}
      <ShareGroupModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        inviteCode={selectedGroup?.invite_code || ''}
        groupTitle={selectedGroup?.product?.name || ''}
      />
    </div>
  );
};

export default GroupsPage;