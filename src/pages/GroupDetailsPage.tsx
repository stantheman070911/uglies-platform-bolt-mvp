import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { JoinGroupModal, ShareGroupModal } from '@/components/ui/Modal';
import { GroupBuyingService } from '@/services/groups';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, Clock, TrendingUp, Share2, MapPin,
  MessageCircle, Send, Image, Smile, Paperclip
} from 'lucide-react';

const GroupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadGroupDetails();

      // Set up real-time subscriptions
      const participantSubscription = GroupBuyingService.subscribeToGroupParticipants(
        id,
        () => loadGroupDetails()
      );

      const statusSubscription = GroupBuyingService.subscribeToGroupStatus(
        id,
        () => loadGroupDetails()
      );

      return () => {
        participantSubscription?.unsubscribe();
        statusSubscription?.unsubscribe();
      };
    }
  }, [id]);

  const loadGroupDetails = async () => {
    if (!id) return;

    try {
      const result = await GroupBuyingService.getGroupDetails(id);
      if (result.success) {
        setGroup(result.data);
      }
    } catch (error) {
      console.error('Failed to load group details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (quantity: number) => {
    if (!group || !user?.id) return;

    try {
      const result = await GroupBuyingService.joinGroup(
        group.id,
        user.id,
        quantity
      );

      if (result.success) {
        setJoinModalOpen(false);
        loadGroupDetails();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="載入團購資訊..." />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-surface-900 mb-4">找不到此團購</h2>
        <p className="text-surface-600 mb-6">此團購可能已結束或不存在</p>
        <MaterialButton href="/groups" iconType="arrow" icon="leading">
          返回團購列表
        </MaterialButton>
      </div>
    );
  }

  const progress = Math.min(100, (group.current_quantity / group.target_quantity) * 100);
  const remaining = Math.max(0, group.target_quantity - group.current_quantity);
  const deadline = new Date(group.end_date);
  const now = new Date();
  const timeLeft = deadline.getTime() - now.getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const daysLeft = Math.floor(hoursLeft / 24);

  const statusColors = {
    forming: 'text-primary-600 bg-primary-100',
    active: 'text-secondary-600 bg-secondary-100',
    completed: 'text-success-600 bg-success-100',
    cancelled: 'text-error-600 bg-error-100'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={group.product?.images?.[0] || '/placeholder-product.jpg'}
                alt={group.product?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-2xl font-bold mb-1">{group.product?.name}</h1>
                  <p className="text-white/90">
                    由 {group.product?.farmer?.display_name} 提供
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[group.status]}`}>
                    {group.status === 'forming' ? '募集中' :
                     group.status === 'active' ? '進行中' :
                     group.status === 'completed' ? '已完成' : '已取消'}
                  </span>
                  <div className="flex items-center text-surface-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="capitalize">{group.region?.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary-600">
                    ${group.current_price_per_unit}
                  </div>
                  <div className="text-sm text-surface-500">每 {group.product?.unit}</div>
                </div>
              </div>

              <p className="text-surface-600 mb-6">{group.description}</p>

              {/* Progress */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">目前進度</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary-400 to-secondary-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-surface-900">{remaining}</div>
                    <div className="text-sm text-surface-600">還差</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-surface-900">
                      {daysLeft > 0 ? `${daysLeft}天` : `${hoursLeft}小時`}
                    </div>
                    <div className="text-sm text-surface-600">剩餘時間</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-surface-900">
                      {group.participants?.length || 0}
                    </div>
                    <div className="text-sm text-surface-600">參與人數</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {group.status === 'forming' && (
                  <MaterialButton
                    onClick={() => setJoinModalOpen(true)}
                    fullWidth
                    iconType="plus"
                    icon="leading"
                    color="secondary"
                  >
                    加入團購
                  </MaterialButton>
                )}
                
                <MaterialButton
                  variant="outlined"
                  onClick={() => setShareModalOpen(true)}
                  iconType="share"
                  icon="leading"
                  className={group.status === 'forming' ? 'w-auto' : 'flex-1'}
                >
                  分享
                </MaterialButton>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="p-4 border-b border-surface-200">
              <h3 className="font-semibold text-surface-900">團購討論</h3>
            </div>
            
            <div className="h-96 p-4 space-y-4 overflow-y-auto">
              {/* Sample Messages */}
              <div className="flex items-start space-x-3">
                <img
                  src={group.product?.farmer?.avatar_url || '/placeholder-avatar.jpg'}
                  alt="Farmer"
                  className="w-8 h-8 rounded-full"
                />
                <div className="bg-surface-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm text-surface-900">
                    歡迎大家加入這次的團購！如果有任何問題都可以在這裡詢問喔！
                  </p>
                  <span className="text-xs text-surface-500 mt-1 block">
                    14:30
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-surface-200">
              <div className="flex items-center space-x-2">
                <MaterialButton
                  variant="text"
                  size="small"
                  iconType="custom"
                  customIcon={<Image className="w-5 h-5" />}
                  icon="only"
                />
                <MaterialButton
                  variant="text"
                  size="small"
                  iconType="custom"
                  customIcon={<Smile className="w-5 h-5" />}
                  icon="only"
                />
                <MaterialButton
                  variant="text"
                  size="small"
                  iconType="custom"
                  customIcon={<Paperclip className="w-5 h-5" />}
                  icon="only"
                />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="輸入訊息..."
                  className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <MaterialButton
                  variant="text"
                  size="small"
                  iconType="custom"
                  customIcon={<Send className="w-5 h-5" />}
                  icon="only"
                  disabled={!message.trim()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <h3 className="font-semibold text-surface-900 mb-4">
              參與者 ({group.participants?.length || 0})
            </h3>
            <div className="space-y-4">
              {group.participants?.map((participant: any) => (
                <div key={participant.id} className="flex items-center space-x-3">
                  <img
                    src={participant.user?.avatar_url || '/placeholder-avatar.jpg'}
                    alt={participant.user?.display_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-surface-900">
                      {participant.user?.display_name}
                    </div>
                    <div className="text-sm text-surface-500">
                      {participant.quantity} {group.product?.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <h3 className="font-semibold text-surface-900 mb-4">取貨資訊</h3>
            <div className="space-y-3 text-surface-600">
              <p>
                取貨方式：
                {group.delivery_method === 'home' ? '宅配到府' :
                 group.delivery_method === 'store' ? '超商取貨' : '定點取貨'}
              </p>
              {group.delivery_location && (
                <p>取貨地點：{group.delivery_location}</p>
              )}
              <p>預計出貨：團購結束後 3-5 個工作天</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <JoinGroupModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoin={handleJoinGroup}
        group={group}
      />

      <ShareGroupModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        inviteCode={group.invite_code}
        groupTitle={group.product?.name}
      />
    </div>
  );
};

export default GroupDetailsPage;