import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProductCard } from '@/components/ui/MaterialCard';
import { ProductService } from '@/services/products';
import { GroupBuyingService } from '@/services/groups';
import { useAuth } from '@/hooks/useAuth';
import { Search, Package, Users, Clock, MapPin } from 'lucide-react';

const CreateGroupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupData, setGroupData] = useState({
    targetQuantity: '',
    deadline: '',
    deliveryMethod: 'home',
    region: user?.region || 'local_area'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryMethods = [
    { value: 'home', label: '🏠 宅配', description: '直接送到府上' },
    { value: 'store', label: '🏪 超商取貨', description: '全台超商皆可取貨' },
    { value: 'pickup', label: '📍 定點取貨', description: '指定地點自取' }
  ];

  const regions = [
    { value: 'local_area', label: '🏡 在地小農' },
    { value: 'nearby', label: '🌱 鄰近農場' },
    { value: 'urban_farming', label: '🏢 都市農業' },
    { value: 'organic_certified', label: '🌿 有機認證' },
    { value: 'heritage_farms', label: '🌾 傳統農場' },
    { value: 'seasonal_local', label: '📅 當季在地' }
  ];

  useEffect(() => {
    if (step === 1) {
      loadProducts();
    }
  }, [step, searchQuery]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const result = await ProductService.getProducts({ 
        limit: 20,
        search: searchQuery || undefined
      });

      if (result.success) {
        setProducts(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!groupData.targetQuantity) {
      newErrors.targetQuantity = '請輸入目標數量';
    } else if (Number(groupData.targetQuantity) < 2) {
      newErrors.targetQuantity = '最少需要2件商品';
    }

    if (!groupData.deadline) {
      newErrors.deadline = '請選擇截止時間';
    } else {
      const deadline = new Date(groupData.deadline);
      const now = new Date();
      const minDeadline = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      if (deadline <= minDeadline) {
        newErrors.deadline = '截止時間必須至少在2小時後';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGroupData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2() || !selectedProduct || !user?.id) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await GroupBuyingService.createGroup({
        productId: selectedProduct.id,
        initiatorId: user.id,
        targetQuantity: Number(groupData.targetQuantity),
        basePrice: selectedProduct.price,
        deadline: groupData.deadline,
        deliveryMethod: groupData.deliveryMethod,
        region: groupData.region,
        title: `${selectedProduct.name} 團購`
      });

      if (result.success && result.data?.id) {
        navigate(`/groups/${result.data.id}`);
      } else {
        setErrors({ submit: result.error || '建立團購失敗' });
      }
    } catch (error: any) {
      setErrors({ submit: '發生未預期的錯誤' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const potentialSavings = (() => {
    if (!selectedProduct || !groupData.targetQuantity) return null;

    const basePrice = selectedProduct.price;
    const quantity = Number(groupData.targetQuantity);
    const groupPrice = GroupBuyingService.calculateGroupPrice(basePrice, quantity);
    const savings = (basePrice - groupPrice) * quantity;
    const savingsPercentage = Math.round(((basePrice - groupPrice) / basePrice) * 100);

    return { basePrice, groupPrice, savings, savingsPercentage };
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">發起團購</h1>
        <p className="text-surface-600">
          {step === 1 ? "選擇想要團購的商品" : "設定團購細節"}
        </p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 1 ? 'bg-secondary-500 text-white' : 'bg-surface-200 text-surface-500'
          }`}>
            <Package className="w-5 h-5" />
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-secondary-500' : 'bg-surface-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 2 ? 'bg-secondary-500 text-white' : 'bg-surface-200 text-surface-500'
          }`}>
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <div className="max-w-md mx-auto">
            <MaterialInput
              placeholder="搜尋商品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Search className="w-5 h-5" />}
              showClearButton
              onClear={() => setSearchQuery('')}
              fullWidth
            />
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <LoadingSpinner key={index} variant="skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">找不到商品</h3>
              <p className="text-surface-600">請嘗試其他關鍵字</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} onClick={() => handleProductSelect(product)}>
                  <ProductCard
                    product={product}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-200">
            <div className="flex items-start space-x-4">
              <img
                src={selectedProduct.images?.[0] || '/placeholder-product.jpg'}
                alt={selectedProduct.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-surface-900 mb-1">{selectedProduct.name}</h3>
                <p className="text-sm text-surface-600 mb-2">
                  由 {selectedProduct.farmer?.display_name} 提供
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-secondary-600">
                    ${selectedProduct.price}
                  </span>
                  <span className="text-surface-500">/ {selectedProduct.unit}</span>
                </div>
              </div>
              <MaterialButton
                variant="text"
                size="small"
                onClick={() => setStep(1)}
              >
                更換商品
              </MaterialButton>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-200 p-6 space-y-6">
            <MaterialInput
              label="目標數量"
              type="number"
              min="2"
              value={groupData.targetQuantity}
              onChange={handleInputChange('targetQuantity')}
              error={errors.targetQuantity}
              startIcon={<Package className="w-5 h-5" />}
              fullWidth
            />

            <MaterialInput
              label="截止時間"
              type="datetime-local"
              value={groupData.deadline}
              onChange={handleInputChange('deadline')}
              error={errors.deadline}
              startIcon={<Clock className="w-5 h-5" />}
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">
                取貨方式
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {deliveryMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`
                      flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all
                      ${groupData.deliveryMethod === method.value 
                        ? 'border-secondary-500 bg-secondary-50' 
                        : 'border-surface-200 hover:border-surface-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={method.value}
                      checked={groupData.deliveryMethod === method.value}
                      onChange={handleInputChange('deliveryMethod')}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium text-surface-900">{method.label}</div>
                      <div className="text-sm text-surface-600">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                目標區域
              </label>
              <select
                value={groupData.region}
                onChange={handleInputChange('region')}
                className="w-full px-4 py-3 border-2 border-surface-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>{region.label}</option>
                ))}
              </select>
            </div>
          </div>

          {potentialSavings && (
            <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl p-6 border border-secondary-200">
              <h3 className="font-semibold text-surface-900 mb-4">💰 預估節省金額</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-surface-600">原價</p>
                  <p className="text-xl font-bold text-surface-900">
                    ${potentialSavings.basePrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-surface-600">團購價</p>
                  <p className="text-xl font-bold text-secondary-600">
                    ${potentialSavings.groupPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-surface-600">總共節省</p>
                  <p className="text-xl font-bold text-primary-600">
                    ${potentialSavings.savings.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-surface-600">折扣</p>
                  <p className="text-xl font-bold text-tertiary-600">
                    {potentialSavings.savingsPercentage}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3">
            <MaterialButton
              variant="outlined"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
              className="flex-1"
            >
              返回選擇商品
            </MaterialButton>
            
            <MaterialButton
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
              iconType="users"
              icon="leading"
              color="secondary"
            >
              {isSubmitting ? '建立中...' : '建立團購'}
            </MaterialButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroupPage;